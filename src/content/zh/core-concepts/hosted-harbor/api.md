# API 概览 {#api-overview}

> 远程 rollout API 的基址 URL、身份验证和错误结构

Web UI 和 CLI 中可用的启动功能，大部分也可通过 API 使用。

所有端点的基址 URL 为：

```text
https://ofhuhcpkvzjlejydnvyd.supabase.co/functions/v1
```

## 身份验证 {#authentication}

每个请求都需要将 Harbor API 密钥作为 bearer token 发送。创建方法请参见
[Harbor Hub API 密钥](/docs/core-concepts/hosted-harbor/api-key)。

```http
Authorization: Bearer sk-harbor-...
Content-Type: application/json
```

## 错误 {#errors}

所有错误共用同一种结构：

```json
{
  "error": {
    "code": "validation_failed",
    "message": "config must contain at least one agent"
  }
}
```

| 代码                              | 状态 | 含义                                                                      |
| --------------------------------- | ------ | ---------------------------------------------------------------------------- |
| `bad_request`                     | 400    | 请求格式错误，或缺少 / 过长的 `Idempotency-Key`                  |
| `validation_failed`               | 400    | 请求体已解析，但违反了 schema 或服务端规则                       |
| `unauthorized`                    | 401    | 缺少或无效的 API 密钥                                                   |
| `forbidden`                       | 403    | 未获批远程 rollout，或不是所选组织的成员 |
| `not_found`                       | 404    | 作业不存在，或对你不可见                              |
| `method_not_allowed`              | 405    | 该路径不支持此 HTTP 方法                                       |
| `replacement_required`            | 409    | 已存在具有此身份的凭据；请确认替换      |
| `replacement_stale`               | 409    | 确认期间凭据已发生变化；请重新读取后重试          |
| `quota_exceeded`                  | 429    | 已超出托管配额                                               |
| `server_error`                    | 500    | 内部故障                                                             |
| `agent_version_resolution_failed` | 503    | 无法解析最新 Agent 版本；请重试                            |
