# 注册表凭据 {#registry-credentials}

> 存储用于拉取私有任务镜像的凭据

`/registry-credentials` 存储用于拉取私有任务镜像的加密凭据。它支持
Google Artifact Registry (GAR)、GitHub Container Registry (GHCR) 和 Amazon Elastic Container
Registry (ECR)。

下方示例使用 `$BASE` 和 `$KEY`。请从
[Harbor Hub API 密钥](/docs/core-concepts/hosted-harbor/api-key) 获取密钥。

```bash
export BASE=https://ofhuhcpkvzjlejydnvyd.supabase.co/functions/v1
export KEY=sk-harbor-...
```

## 存储凭据 {#storing-a-credential}

`POST /registry-credentials` 验证凭据、加密它，并返回元数据，从不
返回密钥本身。每个请求都需要 `registry_host` 和最多 100 个字符的 `display_name`，作业之后通过该名称选择凭据。提供商从主机推断，因此
`provider` 为可选；如果发送它，必须与主机一致。

| 提供商 | 主机                                          | 密钥字段                        |
| -------- | --------------------------------------------- | ------------------------------------ |
| `gar`    | `<region>-docker.pkg.dev`                     | `service_account_json`               |
| `ghcr`   | `ghcr.io`                                     | `username`、`token`                  |
| `ecr`    | `<account-id>.dkr.ecr.<region>.amazonaws.com` | `access_key_id`、`secret_access_key` |

GAR 凭据：

```json
{
  "registry_host": "us-east1-docker.pkg.dev",
  "display_name": "prod-puller",
  "service_account_json": "{...service account JSON...}"
}
```

使用对所需仓库具有读取权限的服务账号，通常是限定到该仓库的
`roles/artifactregistry.reader`。

GHCR 凭据：

```json
{
  "registry_host": "ghcr.io",
  "display_name": "github-packages-puller",
  "username": "octocat",
  "token": "ghp_..."
}
```

使用仅限 `read:packages` 的经典 GitHub 个人访问令牌。

ECR 凭据：

```json
{
  "registry_host": "123456789012.dkr.ecr.us-east-1.amazonaws.com",
  "display_name": "production-ecr-puller",
  "access_key_id": "AKIAIOSFODNN7EXAMPLE",
  "secret_access_key": "..."
}
```

使用长期 IAM 访问密钥，权限仅限于任务镜像所需的 ECR 拉取权限。以
`ASIA` 开头的临时会话凭据会被拒绝，因为它们需要 Harbor 不存储的会话令牌。

成功响应类似：

```json
{
  "id": "00000000-0000-0000-0000-000000000003",
  "org_id": "00000000-0000-0000-0000-00000000000a",
  "provider": "gar",
  "registry_host": "us-east1-docker.pkg.dev",
  "display_name": "prod-puller",
  "fingerprint": "harbor-puller@my-project.iam.gserviceaccount.com",
  "status": "active",
  "created_at": "2026-08-13T14:30:00Z"
}
```

复用已有的 `display_name` 会返回 `409 replacement_required` 以及现有记录的
指纹；使用 `supersede_credential_id` 确认，方式与密钥完全相同。每个组织最多可以
持有 20 个活动注册表凭据。

对于 GAR，从服务账号文件构建请求，以避免 shell 引号问题：

```bash
curl -sS -X POST "$BASE/registry-credentials" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --rawfile sa ./gar-puller.json \
    '{registry_host:"us-east1-docker.pkg.dev", display_name:"prod-puller", service_account_json:$sa}')"
```

## 列出和吊销注册表凭据 {#listing-and-revoking-registry-credentials}

`GET /registry-credentials` 列出活动凭据，仅返回元数据。使用 `status=revoked`
或 `status=all` 以包含其他状态。

```bash
curl -sS "$BASE/registry-credentials?status=active" \
  -H "Authorization: Bearer $KEY"
```

`DELETE /registry-credentials` 默认吊销凭据。仅当存储记录应被永久删除时，才将 `purge` 设为 `true`。

```bash
curl -sS -X DELETE "$BASE/registry-credentials" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"credential_id":"00000000-0000-0000-0000-000000000003","purge":false}'
```

## 在作业中使用凭据 {#using-a-credential-in-a-job}

在 `registry_credentials` 中按显示名称或 ID 固定已存储的凭据，作为 `config` 的同级字段：

```json
{
  "config": {
    "job_name": "private-image-job",
    "agents": [
      {
        "name": "terminus-2",
        "model_name": "openai/gpt-4o",
        "secrets": ["OPENAI_API_KEY"]
      }
    ],
    "datasets": [
      {
        "name": "my-org/private-image-dataset",
        "ref": "latest"
      }
    ]
  },
  "registry_credentials": {
    "us-east1-docker.pkg.dev": "prod-puller"
  },
  "job_secrets": {
    "OPENAI_API_KEY": "sk-..."
  }
}
```

该映射的含义是：对于 `us-east1-docker.pkg.dev` 上的镜像，使用名为
`prod-puller` 的已存储凭据。键必须是受支持的注册表主机，最多可以发送 20 个条目。

如果某个主机恰好只有一个活动凭据可用，可以完全省略 `registry_credentials`。
当有多个匹配时，启动必须按显示名称、凭据 ID 或 Harbor 显示的所有者限定显示名称选择其中一个。
