# 托管 Harbor {#hosted-harbor}

> 在 Hub 上启动作业

[Harbor Hub](https://hub.harborframework.com) 现已可用于运行远程 Harbor rollout。
本指南介绍如何通过 CLI、Web UI 和 API 启动远程作业。

首先访问 [作业启动器](https://hub.harborframework.com/jobs/launch)。
点击横幅中的链接，填写 Google 表单以申请远程 rollout 访问权限。

然后按照 [API 密钥创建指南](/docs/core-concepts/hosted-harbor/api-key) 创建 API 密钥。

## 界面 {#interfaces}

| 页面                                             | 用途                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------- |
| [Web UI](/docs/core-concepts/hosted-harbor/web-ui)    | 在浏览器中添加密钥并启动作业                 |
| [CLI](/docs/core-concepts/hosted-harbor/cli)          | 使用 `harbor run --launch` 启动，然后浏览作业和试次 |
| [API 概览](/docs/core-concepts/hosted-harbor/api) | 基址 URL、身份验证和错误结构                          |

## API 参考 {#api-reference}

| 页面                                                                      | 端点                                     |
| ------------------------------------------------------------------------- | --------------------------------------------- |
| [提交作业](/docs/core-concepts/hosted-harbor/submitting-jobs)           | `POST /job-submit`、`GET /job-status`         |
| [自定义 Agent](/docs/core-concepts/hosted-harbor/custom-agents)               | 从 GitHub 仓库运行 ACP Agent |
| [管理密钥](/docs/core-concepts/hosted-harbor/secrets)                  | `/secrets`、`/secrets/preflight`              |
| [注册表凭据](/docs/core-concepts/hosted-harbor/registry-credentials) | `/registry-credentials`                       |
| [排行榜](/docs/core-concepts/harbor-hub/leaderboards)                    | 通过 CLI 管理精选排行榜             |
