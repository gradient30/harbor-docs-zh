# 加载轨迹 {#loading-trajectories}

> 将先前轨迹加载到 Agent 会话中。

| 级别              | 配置                                     | 格式      | Agent                 |
| ------------------ | ------------------------------------------------- | ------------ | ---------------------- |
| 任务               | 指令目录中的 `trajectory.json`    | ATIF         | `claude-code`、`codex` |
| 运行（作业或试次） | `--load-trajectory` 或 `agents[].load_trajectory` | ATIF、原生 | `claude-code`、`codex` |

## 任务级加载 {#task-level-loading}

### ATIF 轨迹 {#atif-trajectories}

将名为 `trajectory.json` 的 ATIF 文件放在与
`instruction.md` 相同的目录中。对于多步骤任务，将其放在第一步的目录中。
当 Agent 支持 ATIF 加载时，Harbor 会加载它。

[任务级 ATIF 示例](https://github.com/harbor-framework/harbor/tree/main/examples/tasks/hello-load-atif-trajectory-task-level)

```bash
harbor run \
  -p examples/tasks/hello-load-atif-trajectory-task-level \
  -a codex -m openai/gpt-5.6-sol -e daytona
```

## 运行级加载 {#run-level-loading}

运行级加载会覆盖任务级加载。

`.json` 选择 ATIF。其他后缀选择 Agent 的原生加载器。
`claude-code` 和 `codex` 的原生加载器期望 `.jsonl` 并校验文件名。

`load_trajectory` 不能与模拟的 `user_agent` 组合使用。

### 原生轨迹 {#native-trajectories}

原生轨迹是 Agent 特定的 `.jsonl` 会话文件。加载原生轨迹是
无损的，并且需要使用相同的 Agent。Harbor 将它们存储在
`agent/sessions/` 下：

[运行级原生示例](https://github.com/harbor-framework/harbor/tree/main/examples/tasks/hello-load-native-trajectory)

```bash
harbor run \
  -p examples/tasks/hello-load-native-trajectory \
  -a claude-code -m opus -e daytona \
  --load-trajectory examples/tasks/hello-load-native-trajectory/environment/d7d4e19e-608d-44ef-b166-cd050ef274ba.jsonl
```

| Agent         | 原生轨迹文件                            |
| ------------- | ------------------------------------------------- |
| `claude-code` | `agent/sessions/projects/-app/<session-id>.jsonl` |
| `codex`       | `agent/sessions/<YYYY>/<MM>/<DD>/rollout-*.jsonl` |

移动文件时请保留文件名；Agent 用它来识别
会话。

### ATIF 轨迹 {#atif-trajectories}

Harbor 将 [ATIF](/docs/core-concepts/agents/atif) 输出存储在
`agent/trajectory.json`。ATIF 是可移植的：Harbor 会将其转换为加载
Agent 的原生格式，从而允许用一个 Agent 的轨迹为另一个 Agent 做初始输入。

[运行级 ATIF 示例](https://github.com/harbor-framework/harbor/tree/main/examples/tasks/hello-load-atif-trajectory-run-level)

```bash
harbor run \
  -p examples/tasks/hello-load-atif-trajectory-run-level \
  -a codex -m openai/gpt-5.6-sol -e daytona \
  --load-trajectory examples/tasks/hello-load-atif-trajectory-run-level/environment/trajectory.json
```

转换会保留受支持的消息、工具调用和工具结果。它可能
省略 Agent 特定细节、系统消息和非文本内容。

Agent 通过
`capabilities.load_native_trajectory` 和 `capabilities.load_atif_trajectory` 声明对每种格式的支持。
不受支持的格式、缺失文件、无效 ATIF 以及无效原生文件名
会在启动前失败。无效的原生内容可能在恢复期间失败。

以上示例使用 CLI。若改用作业配置：

```json
{
  "agents": [
    {
      "name": "codex",
      "load_trajectory": "path/to/trajectory.json"
    }
  ]
}
```

## 会恢复什么 {#what-is-restored}

原生加载恢复原生会话。ATIF 加载恢复可移植的
对话内容。两者都不会恢复沙箱文件。

对于[多步骤任务](/docs/core-concepts/tasks/multi-step)，加载发生在
第一步之前。使用 `--resume-trajectory` 时，会话为
`(load, resume, resume, ...)`；否则为 `(load, fresh, fresh, ...)`。
