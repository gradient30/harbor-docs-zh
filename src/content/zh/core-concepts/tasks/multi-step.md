# 多步骤 {#multi-step}

> 跨多个里程碑评估 Agent 表现。

多步骤任务提供了一种在 Agent 运行过程中穿插验证的方式，并衡量 Agent 从先前会话继续工作的能力。它们适用于带有提前停止条件的长程任务，以及衡量记忆和持续学习能力。

## 格式 {#format}

多步骤任务的格式与典型 Harbor 任务不同：

```bash
task.toml
environment/
├── Dockerfile  # or some other spec
└── ...
tests/
├── helpers.py  # optional shared grading utilities
└── ...
steps/
├── step-1/
│   ├── instruction.md
│   ├── tests/
│   │   ├── test.sh
│   │   └── ...
│   ├── solution/
│   │   ├── solve.sh
│   │   └── ...
│   └── workdir/
│       ├── setup.sh  # optional
│       └── ...
└── step-2/
    └── ...
```

一个步骤可以包含以下文件和文件夹：

* `instruction.md`（必填）
* `tests/`（可选）
* `solution/`（可选）
* `workdir/`（可选）

## 配置 {#configuration}

在根目录的 `task.toml` 中按执行顺序声明步骤。每个 `name` 对应 `steps/` 下的一个目录。其他任务设置使用标准的[任务配置](/docs/core-concepts/tasks/configuration)。

```toml
multi_step_reward_strategy = "mean"

[agent]
timeout_sec = 600

[[steps]]
name = "step-1"
min_reward = 1.0

[steps.agent]
timeout_sec = 300

[[steps]]
name = "step-2"

[steps.verifier]
timeout_sec = 120
```

此处，`step-1` 的 Agent 超时为 300 秒；`step-2` 继承 600 秒。仅当 `step-1` 获得至少 `1.0` 的 `reward` 时，才会运行 `step-2`。

### 步骤 schema {#steps-schema}

每个 `[[steps]]` 条目接受：

- `name` (`string`) — `steps/` 下唯一、可移植的目录名。

- `agent` (`AgentConfig`) — 每步的 Agent 设置，使用任务的 `[agent]` schema。

- `verifier` (`VerifierConfig`) — 每步的验证器设置，使用任务的 `[verifier]` schema，包括[独立环境](/docs/core-concepts/tasks/separate-verifier)。

- `min_reward` (`number | object | null`) 默认 `null` — 继续执行所需的奖励阈值。参见 [提前停止](#early-stopping)。

- `healthcheck` (`HealthcheckConfig | null`) 默认 `null` — 步骤设置完成后、Agent 运行前的额外健康检查。使用环境健康检查 schema。

- `artifacts` (`list[string | ArtifactConfig]`) 默认 `[]` — 验证后额外收集的[产物](/docs/core-concepts/tasks/configuration#artifacts)，保存到 `steps/<name>/artifacts/`，并与任务级和试次级产物并存。

### 试次奖励 {#trial-reward}

在 `task.toml` 顶层设置 `multi_step_reward_strategy`：

* `"mean"`（默认）：对有验证器结果的各步骤奖励取平均；缺失的键计为零。
* `"final"`：使用最后执行步骤的验证器结果。

## 提前停止 {#early-stopping}

在步骤上设置 `min_reward`，以便在分数过低时跳过后续步骤。数字会检查 `reward` 键；对象则要求每个具名奖励都达到其阈值：

```toml
[[steps]]
name = "step-1"
min_reward = { accuracy = 0.9, safety = 1.0 }

[[steps]]
name = "step-2"
```

缺失的奖励键会使检查失败；相等即通过。没有 `min_reward` 时，低分不会停止执行。禁用验证时会忽略阈值，但步骤出错且没有验证器结果时仍会停止任务。

被跳过的步骤不计入试次奖励。`"final"` 使用最后执行的步骤；`"mean"` 对可用的验证器结果取平均。

## 测试辅助工具 {#test-helpers}

将共享辅助工具放在基础 `tests/` 中。Harbor 将它们复制到 `/tests/`，然后叠加该步骤的测试，覆盖同名文件。

[独立验证器](/docs/core-concepts/tasks/separate-verifier#image-selection) 在使用专用验证器镜像时采用打包的测试；回退到 Agent 环境时则使用相同的上传行为。

## 添加步骤专属环境文件 {#adding-step-specific-environment-files}

有时你希望在步骤开始时将文件上传到 Agent 的工作区。为此，将文件放在 `steps/<step-name>/workdir/`。Harbor 会在步骤开始前将它们复制到 Agent 的工作目录，覆盖匹配的路径。

```bash
steps/step-2/workdir/
├── input.csv
└── setup.sh
```

可选的 `setup.sh` 会在复制后用 Bash 运行。文件系统更改会在步骤之间持久保留。

## 恢复 Agent 会话 {#resuming-an-agent-session}

默认情况下，每个步骤都会开启全新对话。要继续上一步的会话，使用：

**CLI**

```bash
    harbor run \
      --path "<task-path>" \
      --agent "<agent>" \
      --model "<model>" \
      --resume-trajectory
    ```

**配置**

```yaml
    tasks:
      - path: "<task-path>"
    agents:
      - name: "<agent>"
        model_name: "<model>"
        resume_trajectory: true
    ```

需要 Agent 具备原生恢复支持。无论此设置如何，环境都会持久保留。

## 从指定步骤开始 {#starting-from-a-specific-step}

> **说明** 从指定步骤开始的功能即将推出。要启用该功能，请确保先前步骤包含 `solution/solve.sh` 文件。
