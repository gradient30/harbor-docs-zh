# 网络策略 {#network-policies}

> Harbor 的网络策略文档。

任务作者常常希望在 rollout 期间限制 Agent 或验证器的网络访问，以实现安全、可复现性，或缓解奖励黑客。

可以在 `task.toml` 文件中以不同粒度指定网络策略。如何指定取决于你的环境能力和用例。

## 示例 {#example}

```toml
[environment] # default unless overridden by [agent] or [verifier]
network_mode = "public"

[agent] # applies during agent.run() -- but *not* during agent.setup()
network_mode = "allowlist"
allowed_hosts = ["pypi.org", "api.openai.com"]

[verifier] # applies during verifier.verify()
network_mode = "no-network"
```

<Frame caption="共享沙箱中各阶段的网络策略">
  <img src="https://mintcdn.com/harborframework/ByMfu-LEbojpJQFw/images/netpolicy.png?fit=max&auto=format&n=ByMfu-LEbojpJQFw&q=85&s=ea0ff2b0c76062c1bf11ab89bbaed368" alt="示意图：公共环境基线、Agent 阶段的允许列表，以及验证器阶段无网络" width="3520" height="728" data-path="images/netpolicy.png" />
</Frame>

> **说明** 在此示例中，下载并安装 Agent 仍然可以工作，因为
>   `agent.setup()` 使用公共的 `[environment]` 基线。`[agent]` 仅应用于
>   `agent.run()`。如果某个阶段没有覆盖，它会继承其沙箱的
>   基线策略。

## 网络模式 {#network-modes}

Harbor 支持三种网络模式：`public`、`no-network` 和 `allowlist`。

