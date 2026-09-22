# 环境变量 {#environment-variables}

> 控制哪些环境变量会到达 Harbor、沙箱、Agent 和验证器。

Harbor 按实际需要的位置隔离变量：Harbor 进程、沙箱、Agent 阶段或验证器阶段。

> **注意** 将沙箱提供方凭据（例如 `DAYTONA_API_KEY`）保留在 Harbor
>   进程中。通过 `environment.env`、`--agent-env` 或
>   `--verifier-env` 传入会不必要地将它们暴露在沙箱内，**不推荐**。

> **说明** `export` 和 `--env-file` 不会把每个变量都复制进沙箱。要将
>   诸如 `DATABASE_URL` 这样的主机变量传入，请将 `environment.env.DATABASE_URL` 显式设为
>   `${DATABASE_URL}`。

**共享验证器（默认）**

Agent 与验证器在同一沙箱中运行。

    <Frame caption="共享验证器的环境变量作用域">
      <img src="https://mintcdn.com/harborframework/XHi-ZTogIM2NSVlh/images/environment-variable-reach.png?fit=max&auto=format&n=XHi-ZTogIM2NSVlh&q=85&s=d6366aabc26d2bf45404a82980ebd484" alt="矩阵图，展示哪些变量会到达 Harbor 进程、Agent 阶段、验证器阶段以及生命周期命令" width="2880" height="808" data-path="images/environment-variable-reach.png" />
    </Frame>

    生命周期命令包括健康检查、步骤设置和收集钩子。
    它们在 Agent 与验证器阶段前后运行，只接收沙箱变量。

    | 作用域与可用性                                      | Shell 或 CLI              | `config.json`     | `task.toml`         | 示例           |
    | ----------------------------------------------------------- | ------------------------- | ----------------- | ------------------- | ----------------- |
    | **Harbor 进程**与环境提供方                 | `export`, `--env-file`    | —                 | —                   | `DAYTONA_API_KEY` |
    | **共享沙箱：**Agent、验证器与生命周期命令 | —                         | `environment.env` | `[environment.env]` | `DATABASE_URL`    |
    | **仅 Agent 阶段**                                        | `--agent-env` (`--ae`)    | `agents[].env`    | —                   | `OPENAI_API_KEY`  |
    | **仅验证器阶段**                                     | `--verifier-env` (`--ve`) | `verifier.env`    | `[verifier.env]`    | `REWARDKIT_MODEL` |

    <Frame caption="共享验证器的环境变量架构">
      <img src="https://mintcdn.com/harborframework/XHi-ZTogIM2NSVlh/images/shared-sandbox-variables.png?fit=max&auto=format&n=XHi-ZTogIM2NSVlh&q=85&s=803471b2ac60d1db928eb879452e0c65" alt="Harbor 进程管理共享沙箱，包含 Agent、验证器与生命周期命令作用域" width="3400" height="888" data-path="images/shared-sandbox-variables.png" />
    </Frame>

    Agent、验证器和生命周期命令共享同一个沙箱。阶段
    变量仅在对应阶段运行时添加，并会覆盖同名的沙箱
    变量。

**独立验证器**

[独立验证器](/docs/core-concepts/tasks/separate-verifier)在
    第二个沙箱中运行。Agent 阶段变量不会到达该沙箱；只有
    [收集的产物](/docs/core-concepts/jobs/artifact-collection)会从
    Agent 沙箱传入。

    <Frame caption="独立验证器的环境变量作用域">
      <img src="https://mintcdn.com/harborframework/PxOk-gLJgMnxNtMy/images/separate-verifier-environment-variable-reach.png?fit=max&auto=format&n=PxOk-gLJgMnxNtMy&q=85&s=da3f9bc79c00d4d974fe1b00da04d5b8" alt="矩阵图，展示哪些变量会到达 Harbor 进程、Agent 沙箱、验证器沙箱、各阶段以及生命周期命令" width="3480" height="808" data-path="images/separate-verifier-environment-variable-reach.png" />
    </Frame>

    `verifier.environment.env` 为验证器沙箱设置基线变量，
    包括其生命周期命令。`verifier.env` 仅在验证器阶段添加变量。

    | 作用域与可用性                      | Shell 或 CLI              | `config.json`                      | `task.toml`                         | 示例           |
    | ------------------------------------------- | ------------------------- | ---------------------------------- | ----------------------------------- | ----------------- |
    | **Harbor 进程**与环境提供方 | `export`, `--env-file`    | —                                  | —                                   | `DAYTONA_API_KEY` |
    | **沙箱基线**                        | —                         | `environment.env`（两个沙箱） | `[environment.env]`（Agent 沙箱） | `DATABASE_URL`    |
    | **仅 Agent 阶段**                        | `--agent-env` (`--ae`)    | `agents[].env`                     | —                                   | `OPENAI_API_KEY`  |
    | **仅验证器阶段**                     | `--verifier-env` (`--ve`) | `verifier.env`                     | `[verifier.env]`                    | `REWARDKIT_MODEL` |

    <Frame caption="独立验证器的环境变量架构">
      <img src="https://mintcdn.com/harborframework/PxOk-gLJgMnxNtMy/images/separate-verifier-sandbox-variables.png?fit=max&auto=format&n=PxOk-gLJgMnxNtMy&q=85&s=534a6821e7445bb80f092871ecd8f392" alt="Harbor 进程分别管理 Agent 与验证器沙箱，以及各自的阶段与生命周期命令作用域" width="3480" height="1424" data-path="images/separate-verifier-sandbox-variables.png" />
    </Frame>

    > **说明** 若启用独立模式但未设置 `[verifier.environment]`，Harbor
