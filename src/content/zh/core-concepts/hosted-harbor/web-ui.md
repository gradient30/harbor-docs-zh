# Web UI {#web-ui}

> 在 Harbor Hub 上添加密钥并启动远程 rollout

## 添加密钥 {#adding-secrets}

除非你运行的是不需要 API 模型推理的 `oracle` 或 `nop` Agent，否则第一步是添加 API 密钥。
在 Harbor Hub 上，一切都归组织所有。这包括作业、试次、包和密钥。
运行远程 rollout 时，密钥将从被选为作业所有者的组织中选取。

要在 Web UI 上向个人组织添加密钥，首先前往 [Hub](https://hub.harborframework.com)

点击右上角的个人资料：

<div className="dark:hidden">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/hub-home.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=f86605d6cc0529b7a5f16d339a442abb" alt="Harbor Hub 首页，列出已发布的数据集" width="3782" height="1676" data-path="images/hosted-harbor/hub-home.png" />
</div>

<div className="hidden dark:block">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/hub-home-dark.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=e8c59363584e936fdf0d36a4a28f89e1" alt="Harbor Hub 首页，列出已发布的数据集" width="3774" height="1748" data-path="images/hosted-harbor/hub-home-dark.png" />
</div>

然后点击设置选项卡：

<div className="dark:hidden">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/hub-settings.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=5feff5526a2797eeb0bc015a7e7d1b31" alt="个人资料页面" width="3784" height="526" data-path="images/hosted-harbor/hub-settings.png" />
</div>

<div className="hidden dark:block">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/hub-settings-dark.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=f3b090bfa8b35388e1d69761f272452e" alt="个人资料页面" width="3772" height="520" data-path="images/hosted-harbor/hub-settings-dark.png" />
</div>

滚动到密钥部分，点击 "Add secret"：

<div className="dark:hidden">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/add-secrets.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=96a8b20a0d141460ac1e6863a4ae6ecb" alt="密钥选项卡" width="2294" height="252" data-path="images/hosted-harbor/add-secrets.png" />
</div>

<div className="hidden dark:block">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/add-secrets-dark.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=295f0ea600cb8a3ce8f04dabbe1ae414" alt="密钥选项卡" width="2278" height="250" data-path="images/hosted-harbor/add-secrets-dark.png" />
</div>

添加注册表密钥或环境变量密钥：

<div className="max-w-sm dark:hidden">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/secret-modal.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=4acc892a2410a0d6e6b4bc32952bd49d" alt="密钥对话框" width="890" height="980" data-path="images/hosted-harbor/secret-modal.png" />
</div>

<div className="max-w-sm hidden dark:block">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/secret-modal-dark.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=f1d25192ee431a20b38c3c4b2b2cd10e" alt="密钥对话框" width="896" height="980" data-path="images/hosted-harbor/secret-modal-dark.png" />
</div>

环境密钥可以在 rollout 期间注入
Agent 运行时；注册表密钥从不注入，仅用于解析任务引用的私有镜像仓库。

## 向组织添加密钥 {#adding-secrets-to-organizations}

要向你拥有的组织添加密钥，点击页面顶部的 "Organization" 按钮：

<div className="dark:hidden">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/org-button.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=1b850c3920a4aa30adf9aea2efdf8bb6" alt="组织按钮" width="3786" height="1648" data-path="images/hosted-harbor/org-button.png" />
</div>

<div className="hidden dark:block">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/org-button-dark.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=54ccf8ce72b7942291acfad5fe69cdd6" alt="组织按钮" width="3766" height="1720" data-path="images/hosted-harbor/org-button-dark.png" />
</div>

选择你拥有的组织，或创建一个新组织。

然后选择该组织的设置选项卡以查看已保存的密钥。注意只有组织所有者可以修改密钥。

<div className="dark:hidden">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/org-settings.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=6cc0cb9ab529b75521d5d10511c02ebb" alt="添加组织密钥" width="3768" height="416" data-path="images/hosted-harbor/org-settings.png" />
</div>

<div className="hidden dark:block">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/org-settings-dark.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=b223d7190547a0f543fa8c8c78a973ac" alt="添加组织密钥" width="3764" height="414" data-path="images/hosted-harbor/org-settings-dark.png" />
</div>

最后，添加密钥：

<div className="dark:hidden">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/org-add-secret.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=d9ee70aa8882fcf365016930d7c32881" alt="添加组织密钥" width="3778" height="1258" data-path="images/hosted-harbor/org-add-secret.png" />
</div>

<div className="hidden dark:block">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/org-add-secret-dark.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=2ba3ab153ec5a6badbfc29651e767b63" alt="添加组织密钥" width="3774" height="1204" data-path="images/hosted-harbor/org-add-secret-dark.png" />
</div>

## 启动作业 {#launching-a-job}

添加密钥后，前往 [作业启动器](https://hub.harborframework.com/jobs/launch)。

首先，选择应拥有此作业的组织。

<div className="dark:hidden">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/select-organization.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=7b05a41f0be5c45dcab5ef6f1e93a9cf" alt="选择组织" width="1446" height="444" data-path="images/hosted-harbor/select-organization.png" />
</div>

<div className="hidden dark:block">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/select-organization-dark.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=d6068a6960580d6981bae7a006f324e1" alt="选择组织" width="1526" height="452" data-path="images/hosted-harbor/select-organization-dark.png" />
</div>

然后，选择要评估的数据集或任务。可以选择已上传到 Hub
或 GitHub 的任务和数据集。对于私有 GitHub 任务，必须
先在个人资料设置中连接私有 GitHub 仓库。

<div className="dark:hidden">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/select-source.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=0974476e14df30752f26d9f8a2bb30db" alt="选择来源" width="1432" height="610" data-path="images/hosted-harbor/select-source.png" />
</div>

<div className="hidden dark:block">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/select-source-dark.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=9648a1aadd932a635ee3f0ed7005d6bb" alt="选择来源" width="1434" height="616" data-path="images/hosted-harbor/select-source-dark.png" />
</div>

### 添加 Agent {#adding-agents}

接下来，选择要评估的 Agent/模型组合。Harbor Hub 默认使用
**直连凭据模式**，并勾选 **Disable credential proxying**。这会将所选
凭据注入任务沙箱，Agent 代码可以从中读取。直连模式下不适用网关策略和计量。

要选择 **网关模式**，取消勾选 **Disable credential proxying**。受支持的推理提供商
密钥随后会被替换为作用域受限的代理凭据。所选的非提供商密钥仍以
真实值到达；提供商支持和凭据处理请参见 [Agent 密钥](/docs/core-concepts/hosted-harbor/submitting-jobs#agent-secrets)。

<div className="dark:hidden">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/select-agent.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=d7c3215ec5994273accae1a1aae54966" alt="选择 Agent" width="2728" height="1280" data-path="images/hosted-harbor/select-agent.png" />
</div>

<div className="hidden dark:block">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/select-agent-dark.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=54ed9c692f373ad3004cfe8fa3700671" alt="选择 Agent" width="2714" height="1258" data-path="images/hosted-harbor/select-agent-dark.png" />
</div>

自定义 Agent 必须存储在 GitHub 上并兼容 ACP。读取 `HOSTED_INFERENCE_TOKEN`
以获取所选模型凭据。网关模式还会设置 `HOSTED_INFERENCE_URL`；直连模式
不设置它，因此请使用提供商的常规端点。完整约定请参见
[自定义 Agent](/docs/core-concepts/hosted-harbor/custom-agents#inference-credentials)。

选择 Agent 后，可以添加希望设置的额外环境变量。
此字段不得填写密钥。放在这些字段中的环境变量会以明文持久化
在作业配置中。打开 **Agent Configuration** 以配置所选 Agent 的选项。
声明了选项 schema 的 Agent 会显示其支持的 kwargs 的类型化控件和描述。
也可以使用
`harbor agent schema claude-code --hub` 检查已部署 Agent 的选项，将 `claude-code` 替换为 Agent 名称。

### 选择要注入的密钥 {#choosing-secrets-to-inject}

配置完 Agent 后，选择每个 Agent 接收哪些凭据。`Secrets` 部分列出了上传到
所属组织的每一个密钥的名称。每个 Agent 可以选择任意数量的密钥，
包括多个推理提供商密钥。

<div className="dark:hidden">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/select-secret-settings.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=ffffe47a6f479cdabe030cd84b46a9c7" alt="选择密钥" width="1424" height="898" data-path="images/hosted-harbor/select-secret-settings.png" />
</div>

<div className="hidden dark:block">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/select-secret-settings-dark.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=ca0af7fda8007e64794eb907b12a8afa" alt="选择密钥" width="1440" height="896" data-path="images/hosted-harbor/select-secret-settings-dark.png" />
</div>

每一个选中的密钥都会被注入。其中之一还会被重命名：提供商与该 Agent 所选模型匹配的密钥会以其 Agent 期望的名称到达，因此你不必以另一个名称再存储一份副本。你选中的其他密钥都以其自身名称注入。

例如，对 `openrouter/zai/glm-5.2` 运行 `claude-code` 时，你应
选择组织的 `OPENROUTER_API_KEY`。它匹配模型的
`openrouter/` 提供商，而 `claude-code` 从其
`ANTHROPIC_API_KEY` 读取凭据，因此会以该名称注入。你选中的任何其他
密钥，例如 `OPENAI_API_KEY`、任务所需的令牌，都会原样到达。

如果所选密钥均不匹配模型的提供商，则不会发生重命名，
Agent 启动时没有凭据，试次会因
凭据错误而失败。仅为该 OpenRouter 模型选择 `OPENAI_API_KEY`
就会出现这种情况：密钥以其自身名称注入，但不是
模型所需要的那一个。

### 作业总体设置 {#overall-job-settings}

作业总体设置包括名称、重试、尝试次数、并发数和超时倍数。

<div className="dark:hidden">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/select-job-settings.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=84c6150abc296067262566de98a176cf" alt="选择作业设置" width="1420" height="530" data-path="images/hosted-harbor/select-job-settings.png" />
</div>

<div className="hidden dark:block">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/select-job-settings-dark.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=5bd33bd9e3c73d60f3ace95896e9d4d2" alt="选择作业设置" width="1450" height="524" data-path="images/hosted-harbor/select-job-settings-dark.png" />
</div>

**Name**

建议为作业命名，因为默认时间戳之后可能难以识别。

**Retries**

重试设置每个试次在符合条件的异常之后可额外执行的最大次数。
默认为 `0`，即禁用重试。是否符合条件取决于异常的包含/排除
设置以及剩余重试预算；仅分数较低不会触发重试。请参见
[重试设置](/docs/core-concepts/hosted-harbor/submitting-jobs#retry-settings)。

**Attempts**

每个任务的尝试次数设置每个任务与 Agent 组合的独立试次数。
例如，4 次尝试配合 3 次重试，允许每个任务每个 Agent 最多执行 `4 × (1 + 3) = 16` 次：
4 个试次各自可以运行一次并最多重试 3 次。重试会替换失败的执行；
它们不会增加计分样本。仍然只有 4 个试次槽位，耗尽重试的试次
可能以错误而非分数结束。

**Concurrent Trials**

并发数可以根据 API 密钥的速率限制来设置。Harbor Hub 会监控并发
并在速率限制导致失败时回退，但建议将并发
设置到不会发生速率限制失败的水平。

**Timeout Multiplier**

最后，超时倍数指 Agent 完成任务的时间限制。
时间限制在任务中声明，但如果希望在不修改任务的情况下调整此超时，
可以将超时倍数设为非 `1.0` 的值。
例如 `0.5` 给出一半的时间限制，`2.0` 给出两倍时间。

### 高级作业设置 {#advanced-job-settings}

<div className="dark:hidden">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/advanced-options.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=f6302b5b17990472135b21f05050e6ed" alt="选择高级设置" width="1424" height="700" data-path="images/hosted-harbor/advanced-options.png" />
</div>

<div className="hidden dark:block">
  <img src="https://mintcdn.com/harborframework/Gs5DwVkRMDXhj7Hx/images/hosted-harbor/advanced-options-dark.png?fit=max&auto=format&n=Gs5DwVkRMDXhj7Hx&q=85&s=227baf71a53c211e0b57601620c422af" alt="选择高级设置" width="1444" height="696" data-path="images/hosted-harbor/advanced-options-dark.png" />
</div>
