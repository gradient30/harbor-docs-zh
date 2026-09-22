# 提交作业 {#submitting-jobs}

> 使用 POST /job-submit 启动远程 rollout 并查看其状态

`POST /job-submit` 启动远程 rollout。

下方示例使用 `$BASE` 和 `$KEY`。请从
[Harbor Hub API 密钥](/docs/core-concepts/hosted-harbor/api-key) 获取密钥。

```bash
export BASE=https://ofhuhcpkvzjlejydnvyd.supabase.co/functions/v1
export KEY=sk-harbor-...
```

请求头：

```http
Authorization: Bearer sk-harbor-...
Content-Type: application/json
Idempotency-Key: <unique-retry-key>
```

`Idempotency-Key` 请求头为 **必填**。没有它的请求会被拒绝，且该键最多
200 个字符。复用某个键会返回该键已经创建的作业，而不是再启动
第二个，因此每次启动生成一个新键，仅在重试同一次启动时复用它。
如果复用 `Idempotency-Key`，即使配置发生变化，服务器也会返回先前的启动 URL。

请求体顶层接受这些字段：

| 字段                  | 必填 | 说明                                                                                                                                       |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `config`               | 是      | 作业配置                                                                                                                       |
| `organization`         | 否       | 将拥有该作业的组织名称。默认为你的个人组织                                                               |
| `job_secrets`          | 否       | 一次性环境变量名到密钥值的映射。仅为本作业添加，并且仅注入到其 `secrets` 子字段名称匹配的 Agent |
| `registry_credentials` | 否       | 注册表主机到已存储凭据名称或 ID，例如 `"us-east1-docker.pkg.dev": "registry-cred-stored-name"`                                      |
| `dry_run`              | 否       | 校验并解析一切而不创建作业。默认为 `false`                                                                 |

`job_secrets` 和 `registry_credentials` 是 `config` 的同级字段，而不是其内部字段。这是
有意为之：避免明文密钥进入会被存储和重放的作业配置。将
其中任一放进 `config` 会被拒绝。提交时这些凭据会经过加密器，仅在运行时解密。
明文密钥从不存储在我们的平台上。

以下是使用注册表数据集和内置 Agent 的启动示例：

```json
{
  "config": {
    "job_name": "I-love-harbor",
    "agents": [
      {
        "name": "terminus-2",
        "model_name": "openai/gpt-5.6-luna",
        "secrets": ["OPENAI_API_KEY"]
      }
    ],
    "datasets": [
      {
        "name": "harbor/hello-world",
        "ref": "latest",
        "n_tasks": 5
      }
    ],
    "n_attempts": 1,
    "n_concurrent_trials": 20
  },
  "job_secrets": {
    "OPENAI_API_KEY": "sk-..."
  },
  "dry_run": false
}
```

成功启动会返回作业及其查看器 URL：

```json
{
  "job_id": "00000000-0000-0000-0000-000000000001",
  "job_name": "I-love-harbor",
  "viewer_url": "https://hub.harborframework.com/jobs/00000000-0000-0000-0000-000000000001",
  "status_url": "https://hub.harborframework.com/jobs/00000000-0000-0000-0000-000000000001",
  "n_trials": 1,
  "owner_org": { "id": "...", "name": "..." },
  "agent_sources": []
}
```

`owner_org` 报告最终拥有该作业的组织，`agent_sources` 回显任何
已解析的自定义 Agent 源，包括其固定的提交。试运行不会创建作业，因此
`job_id` 返回 `null`，但每一个源仍会被解析和验证。

要提交存储在 `launch.json` 中的请求：

```bash
BASE="https://ofhuhcpkvzjlejydnvyd.supabase.co/functions/v1"
KEY="sk-harbor-..."

curl -sS -X POST "$BASE/job-submit" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d @launch.json
```

## 作业配置 {#job-config}

`config` 镜像 CLI 发送的 `JobConfig`，因此无法识别的键会原样透传。
API 直接验证的字段为：

