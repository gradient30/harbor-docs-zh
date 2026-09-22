# 验证器 {#verifier}

> 任务验证。

`tests/test.sh` 脚本是验证器的入口。`tests/` 目录会在 Agent 运行后上传到环境中的 `/tests/`，或者在[独立运行](#separate-verifier-environment)时应包含在验证器镜像中。`tests/test.sh` 在任务的工作目录中执行，负责验证任务是否完成。它必须在 `/logs/verifier/reward.txt` 或 `/logs/verifier/reward.json` 写出一个数值奖励。

## 必需脚本 {#required-script}

| 操作系统 | 文件             |
| -------- | ---------------- |
| Linux    | `tests/test.sh`  |
| Windows  | `tests/test.bat` |

脚本应当：

1. 安装测试依赖（如需要）
2. 验证 Agent 已满足[指令](/docs/core-concepts/tasks/instruction)
3. 在 `/logs/verifier/` 下写入**奖励**

我们建议在脚本内使用**绝对路径**，以避免 `cwd` 带来的意外。

## 奖励文件 {#reward-files}

| 文件                         | 格式                                     |
| ---------------------------- | ---------------------------------------- |
| `/logs/verifier/reward.json` | 带标签数值指标的 JSON 键值对象           |
| `/logs/verifier/reward.txt`  | 单个数字，通常为 `1` 或 `0`              |

若两者都存在，Harbor 优先使用 `reward.json`。

### 示例 {#example}

```bash
#!/bin/bash
set -euo pipefail

uvx pytest /tests/test_outputs.py

if [ $? -eq 0 ]; then
  echo 1 > /logs/verifier/reward.txt
else
  echo 0 > /logs/verifier/reward.txt
fi
```

对于多指标或基于 LLM 的评分，可考虑使用 [RewardKit](/docs/core-concepts/rewardkit/quick-start)，或编写结构化的 `reward.json` 文件。

## 独立验证器环境 {#separate-verifier-environment}

Harbor 任务可以选择使用独立沙箱进行验证，从而加强 Agent 与验证器之间的安全边界。

要使用独立验证器沙箱，在 `task.toml` 中将 `[verifier.environment_mode]` 设为 `"separate"`，或包含与 `[environment]` 相同 schema 的 `[verifier.environment]` 段。

只要设置了其中任一，Harbor 就会将 `tests/` 目录视为验证器镜像的构建上下文，类似于 `environment/`。验证器镜像需要包含 `/tests/test.sh` 或 `/tests/test.bat`。

在 `task.toml` 的 `[artifacts]` 段中声明的产物会按与 Agent 沙箱相同的路径复制到验证器沙箱。

详见 [独立验证器](/docs/core-concepts/tasks/separate-verifier)。

### 示例 {#example}

```toml
[verifier]
environment_mode = "separate"

[verifier.environment]
cpus = 2
```

```dockerfile
FROM ubuntu:24.04

WORKDIR /app

COPY test.sh /tests/test.sh
```

## 重新评分 {#regrading}

如果任务使用独立验证器环境，Harbor 可以对已有试次重新运行验证器。这在迭代验证器时很有用。

详见 [重新评分](/docs/core-concepts/jobs/regrade)。

## 向验证器传递环境变量 {#passing-environment-variables-to-the-verifier}

可以使用 `task.toml` 中的 `[verifier.env]` 段向验证器传递环境变量。

```toml
[verifier.env]
ANTHROPIC_API_KEY = "${ANTHROPIC_API_KEY}"
MODEL_NAME = "claude-haiku-4-5"
```

`${VAR}` 语法用于从宿主机环境读取。Harbor 在将环境变量传给验证器之前会请用户确认。

## LLM 或 Agent 作为评判器 {#llm-or-agent-as-a-judge}

任务作者可以按自己喜欢的验证方式实现 `test.sh`，包括 LLM 或 Agent 作为评判器。

为避免样板代码，可考虑使用 [RewardKit](/docs/core-concepts/rewardkit/quick-start) 来定义评判器或程序化准则。

## `rewardkit` {#rewardkit}

Harbor 团队维护一个名为 [`harbor-rewardkit`](/docs/core-concepts/rewardkit/quick-start) 的包。它是定义和运行常见验证器（包括程序化准则以及 LLM 或 Agent 作为评判器）的最简便方式。
