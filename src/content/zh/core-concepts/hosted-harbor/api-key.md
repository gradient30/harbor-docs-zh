# Harbor Hub API 密钥 {#harbor-hub-api-key}

> 创建 Harbor Hub API 密钥

要通过 [CLI](/docs/core-concepts/hosted-harbor/cli) 或
[API](/docs/core-concepts/hosted-harbor/api) 对任何命令进行身份验证，必须先创建 Harbor API 密钥。

## CLI {#cli}

如果使用 CLI，成功运行 `harbor auth login` 时会自动签发 API 密钥。
密钥存储在 `~/.harbor/credentials.json` 中，并在 `harbor auth logout` 时被吊销。
也可以通过 `HARBOR_API_KEY` 环境变量对 CLI 进行身份验证。下一节演示如何通过 Web UI 创建 API 密钥。

## Web UI {#web-ui}

要在 Web UI 上签发 API 密钥，首先前往 [Hub](https://hub.harborframework.com)。

点击右上角的个人资料：

<div className="dark:hidden">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/hub-home.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=f86605d6cc0529b7a5f16d339a442abb" alt="Harbor Hub 首页，列出已发布的数据集" width="3782" height="1676" data-path="images/hosted-harbor/hub-home.png" />
</div>

<div className="hidden dark:block">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/hub-home-dark.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=e8c59363584e936fdf0d36a4a28f89e1" alt="Harbor Hub 首页，列出已发布的数据集" width="3774" height="1748" data-path="images/hosted-harbor/hub-home-dark.png" />
</div>

然后点击 **Settings** 选项卡：

<div className="dark:hidden">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/hub-settings.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=5feff5526a2797eeb0bc015a7e7d1b31" alt="个人资料页面" width="3784" height="526" data-path="images/hosted-harbor/hub-settings.png" />
</div>

<div className="hidden dark:block">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/hub-settings-dark.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=f3b090bfa8b35388e1d69761f272452e" alt="个人资料页面" width="3772" height="520" data-path="images/hosted-harbor/hub-settings-dark.png" />
</div>

滚动到 API keys 部分，点击 **Create API key**。为密钥指定名称
和过期日期。请将此密钥妥善保存。它拥有对你 Harbor Hub 账户的完全访问权限。

<div className="dark:hidden">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/harbor-api-key.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=4a72af19e81f2d2b5fac83ac892bd567" alt="个人资料页面" width="2952" height="452" data-path="images/hosted-harbor/harbor-api-key.png" />
</div>

<div className="hidden dark:block">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/harbor-api-key-dark.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=2b7f3394dcb5676ae8606581f26faf99" alt="个人资料页面" width="2988" height="464" data-path="images/hosted-harbor/harbor-api-key-dark.png" />
</div>