>       会复制顶层 `[environment]`。因此其 `[environment.env]` 变量
>       也会成为验证器沙箱的基线。

    验证器阶段变量会覆盖同名的验证器沙箱变量。Agent 阶段变量在 Agent 沙箱中遵循相同规则。

## 自动转发 Agent 凭据 {#automatic-agent-credential-forwarding}

部分[内置 Agent](/docs/core-concepts/agents/pre-integrated-agents) 会自动识别
选定的主机变量。例如，Codex 会从 Harbor 进程读取
`OPENAI_API_KEY`，并在 Codex Agent 阶段使其可用。此行为因 Agent 而异；无关的主机变量不会被
转发。

### 常见的自动 Agent 凭据转发 {#common-automatic-agent-credential-forwarding}

这些主机凭据仅在对应命名 Agent 的阶段可用。
  通过 `--agent-env` 传入的值优先。

  | Agent                                                                                                          | 识别的主机凭据                                                                                                                             | 转发为                                                                  |
  | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
  | `codex`                                                                                                        | `OPENAI_API_KEY`                                                                                                                                        | `OPENAI_API_KEY`                                                              |
  | `claude-code`                                                                                                  | `ANTHROPIC_API_KEY`、`ANTHROPIC_AUTH_TOKEN` 或 `CLAUDE_CODE_OAUTH_TOKEN`；对于 Bedrock，为 `AWS_BEARER_TOKEN_BEDROCK` 或标准 AWS 凭据链 | `ANTHROPIC_API_KEY`、`CLAUDE_CODE_OAUTH_TOKEN`，或原始 AWS 变量 |
  | `gemini-cli`                                                                                                   | `GEMINI_API_KEY`、`GOOGLE_API_KEY`、`GOOGLE_GENERATIVE_AI_API_KEY` 或 `GOOGLE_APPLICATION_CREDENTIALS`                                                 | Google 身份验证变量                                               |
  | `antigravity-cli`、`antigravity-sdk`                                                                           | `GEMINI_API_KEY`；`antigravity-cli` 还会识别 `GOOGLE_API_KEY`                                                                                    | `GEMINI_API_KEY`                                                              |
  | `copilot-cli`                                                                                                  | `COPILOT_GITHUB_TOKEN`、`GH_TOKEN` 或 `GITHUB_TOKEN`                                                                                                   | `COPILOT_GITHUB_TOKEN`                                                        |
  | `cursor-cli`                                                                                                   | `CURSOR_API_KEY`                                                                                                                                        | `CURSOR_API_KEY`                                                              |
  | `fx`                                                                                                           | `AI_GATEWAY_API_KEY`、`VERCEL_AI_GATEWAY_API_KEY` 或 `VERCEL_OIDC_TOKEN`                                                                               | Vercel AI Gateway 身份验证变量                                    |
  | `muse-code`                                                                                                    | `META_API_KEY`                                                                                                                                          | `META_API_KEY`                                                                |
  | `openhands`、`openhands-sdk`                                                                                   | `LLM_API_KEY`；`openhands` 还会识别由 `-m` 选定的提供方凭据                                                                     | `LLM_API_KEY`                                                                 |
  | `aider`、`goose`、`mcode`、`mimo`、`mini-swe-agent`、`opencode`、`pi`、`qwen-coder`、`swe-agent`、`trae-agent` | 由 `-m` 选定的提供方凭据                                                                                                            | 集成特定的提供方变量                                       |

  依赖提供方的 Agent 使用 Harbor 的[提供方凭据
  注册表](https://github.com/harbor-framework/harbor/blob/main/src/harbor/agents/model_connection.py)。
  ACP 注册表 Agent 不使用此自动转发；请用 `--agent-env` 传入凭据。其他集成可能识别额外变量；请查看
  [Agent 实现](https://github.com/harbor-framework/harbor/tree/main/src/harbor/agents/installed)。