| 字段                 | 必填 | 说明                                                                                                                                                         |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agents`              | 是      | 至少一个 Agent                                                                                                                                            |
| `tasks`               | 否       | 单个任务                                                                                                                                              |
| `datasets`            | 否       | 注册表或 git 仓库数据集                                                                                                                                 |
| `job_name`            | 否       | 默认为 UTC 时间戳，例如 `2026-08-13__14-30-00`（这种时间戳之后翻找会非常烦人。所以强烈建议设置名称） |
| `n_attempts`          | 否       | 介于 1 和 10 之间。默认为 1                                                                                                                               |
| `n_concurrent_trials` | 否       | 介于 1 和 1000 之间。默认为 4                                                                                                                             |
| `credential_mode`     | 否       | `direct`（默认）将所选已解密凭据注入任务沙箱。`gateway` 为受支持的推理提供商选择凭据代理    |
| `retry`               | 否       | `max_retries`（默认 `0`），以及 `include_exceptions` 和 `exclude_exceptions` 列表。请参见 [重试设置](#retry-settings)                                  |

你至少需要 `tasks` 或 `datasets` 之一，并且它们合起来必须解析为至少一个任务。
试次总数为 `n_attempts × tasks × agents`，必须落在 1 到 50,000 之间。

在每个 Agent 上，`name` 是 Harbor Agent 类型，`model_name` 是它使用的模型，`secrets` 是
该 Agent 接收的凭据列表。从包管理器安装的 Agent 版本
在作业提交时固定，因此即使作业在上游发布期间排队等待，作业中的每一个试次也会安装相同的发行版。

## 重试设置 {#retry-settings}

`config.retry.max_retries` 是每个试次在符合条件的异常之后可额外执行的最大次数。
默认为 `0`，因此除非你请求，否则重试是禁用的。非空的
`include_exceptions` 列表将重试限制为这些异常名称；空列表或 `null` 列表允许
任何未被排除的异常。`exclude_exceptions` 优先于包含列表。省略
它会保留默认排除项。

重试同时需要符合条件的异常和剩余重试预算。仅分数较低不会
触发重试，重试也不会增加计分样本。例如，`n_attempts: 4` 配合
`retry.max_retries: 3` 允许每个任务每个 Agent 最多执行 `4 × (1 + 3) = 16` 次，同时保持
4 个试次槽位。耗尽重试的试次可能以错误而非分数结束。

## Agent 密钥 {#agent-secrets}

凭据按 Agent 而不是按作业限定范围。每个 Agent 携带自己的 `secrets` 列表，命名它
接收的环境变量，因此同一次启动中的两个 Agent 可以被给予不同的密钥。

```json
{
  "name": "claude-code",
  "model_name": "anthropic/claude-opus-4-1",
  "secrets": ["ANTHROPIC_API_KEY", "HF_TOKEN"]
}
```

每个名称必须看起来像环境变量，匹配 `^[A-Z][A-Z0-9_]{0,63}$`，并且
每个 Agent 最多可以选择 64 个。密钥通过所属组织的已存储密钥，或通过启动的 `job_secrets` 匹配到其值。当某个
密钥同时通过 `job_secrets` 提供并存储在组织密钥中时，
以 `job_secrets` 提交为准。既未存储也未提供的所选名称自身不携带任何值。

例如，如果我使用以下配置片段启动作业：

```json
{
  "name": "claude-code",
  "model_name": "anthropic/claude-opus-4-1",
  "secrets": ["ANTHROPIC_API_KEY"]
}
"job_secrets": {}
```

并且我的 Harbor Hub 组织上未设置 `ANTHROPIC_API_KEY`，则变量 `ANTHROPIC_API_KEY=None`
会被注入 Agent 的任务环境。如果我的 Harbor Hub
组织上设置了 `ANTHROPIC_API_KEY`，它会被正确注入。

如果我改为使用以下配置片段启动：

```json
{
  "name": "claude-code",
  "model_name": "anthropic/claude-opus-4-1",
  "secrets": ["ANTHROPIC_API_KEY"]
}
"job_secrets": {"ANTHROPIC_API_KEY": "sk-ant-job-secret"}
```

那么无论我的 Harbor Hub 组织上是否存储了同名凭据，`job_secrets` 中提供的值（或代理）都会被注入 Agent 环境。

应为每一个 Agent 发送 `secrets` 字段。

```json
{
  "name": "claude-code",
  "model_name": "anthropic/claude-opus-4-1",
  "secrets": ["ANTHROPIC_API_KEY"]
}
```

| `secrets`              | Agent 接收的内容                              |
| ---------------------- | ---------------------------------------------------- |
| `[A, list, of, names]` | 恰好这些名称，以各自能解析到的为限     |
| `[]`                   | 无。Agent 启动时完全没有凭据 |

`oracle` 和 `nop` Agent 不需要推理凭据，可以使用 `"secrets": []` 启动。

在默认的 `direct` 凭据模式下，所选凭据以其真实值注入
任务沙箱，Agent 代码可以从中读取。网关策略和计量不适用。

如果选择 `gateway` 凭据模式，为 `openai`、`anthropic`、
`openrouter`、`xai` 或 `gemini` 选择的凭据会作为代理能力而非真实
密钥到达，以其自身名称注入，并与提供商的标准变量一起，以便 Agent 的常规
查找能够找到它。你选择的其他一切都以其自身名称和真实值注入。
`vercel_ai_gateway` 和 `devin` 的凭据
要求 `"credential_mode": "direct"`；在网关模式下它们会被丢弃。

密钥不应放在 Agent 的 `env` 中。那仅用于非敏感环境变量。

```json
{
  "name": "claude-code",
  "model_name": "anthropic/claude-opus-4-1",
  "env": [], // secrets do NOT go here
  "secrets": ["ANTHROPIC_API_KEY"] // secret names go HERE
}
"job_secrets": {"ANTHROPIC_API_KEY": "sk-ant-job-secret"} // secret {"key": value} go HERE
```

## 任务 {#tasks}

使用 `tasks` 指定单个任务。每个条目要么是注册表任务，要么是 git 任务，二者不可兼得。

注册表任务采用 `org/name` 形式的 `name` 和可选的 `ref`，`ref` 是类似
`"latest"` 的版本引用，或语义化版本字符串。

git 任务采用 `git_url` 和 `path`，其中 `path` 是相对于仓库
根目录的任务目录，并且为 **必填**。使用 `git_ref`（分支、标签或 SHA）或
`git_commit_id`（已解析的 40 字符 SHA）固定修订版本，但不能同时使用两者。git 任务使用这些字段而不是
`ref`，远程 rollout 不能使用本地文件系统路径。

```json
{
  "config": {
    "job_name": "individual-tasks",
    "agents": [
      {
        "name": "terminus-2",
        "model_name": "openai/gpt-5-mini",
        "secrets": ["OPENAI_API_KEY"]
      }
    ],
    "tasks": [
      {
        "git_url": "https://github.com/owner/private-tasks.git",
        "git_ref": "main",
        "path": "tasks/my-task"
      },
      {
        "name": "terminal-bench/torch-tensor-parallelism",
        "ref": "latest"
      }
    ]
  },
  "job_secrets": {
    "OPENAI_API_KEY": "sk-..."
  },
  "dry_run": false
}
```

私有 GitHub 仓库必须先通过个人资料设置流程连接或共享，然后才能
用作任务或 Agent 源。TODO: add pics here.

## 数据集 {#datasets}

使用 `datasets` 指定注册表或 git 仓库数据集。

注册表数据集采用 `org/name` 形式的 `name`，以及 `ref` 或 `version` 其一，但不能同时使用。
可以使用 `n_tasks` 限制抽取的任务数量，以及使用 `task_names` 和
`exclude_task_names` glob 模式进行筛选。

git 仓库数据集使用 Harbor 的 `repo` 源字符串，语法与 `harbor run --repo` 相同。它
接受 `org/name`、`github.com/org/name`、完整的 https 或 ssh URL，或 GitHub `/tree/<ref>/<subdir>`
URL，每一项都可以带可选的尾部 `@<branch|tag|sha>`。可选的 `path` 是相对于仓库根目录的任务目录，Harbor 默认其为 `tasks`。

```json
{
  "datasets": [
    {
      "repo": "my-org/my-tasks@main",
      "path": "tasks",
      "n_tasks": 5
    }
  ]
}
```

git 仓库数据集在 repo 字符串内固定其修订版本，因此它们不接受 `ref` 或 `version`。
它们也不接受 `git_url`、`git_ref` 或 `git_commit_id` —— 那些属于 `tasks`。

无论 `latest` 还是标签解析为何值，都会固定到已存储的配置中，因此已保存的作业记录的是
实际运行的具体版本，而不是会变动的引用。

## 作业密钥 {#job-secrets}

`job_secrets` 是环境变量名到值的扁平映射：

```json
{ "OPENAI_API_KEY": "sk-..." }
```

名称必须大写并以字母开头，值必须非空且最多 16,384
个字符，最多可以发送 50 个条目。值在存储前加密，并且从不
返回。

在 `config` 内部发现的看似密钥的环境变量会在任何内容保存之前自动移入此
加密通道，因此明文从不会落入已存储的配置。如果同一
名称同时出现在两处，以显式的 `job_secrets` 条目为准。

在此处发送值会使其对该作业可用；它并不决定哪个 Agent 获得它。也要在该 Agent 的 [`secrets`](/docs/core-concepts/hosted-harbor/submitting-jobs#agent-secrets) 中命名它，除非你依赖省略 `secrets`
时对模型规范密钥的回退。

也可以将密钥一次性存储为托管密钥，并完全不放入启动请求。已存储的
密钥仍以同样方式选择，即在 `secrets` 中命名它们，并从
拥有该作业的组织读取。

`GET /job-status` 返回一个或多个作业的试次计数。

```bash
curl -sS "$BASE/job-status?job_id=<uuid>" \
  -H "Authorization: Bearer $KEY"
```

每个作业传入一次 `job_id` 以同时检查多个，或传入逗号分隔的 `job_ids` 列表。添加
`force_combined=true` 即使对单个作业也获取合并概览结构。相同请求
也可以作为 `POST`，请求体为 `{"job_ids": [...], "force_combined": false}`。

单作业响应报告 `pending`、`running`、`completed`、`failed`、`canceled` 和 `total`。
