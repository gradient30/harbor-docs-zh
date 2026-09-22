# 预集成 Agent {#pre-integrated-agents}

> 运行 Harbor 已支持的 Agent。

Harbor 内置了多种 Agent 集成，无需额外安装依赖即可使用。

**CLI**

```bash
    export OPENAI_API_KEY="..."
    harbor run \
      -t hello-world/hello-world \
      -a codex -m openai/gpt-5.6-sol
    ```

**Config**

```json
    {
      "agents": [
        {
          "name": "codex",
          "model_name": "openai/gpt-5.6-sol"
        }
      ],
      "tasks": [
        {
          "name": "hello-world/hello-world"
        }
      ]
    }
    ```

    ```bash
    export OPENAI_API_KEY="..."
    harbor run --config config.json
    ```

**Python**

```python
    import asyncio

    from harbor.job import Job
    from harbor.models.job.config import JobConfig
    from harbor.models.trial.config import AgentConfig, TaskConfig

    async def main():
        job = await Job.create(
            JobConfig(
                agents=[
                    AgentConfig(
                        name="codex",
                        model_name="openai/gpt-5.6-sol",
                    )
                ],
                tasks=[TaskConfig(name="hello-world/hello-world")],
            )
        )
        await job.run()

    asyncio.run(main())
    ```

使用 `-a` 选择 Agent，使用 `-m` 选择其模型。运行 `harbor run --help` 查看当前可用选项。

## 可用 Agent {#available-agents}

### Agent 名称 {#agent-names}

`aider`, `antigravity-cli`, `antigravity-sdk`, `claude-code`, `cline-cli`,
  `codex`, `computer-1`, `copilot-cli`, `cortex-code`, `cursor-cli`, `deerflow`,
  `devin`, `dspy-rlm`, `eve`, `fx`, `gemini-cli`, `goose`, `grok-build`,
  `hermes`, `junie`, `kimi-code`, `kimi-cli`, `langgraph`, `mcode`,
  `mimo`, `mini-swe-agent`, `muse-code`, `nemo-agent`, `openclaw`, `opencode`,
  `openhands`, `openhands-sdk`, `oracle`, `nop`, `pi`, `qwen-coder`,
  `rovodev-cli`, `strands`, `swe-agent`, `terminus-2`, `trae-agent`, `vibe`

也可以运行来自 [ACP 注册表](/docs/core-concepts/agents/acp) 的 Agent，或添加[自定义 Agent](/docs/core-concepts/agents/custom-agents)。

## Agent 能力 {#agent-capabilities}

能力描述各集成所支持的可选功能。

