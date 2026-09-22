# 自定义 Agent {#custom-agents}

> 从 GitHub 仓库运行 ACP Agent

自定义 Agent 通过 ACP 运行，源仓库需包含 `harbor-agent.json` 清单。
使用私有仓库前，请先在个人资料设置中连接该仓库。

下方模板有意省略 `source.ref`，因此 Harbor 从仓库的默认分支开始，并将解析得到的提交 SHA 记录到已存储的作业配置中：

```json
{
  "config": {
    "retry": {
      "exclude_exceptions": [
        "AgentTimeoutError",
        "VerifierTimeoutError",
        "RewardFileNotFoundError",
        "RewardFileEmptyError",
        "VerifierOutputParseError",
        "ApiUsageLimitError",
        "AgentSafetyRefusalError"
      ],
      "include_exceptions": []
    },
    "agents": [
      {
        "name": "acp",
        "source": {
          "path": ".",
          "repo": "<github-owner>/<custom-agent-repo>",
          "type": "github",
          "manifest": "harbor-agent.json"
        },
        "model_name": "<model-provider>/<model-name>",
        "secrets": ["<MODEL_API_KEY_ENV_VAR>"]
      }
    ],
    "datasets": [
      {
        "ref": "<dataset-ref>",
        "name": "<dataset-org>/<dataset-name>",
        "n_tasks": 3
      }
    ],
    "job_name": "<job-name>"
  },
  "job_secrets": {
    "<MODEL_API_KEY_ENV_VAR>": "<model-api-key>"
  },
  "dry_run": false
}
```

提交前请替换每一个 `<...>` 值。要选择明确的修订版本，在 `source` 内添加
`"ref": "<branch-tag-or-commit>"`。

源规则如下：

* 当存在 `source` 时，`name` 必须为 `acp`。
* `source.type` 必须为 `github`，且 `source.repo` 必须使用 `owner/repo` 形式。
* `source.ref` 为可选，接受分支、标签或提交 SHA。省略时，Harbor 解析
  GitHub `HEAD`，即仓库配置的默认分支（通常为 `main`），然后将确切的提交 SHA 记录到已存储的配置中，以便重试可复现。
* `source.path` 默认为 `.`，用于选择存放 Agent 项目的仓库目录。
* `source.manifest` 默认为 `harbor-agent.json`，相对于 `source.path` 解析。
* 自定义 Agent 自带模型凭据。在 `job_secrets` 中提供密钥，或将其存储为托管密钥，并无论哪种方式都在 Agent 的 [`secrets`](/docs/core-concepts/hosted-harbor/submitting-jobs#agent-secrets)
  中命名它。选择与 `model_name` 的提供商匹配的凭据；它会按 [推理凭据](#inference-credentials) 所述支撑
  `HOSTED_INFERENCE_TOKEN`。

源目录需要一个已锁定的 Python 项目和一份清单：

```json
{
  "schema_version": 1,
  "id": "<agent-id>",
  "version": "<agent-version>",
  "protocol": "acp",
  "runtime": {
    "kind": "python-uv",
    "python": "3.12",
    "project": ".",
    "lockfile": "uv.lock",
    "entrypoint": ["python", "-m", "<agent-module>"]
  }
}
```

`schema_version` 必须为 `1`，`protocol` 必须为 `acp`，`runtime.kind` 必须为 `python-uv`，且
`runtime.python` 必须为 `"3.12"`。入口点必须是通过标准输入和输出实现 ACP 的可执行程序，其第一个元素是命令名而非路径。请将清单、项目文件和 `uv.lock` 提交到仓库。

要在不启动任何内容的情况下检查仓库访问权限、引用和清单，发送相同请求并设置 `"dry_run": true`。验证成功会返回已解析的仓库、固定的提交、清单身份以及访问模式。

## 推理凭据 {#inference-credentials}

设置 `config.credential_mode` 以选择自定义 Agent 接收所选模型凭据的方式：

| 模式               | `HOSTED_INFERENCE_TOKEN`                      | `HOSTED_INFERENCE_URL`           | 如何连接                     |
| ------------------ | --------------------------------------------- | -------------------------------- | ---------------------------------- |
| `direct`（默认） | 所选模型提供商的真实凭据 | 未设置                          | 使用提供商的常规端点 |
| `gateway`          | 作用域受限的代理凭据                     | 托管推理网关 URL | 将此 URL 与作用域令牌一起使用 |

读取 `HOSTED_INFERENCE_TOKEN` 进行推理身份验证。仅当设置了 `HOSTED_INFERENCE_URL` 时才覆盖提供商客户端的基址 URL。直连模式下缺少该 URL 是预期行为；不要要求它，也不要替换为硬编码的网关 URL。

直连模式还会以环境变量名注入所选密钥，因此 Agent 代码可以读取其真实值。网关模式会代理受支持的推理提供商凭据；所选的非提供商密钥仍以其真实值到达。受支持的提供商和密钥选择请参见
[Agent 密钥](/docs/core-concepts/hosted-harbor/submitting-jobs#agent-secrets)。
