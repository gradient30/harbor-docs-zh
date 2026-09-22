# ACP {#acp}

> 运行来自 Agent Client Protocol 注册表的 Agent。

Harbor 的通用 `acp` 集成会从 [ACP Registry](https://agentclientprotocol.com/get-started/registry) 安装并在任务环境中运行 Agent。ACP 为客户端与 Agent 之间提供了一套通用协议。

> **说明** `--agent acp:...` 用于选择 ACP 注册表中的 Agent。它不同于 [`--bridge acp`](/docs/core-concepts/jobs/simulate-a-user)，后者将模拟用户连接到目标 Agent。

## 运行注册表 Agent {#run-a-registry-agent}

Harbor 支持 [ACP Registry Github](https://github.com/agentclientprotocol/registry) 或 [ACP registry.json](https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json) 中的**所有 acp Agent**。下面四个 Agent 仅为示例。使用 `acp:<agent_id>` 获取最新条目，或使用 `acp:<agent_id>@<version>` 固定版本。

> **注意** 与 Harbor 已安装的 Agent 不同，ACP Agent 不会自动接收提供商凭据。请通过 `--agent-env`（`--ae`）传递每个所需变量。各 Agent 的认证规则也有所不同。部分 Agent 除凭据外还需要 `--agent-kwarg authenticate_method_id=...`。请查阅 [ACP Registry](https://github.com/agentclientprotocol/registry) 中该 Agent 的文档。

**CLI**

<CodeGroup>
      ```bash
      harbor run \
        -t hello-world/hello-world \
        --agent acp:codex-acp \
        --model openai/gpt-5.6-sol \
        --agent-env OPENAI_API_KEY="$OPENAI_API_KEY" \
        --agent-kwarg authenticate_method_id=api-key
      ```

      ```bash
      harbor run \
        -t hello-world/hello-world \
        --agent acp:claude-acp \
        --model anthropic/claude-sonnet-5 \
        --agent-env ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY"
      ```

      ```bash
      harbor run \
        -t hello-world/hello-world \
        --agent acp:cursor \
        --agent-env CURSOR_API_KEY="$CURSOR_API_KEY" \
        --agent-kwarg authenticate_method_id=cursor_login
      ```

      ```bash
      harbor run \
        -t hello-world/hello-world \
        --agent acp:opencode \
        --model openai/gpt-5.6-sol \
        --agent-env OPENAI_API_KEY="$OPENAI_API_KEY"
      ```
    </CodeGroup>

**Config**

```json
    {
      "agents": [
        {
          "name": "acp:codex-acp",
          "model_name": "openai/gpt-5.6-sol",
          "env": {"OPENAI_API_KEY": "${OPENAI_API_KEY}"},
          "kwargs": {"authenticate_method_id": "api-key"}
        }
      ]
    }
    ```

**Python**

```python
    from harbor.models.trial.config import AgentConfig

    agent = AgentConfig(
        name="acp:codex-acp",
        model_name="openai/gpt-5.6-sol",
        env={"OPENAI_API_KEY": "${OPENAI_API_KEY}"},
        kwargs={"authenticate_method_id": "api-key"},
    )
    ```

认证参考：[Codex ACP](https://github.com/agentclientprotocol/codex-acp#authentication)、[Claude](https://platform.claude.com/docs/en/manage-claude/authentication)、[Cursor ACP](https://cursor.com/docs/cli/acp#authentication) 和 [OpenCode](https://opencode.ai/docs/providers)。

## 常用选项 {#common-options}

通过 `--agent-kwarg`（`--ak`）或 `agents[].kwargs` 传递这些选项：

| 选项                      | 默认值                | 用途                                              |
| ------------------------- | --------------------- | ------------------------------------------------- |
| `auth_policy`             | `auto`                | 使用 `auto`、`explicit` 或 `disabled` 认证。      |
| `authenticate_method_id`  | —                     | 选择 ACP 认证方法。                               |
| `permission_mode`         | `allow`               | 允许或拒绝 ACP 工具权限请求。                     |
| `distribution_preference` | `binary,npx,uvx`      | 设置安装顺序。                                    |
| `registry_ref`            | `main`                | 为未固定版本的 Agent 设置注册表 Git ref。         |
| `registry_cache_dir`      | `.cache/acp-registry` | 设置本地注册表缓存目录。                          |

所有支持的选项见 [ACP Agent 构造函数](https://github.com/harbor-framework/harbor/blob/main/src/harbor/agents/installed/acp.py)。

### 使用本地注册表条目 {#use-a-local-registry-entry}

使用本地 `agent.json` 文件运行通用 `acp` Agent：

  ```yaml
  agents:
    - name: acp
      kwargs:
        registry_entry_path: /path/to/agent.json
  ```

## 输出 {#output}

ACP 运行会将 `acp.txt`、`acp-events.jsonl`、`acp-summary.json` 以及名为 `trajectory.json` 的 [ATIF 轨迹](/docs/core-concepts/agents/atif) 写入 Agent 日志目录。