| 能力                                                                                     | 用途                                                                                      | 支持的 Agent                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ATIF](/docs/core-concepts/agents/atif)                                                       | 生成 ATIF 轨迹                                                                            | `acp`, `antigravity-cli`, `antigravity-sdk`, `claude-code`, `cline-cli`, `codex`, `computer-1`, `copilot-cli`, `cortex-code`, `cursor-cli`, `devin`, `eve`, `gemini-cli`, `goose`, `grok-build`, `hermes`, `junie`, `kimi-cli`, `mimo`, `mini-swe-agent`, `nemo-agent`, `openclaw`, `opencode`, `openhands`, `openhands-sdk`, `qwen-coder`, `rovodev-cli`, `strands`, `swe-agent`, `terminus-2`, `trae-agent`, `vibe` |
| [恢复会话](/docs/core-concepts/tasks/multi-step)                                              | 在任务步骤之间继续原生会话                                                                | `aider`, `claude-code`, `codex`, `copilot-cli`, `cortex-code`, `gemini-cli`, `goose`, `junie`, `kimi-code`, `kimi-cli`, `mcode`, `mimo`, `opencode`, `pi`, `qwen-coder`                                                                                                                                                                                                                                               |
| [加载原生轨迹](/docs/core-concepts/jobs/loading-trajectories#native-trajectories)             | 恢复 Agent 的原生会话                                                                     | `claude-code`, `codex`                                                                                                                                                                                                                                                                                                                                                                                                |
| [加载 ATIF 轨迹](/docs/core-concepts/jobs/loading-trajectories#atif-trajectories-1)           | 加载先前的 ATIF 上下文                                                                    | `claude-code`, `codex`                                                                                                                                                                                                                                                                                                                                                                                                |
| [Handoff](/docs/core-concepts/jobs/handoff)                                                   | 在本地继续已完成的会话                                                                    | `claude-code`                                                                                                                                                                                                                                                                                                                                                                                                         |
| [原生配置](#native-configuration)                                                        | 接受 Agent 的原生配置格式                                                                 | `claude-code`, `codex`, `deerflow`, `junie`                                                                                                                                                                                                                                                                                                                                                                           |
| [Windows](/docs/core-concepts/tasks/environment#operating-system)                             | 在 Windows 任务容器中运行                                                                 | `nop`, `oracle`                                                                                                                                                                                                                                                                                                                                                                                                       |
| [ACP 桥接](/docs/core-concepts/jobs/simulate-a-user#bridge)                                   | 在模拟用户试次中作为目标 Agent                                                            | `claude-code`, `gemini-cli`                                                                                                                                                                                                                                                                                                                                                                                           |
| [MCP 服务器](/docs/core-concepts/tasks/environment#mcps)                                      | 将任务提供的 MCP 服务器配置暴露给 Agent 的运行时或提示词                                  | `acp`, `antigravity-cli`, `antigravity-sdk`, `claude-code`, `cline-cli`, `codex`, `copilot-cli`, `cursor-cli`, `dspy-rlm`, `eve`, `fx`, `gemini-cli`, `goose`, `grok-build`, `hermes`, `junie`, `kimi-cli`, `kimi-code`, `langgraph`, `mcode`, `mimo`, `mini-swe-agent`, `openclaw`, `opencode`, `openhands`, `openhands-sdk`, `qwen-coder`, `strands`, `terminus-2`, `vibe`                                          |
| [Skills](/docs/core-concepts/tasks/skills)                                                    | 通过 Agent 的原生配置或提示词，使任务提供的 Skills 可被发现                               | `antigravity-cli`, `antigravity-sdk`, `claude-code`, `cline-cli`, `codex`, `copilot-cli`, `cursor-cli`, `eve`, `fx`, `gemini-cli`, `goose`, `grok-build`, `hermes`, `junie`, `kimi-cli`, `kimi-code`, `mcode`, `mimo`, `openclaw`, `opencode`, `openhands-sdk`, `pi`, `qwen-coder`, `terminus-2`, `vibe`                                                                                                              |

MCP 服务器支持意味着该集成会将所提供的配置传递给 Agent；这并不保证能够连接到该服务器。

## Agent 选项 {#agent-options}

`--ak` 和 `--ae` 是最常用的两个 Agent 标志。运行 `harbor run --help` 查看完整集合。

| 标志                    | 用途                                                                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `--ak`, `--agent-kwarg` | 向 Agent 实现传递设置。数字、布尔值、列表和对象等值会被解析为对应类型。                                                                   |
| `--ae`, `--agent-env`   | 在 Agent 的安装与执行期间设置环境变量。值保持为字符串。                                                                                   |

> **说明** 每个 Agent 都有各自支持的 kwargs 和环境变量。设置之前请先查看该 Agent 的集成说明。

```bash
harbor run \
  -t hello-world/hello-world \
  -a claude-code -m anthropic/claude-sonnet-5 \
  --ak max_turns=20 \
  --ae MCP_TIMEOUT=20000
```

此处，`max_turns=20` 配置 Claude Code 集成，而 `MCP_TIMEOUT` 可供 Agent 进程使用。这两个标志都可以**重复**使用。

### 原生配置 {#native-configuration}

为对应 Agent 加载原生配置文件。可参考 [Claude Code settings.json](https://code.claude.com/docs/en/settings) 和 [Codex 配置 config.toml](https://learn.chatgpt.com/docs/config-file/config-reference) 作为示例。`claude-code`、`codex`、`deerflow` 和 `junie` 接受原生配置文件：

```bash
# Config file {#config-file}
harbor run ... -a codex --ak "config=path/to/config.toml"
```

也支持内联 JSON。Harbor 会将内联 JSON 转换为 Agent 的原生配置文件格式并传递给 Agent：

```bash
# Inline config {#inline-config}
harbor run ... -a codex --ak 'config={"model_context_window": 200000}'
```