| 网络模式     | 说明                                                                                              | 支持的环境                                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public`     | 完整网络访问。                                                                                    | 全部                                                                                                                                                                                                      |
| `no-network` | 无网络访问。                                                                                      | `docker`³, `podman`³, `daytona`, `e2b`, `langsmith`, `tensorlake`, `cwsandbox`, `runloop`, `modal`¹, `gke`², `ec2`, `novita`, `islo`, `blaxel`, `opensandbox`, `skypilot`, `beam`, `hyperbrowser`, `vercel`⁷, `runta` |
| `allowlist`  | 仅能访问 `allowed_hosts` 中列出的目标；主机为空或省略时拒绝所有出站。                             | `docker`⁴, `podman`⁴, `daytona`¹, `e2b`, `langsmith`, `islo`, `runloop`, `modal`¹, `novita`¹, `blaxel`¹, `beam`⁵, `tensorlake`⁶, `hyperbrowser`, `vercel`⁷, `runta`                                                   |

### 提供方特定限制 {#provider-specific-limitations}

¹ 仅单容器任务（不适用于 Docker Compose 模式）。<br />
  ² 仅 Docker Compose（多容器）任务。<br />
  ³ Docker 和 Podman 支持需要 Linux 容器；Windows 容器不支持此网络策略模式。<br />
  ⁴ Docker 和 Podman 支持需要 Linux 容器，以及本地运行时对 Harbor 出站控制边车所用 nftables 内核功能的支持。<br />
  ⁵ Beam 在应用策略前会将具体主机名解析为 IP CIDR；不支持通配符主机条目。<br />
  ⁶ TensorLake 允许列表接受精确主机名、前导通配符主机名（通配符匹配任意深度的子域名，但不匹配 apex 域名）、IPv4 字面量和 IPv4 CIDR 范围，但不接受 IPv6 目标。<br />
  ⁷ Vercel 允许列表仅适用于单容器任务。它们基于 TLS SNI 匹配域名规则，接受精确主机名和前导通配符主机名，但不接受 IP 字面量或 CIDR 范围，并拒绝到已列入允许列表主机的明文 HTTP。该策略从沙箱创建时起生效，并可在运行中的沙箱上更新。Compose 任务仅支持 `public` 和 `no-network`。<br />
  ⁸ 仅当未提供自定义网关配置文件或网关配置时，Islo 才支持动态网络策略。

## 阶段 {#phases}

可以为以下阶段指定网络策略：

| 阶段                     | 说明                                                                                                                                                                    | 支持的环境                                                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `[environment]`          | 在环境启动时配置的基线网络策略。                                                                                                                                        | 任何支持所请求网络模式的环境                                                                                          |
| `[agent]`                | `agent.run()` 阶段期间的网络访问。这要求环境提供方支持动态网络策略切换。此设置会覆盖 `[environment]` 基线。                                                             | `docker`⁴, `podman`⁴, `daytona`¹, `e2b`, `islo`⁸, `modal`¹, `novita`¹, `beam`⁵, `hyperbrowser`, `vercel`⁷, `tensorlake`⁶, `runta` |
| `[verifier]`             | `verify()` 阶段期间的网络访问。这要求环境提供方支持动态网络策略切换。此设置会覆盖 `[environment]` 基线。                                                                | `docker`⁴, `podman`⁴, `daytona`¹, `e2b`, `islo`⁸, `modal`¹, `novita`¹, `beam`⁵, `hyperbrowser`, `vercel`⁷, `tensorlake`⁶, `runta` |
| `[verifier.environment]` | 使用独立验证器环境时，在验证器环境启动时配置的基线网络策略。                                                                                                            | 任何支持所请求网络模式的环境                                                                                          |

基线阶段取决于环境是否支持所请求的网络模式（见上表）。

在使用[多步骤任务](/docs/core-concepts/tasks/multi-step)时，这些阶段也可以在步骤级别指定。

## 能力 {#capabilities}

每个 `BaseEnvironment` 实现都会声明一个 `EnvironmentCapabilities` 模型，描述它能做什么。以下能力控制网络策略的执行：

| 能力                                   | 说明                                                                                                               | 环境                                                                                                                                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `disable_internet`                     | 环境可以在无互联网访问（`no-network`）的情况下运行容器。                                                           | `docker`³, `podman`³, `daytona`, `e2b`, `langsmith`, `tensorlake`, `cwsandbox`, `runloop`, `modal`¹, `gke`², `ec2`, `novita`, `islo`, `blaxel`, `opensandbox`, `skypilot`, `beam`, `hyperbrowser`, `vercel`⁷, `runta` |
| `network_allowlist`                    | 环境可以将出站限制为已配置的允许列表条目（`allowlist`）。                                                          | `docker`⁴, `podman`⁴, `daytona`¹, `e2b`, `langsmith`, `islo`, `runloop`, `modal`¹, `novita`¹, `blaxel`¹, `beam`⁵, `tensorlake`⁶, `hyperbrowser`, `vercel`⁷, `runta`                                                   |
| `network_allowlist_hostnames`          | 环境可以强制执行 `allowed_hosts` 中的精确主机名条目。                                                              | `docker`⁴, `podman`⁴, `daytona`¹, `e2b`, `langsmith`, `islo`, `runloop`, `modal`¹, `novita`¹, `blaxel`¹, `beam`⁵, `tensorlake`⁶, `hyperbrowser`, `vercel`⁷, `runta`                                                   |
| `network_allowlist_wildcard_hostnames` | 环境可以强制执行 `allowed_hosts` 中的前导通配符主机名条目。                                                        | `docker`⁴, `podman`⁴, `daytona`¹, `e2b`, `langsmith`, `runloop`, `modal`¹, `novita`¹, `blaxel`¹, `hyperbrowser`, `vercel`⁷, `tensorlake`⁶, `runta`                                                                    |
| `network_allowlist_ipv4_addresses`     | 环境可以强制执行 `allowed_hosts` 中的 IPv4 地址字面量条目。                                                        | `docker`⁴, `podman`⁴, `daytona`¹, `e2b`, `modal`¹, `novita`¹, `beam`⁵, `tensorlake`⁶, `hyperbrowser`                                                                                                                  |
| `network_allowlist_ipv6_addresses`     | 环境可以强制执行 `allowed_hosts` 中的 IPv6 地址字面量条目。                                                        | `docker`⁴, `podman`⁴, `beam`⁵                                                                                                                                                                                         |
| `network_allowlist_ipv4_cidrs`         | 环境可以强制执行 `allowed_hosts` 中的 IPv4 CIDR 范围条目。                                                         | `docker`⁴, `podman`⁴, `daytona`¹, `modal`¹, `novita`¹, `beam`⁵, `tensorlake`⁶, `hyperbrowser`                                                                                                                         |
| `network_allowlist_ipv6_cidrs`         | 环境可以强制执行 `allowed_hosts` 中的 IPv6 CIDR 范围条目。                                                         | `docker`⁴, `podman`⁴, `beam`⁵                                                                                                                                                                                         |
| `dynamic_network_policy`               | 环境可以在启动后切换活动网络策略，从而启用 `[agent]` 和 `[verifier]` 阶段覆盖。                                    | `docker`⁴, `podman`⁴, `daytona`¹, `e2b`, `islo`⁸, `modal`¹, `novita`¹, `beam`⁵, `hyperbrowser`, `vercel`⁷, `tensorlake`⁶, `runta`                                                                                     |

### 完整功能对照表 {#full-feature-grid}

| 能力                                   | `docker` | `podman` | `daytona` | `e2b` | `langsmith` | `tensorlake` | `cwsandbox` | `runloop` | `modal` | `gke` | `ec2` | `novita` | `islo` | `blaxel` | `opensandbox` | `skypilot` | `beam` | `hyperbrowser` | `vercel` | `runta` |
  | -------------------------------------- | -------- | -------- | --------- | ----- | ----------- | ------------ | ----------- | --------- | ------- | ----- | ----- | -------- | ------ | -------- | ------------- | ---------- | ------ | -------------- | -------- | ------- |
  | `disable_internet`                     | ✓        | ✓        | ✓         | ✓     | ✓           | ✓            | ✓           | ✓         | ✓       | ✓     | ✓     | ✓        | ✓      | ✓        | ✓             | ✓          | ✓      | ✓              | ✓        | ✓       |
  | `network_allowlist`                    | ✓        | ✓        | ✓         | ✓     | ✓           | ✓            |             | ✓         | ✓       |       |       | ✓        | ✓      | ✓        |               |            | ✓      | ✓              | ✓        | ✓       |
  | `network_allowlist_hostnames`          | ✓        | ✓        | ✓         | ✓     | ✓           | ✓            |             | ✓         | ✓       |       |       | ✓        | ✓      | ✓        |               |            | ✓      | ✓              | ✓        | ✓       |
  | `network_allowlist_wildcard_hostnames` | ✓        | ✓        | ✓         | ✓     | ✓           | ✓            |             | ✓         | ✓       |       |       | ✓        |        | ✓        |               |            |        | ✓              | ✓        | ✓       |
  | `network_allowlist_ipv4_addresses`     | ✓        | ✓        | ✓         | ✓     |             | ✓            |             |           | ✓       |       |       | ✓        |        |          |               |            | ✓      | ✓              |          |         |
  | `network_allowlist_ipv6_addresses`     | ✓        | ✓        |           |       |             |              |             |           |         |       |       |          |        |          |               |            | ✓      |                |          |         |
  | `network_allowlist_ipv4_cidrs`         | ✓        | ✓        | ✓         |       |             | ✓            |             |           | ✓       |       |       | ✓        |        |          |               |            | ✓      | ✓              |          |         |
  | `network_allowlist_ipv6_cidrs`         | ✓        | ✓        |           |       |             |              |             |           |         |       |       |          |        |          |               |            | ✓      |                |          |         |
  | `dynamic_network_policy`               | ✓        | ✓        | ✓         | ✓     |             | ✓            |             |           | ✓       |       |       | ✓        | ✓      |          |               |            | ✓      | ✓              | ✓        | ✓       |

### 提供方特定限制 {#provider-specific-limitations}

¹ 仅单容器任务（不适用于 Docker Compose 模式）。<br />
  ² 仅 Docker Compose（多容器）任务。<br />
  ³ Docker 和 Podman 支持需要 Linux 容器；Windows 容器不支持此网络策略模式。<br />
  ⁴ Docker 和 Podman 支持需要 Linux 容器，以及本地运行时对 Harbor 出站控制边车所用 nftables 内核功能的支持。<br />
  ⁵ Beam 在应用策略前会将具体主机名解析为 IP CIDR；不支持通配符主机条目。<br />
  ⁶ TensorLake 允许列表接受精确主机名、前导通配符主机名（SDK 0.5.110+；通配符匹配任意深度的子域名，但不匹配 apex 域名）、IPv4 字面量和 IPv4 CIDR 范围，但不接受 IPv6 目标。<br />
  ⁷ Vercel 允许列表仅适用于单容器任务。它们基于 TLS SNI 匹配域名规则，接受精确主机名和前导通配符主机名，但不接受 IP 字面量或 CIDR 范围，并拒绝到已列入允许列表主机的明文 HTTP。该策略从沙箱创建时起生效，并可在运行中的沙箱上更新。Compose 任务仅支持 `public` 和 `no-network`。<br />
  ⁸ 仅当未提供自定义网关配置文件或网关配置时，Islo 才支持动态网络策略。

如果任务请求了环境未声明对应能力的网络模式，Harbor 会在校验时拒绝该试次，而不是以更弱的策略运行。

## 为何划分阶段？ {#why-phases}

任务作者常常希望对 Agent（或验证器）强制执行不同的网络策略，但不希望在环境中设置 Agent 时也执行这些策略。例如，你可能希望能够将 Claude Code 安装到环境中，然后在 rollout 期间关闭除 Anthropic API 以外的所有网络访问。

## 支持 {#support}

环境实现会声明它们是否支持在启动时以及运行时配置网络策略。启动时配置的支持比运行时更广泛，不过两者的支持都在增长。
