# 管理密钥 {#managing-secrets}

> 通过 API 存储、列出、吊销和预检托管密钥

`POST /secrets` 存储可复用的托管密钥，例如模型 API 密钥或任务所需的环境变量。这是通过 Web UI [添加密钥](/docs/core-concepts/hosted-harbor/web-ui#adding-secrets) 的 API 等价操作。

下方示例使用 `$BASE` 和 `$KEY`。请从
[Harbor Hub API 密钥](/docs/core-concepts/hosted-harbor/api-key) 获取密钥。

```bash
export BASE=https://ofhuhcpkvzjlejydnvyd.supabase.co/functions/v1
export KEY=sk-harbor-...
```

```json
{
  "scope": "user",
  "env_var": "OPENAI_API_KEY",
  "value": "sk-...",
  "provider": "openai"
}
```

`scope` 默认为 `user`。使用 `job` 可将密钥限定到单个作业，此时需要 `job_id`；当范围为 `user` 时，`job_id` 会被拒绝。可以传入 `org_id` 将密钥放到特定组织，以及可选的最多 64 个字符的 `provider` 标签。

响应仅返回元数据，从不返回值本身：

```json
{
  "id": "00000000-0000-0000-0000-000000000002",
  "scope": "user",
  "job_id": null,
  "org_id": "00000000-0000-0000-0000-00000000000a",
  "env_var": "OPENAI_API_KEY",
  "provider": "openai",
  "value_last4": "abcd",
  "status": "active",
  "created_at": "2026-08-13T14:30:00Z"
}
```

## 替换密钥 {#replacing-a-secret}

存储一个其 `env_var` 已有活动密钥的密钥时，不会静默覆盖。
请求会以 `409 replacement_required` 返回，并附带即将被替换的记录，
以便你准确看到将被替换的内容：

```json
{
  "error": {
    "code": "replacement_required",
    "message": "An active secret ending in abcd already exists. Confirm that you want to supersede it.",
    "existing": {
      "id": "00000000-0000-0000-0000-000000000002",
      "scope": "user",
      "env_var": "OPENAI_API_KEY",
      "value_last4": "abcd",
      "created_at": "2026-08-13T14:30:00Z"
    }
  }
}
```

再次发送相同请求并带上 `"supersede_credential_id": "<existing.id>"` 以确认。如果该 ID
不再匹配活动密钥（因为期间发生了变化），则会得到
`409 replacement_stale`，应重新读取后再重试。替换
需要组织所有者权限。

下方的注册表密钥采用相同模式。

## 列出和吊销密钥 {#listing-and-revoking-secrets}

`GET /secrets` 仅以元数据形式列出你的密钥。使用 `scope`、`job_id` 和 `status` 过滤，
其中 `status` 接受 `active`（默认）、`revoked` 或 `all`。

```bash
curl -sS "$BASE/secrets?scope=user&status=active" \
  -H "Authorization: Bearer $KEY"
```

```json
{
  "secrets": [
    {
      "id": "...",
      "scope": "user",
      "job_id": null,
      "env_var": "OPENAI_API_KEY",
      "provider": "openai",
      "value_last4": "abcd",
      "status": "active",
      "created_at": "...",
      "last_used_at": null
    }
  ]
}
```

`DELETE /secrets` 按环境变量名吊销密钥。仅当存储记录应被永久删除而非标记为已吊销时，才将 `purge` 设为 `true`。

```json
{
  "scope": "user",
  "env_var": "OPENAI_API_KEY",
  "purge": false
}
```

## 启动前检查密钥 {#checking-secrets-before-launching}

`POST /secrets/preflight` 是一项咨询性检查，报告配置中每个 Agent 是否会实际收到其模型可用于身份验证的凭据。它本身从不阻止启动。

```json
{
  "config": {
    "agents": [
      {
        "name": "terminus-2",
        "model_name": "openai/gpt-5-mini",
        "secrets": ["OPENAI_API_KEY"]
      }
    ]
  },
  "organization": "my-org",
  "declared_env_vars": ["OPENAI_API_KEY"]
}
```

由于密钥按 Agent 限定范围，检查针对每个 Agent 自身的选择进行，而非组织存储的全部内容：仅当该 Agent 的 `secrets` 列出某个名称 **并且**
它能解析（解析为所属组织中的活动密钥，或 `declared_env_vars` 中的名称）时，该名称才计入。将计划作为
`job_secrets` 传入的一次性密钥发送到 `declared_env_vars`，因为预检从不查看其值。

响应报告总体 `ok`、`providers` 下的按提供商结果、`agent_requirements` 下的按 Agent 详情
—— 每项包含其 `model`、`provider`、`missing_env_vars` 和 `configured` —— 以及
`task_requirements`，列出已解析任务硬性要求的环境变量。较旧的
`agents` 字段仍会返回，以兼容现有客户端。任务要求仅在密钥已配置 **并且** `supplyable` 时才视为满足。保留的基础设施名称 —— `PATH`、
`LD_PRELOAD`、任何以 `MODAL_`、`SUPABASE_`、`HOSTED_HARBOR_` 或 `GCP_` 开头的名称，以及任何
以 `_PROXY` 结尾的名称 —— 从不导出到试次环境中，因此任务要求其中之一时，无法通过提供你自己的密钥来满足。
