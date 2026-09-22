# 环境 {#environment}

> 任务所使用的环境。

`environment/` 目录定义 Agent 和验证器运行所在的环境。该目录通常包含 `Dockerfile` 或 `docker-compose.yaml` 文件。

## Harbor 中的环境是什么？ {#what-is-an-environment-in-harbor}

Harbor 中的环境是一个 **`BaseEnvironment`** 实现，定义了以下方法：`exec`、`upload_file`、`upload_dir`、`download_file`、`download_dir`、`start`、`stop`。

这些方法通常针对 [Docker](https://www.docker.com/) 等容器运行时，或 [Daytona](https://www.daytona.io/)、[Modal](https://modal.com/) 等云沙箱提供方来实现。

## 预构建 Docker 镜像 {#prebuilt-docker-images}

用户可以预先构建 Docker 镜像，托管到 Docker Hub 或 GitHub Packages 等容器仓库，并在 `task.toml` 中通过 `[environment].docker_image` 引用。若该字段存在，大多数提供方会优先使用预构建镜像，而不是从 `environment/` 目录构建，以获得更快的速度和更好的可复现性。

> **说明** 如果在 `task.toml` 中设置了 `[environment].docker_image`，则可以完全省略 `environment/` 目录。

## MCP {#mcps}

Harbor 通过 `environment/docker-compose.yaml` 支持多容器环境。详见 [多容器](/docs/core-concepts/tasks/multi-container)。

MCP 常用于模拟数据库或 API 等外部服务，可以作为 `docker-compose.yaml` 文件中的服务来实现。

可用的 MCP 服务器应在 `task.toml` 中通过 `[[environment.mcp_servers]]` 声明，以便[兼容的 Agent](/docs/core-concepts/agents/pre-integrated-agents#agent-capabilities)（例如 Claude Code、Codex）能够自动注册它们。

```toml
[[environment.mcp_servers]]
name = "mcp-server"
transport = "streamable-http"
url = "http://mcp-server:8000/mcp"
```

## Skills {#skills}

可以将 Skills 打包进环境，并通过 `[environment].skills_dir` 暴露给[兼容的 Agent](/docs/core-concepts/agents/pre-integrated-agents#agent-capabilities)。

```toml
[environment]
skills_dir = "/app/skills"
```

关于所需布局、镜像配置，以及 Harbor 如何将 Skills 传递给 Agent，参见 [任务 → Skills](/docs/core-concepts/tasks/skills)。

## 工具 {#tools}

Harbor 将工具视为 Agent 的组成部分，而不是环境的组成部分。如果环境确实提供工具，应以 MCP、Skills、API 或 CLI 的形式提供。

在 Harbor 中，Agent 可以在环境内部或外部运行。如果在环境内部运行，显然可以使用任意工具。如果在环境外部运行，其工具必须由上述 `BaseEnvironment` 原语组成（这些原语接近系统调用，因此约束相对较少）。

## 外部服务如何处理？ {#what-about-external-services}

数据库或 API 等外部服务应当被模拟，或直接使用。

例如，如果任务需要与 Stripe 交互，你可以将 Stripe 的一小部分作为服务在 `environment/docker-compose.yaml` 中模拟，或直接使用真实的 Stripe API。这对于像 Stripe 这类已经提供沙箱/开发模式的产品最为适用。

我们建议尽可能对外部服务做沙箱化，而不是直接使用，因为这能提高可控性和可复现性。

如果确实选择直接对接生产服务，可考虑使用 `[agent].allowed_hosts` 将 Agent 的网络访问限制到该特定端点。

## 如果 Agent *和* 环境都是外部服务怎么办？ {#what-if-my-agent-and-environment-are-external-services}

生产环境中的 Agent 与环境常常是紧耦合的产品（例如，与产品 API 紧耦合的工具调用 Agent）。在这种情况下，你可能会想用 Harbor 环境去请求 Agent 的 API 来执行 rollout，然后再请求环境的 API 来验证 Agent 的输出。

如果你发现自己在这样做，Harbor 可能并不适合你的用例。

Harbor 擅长评估依赖代码执行和文件系统的编程/协作 Agent。尽管如此，我们相信大多数 Agent 正在朝这个方向演进，也相信所有现有产品公司都应当评估编程 Agent 使用其 MCP、API 和 CLI 的效果，或它们能否被用来驱动产品功能（例如从 W2 中提取字段）。

## 特殊路径 {#special-paths}

Linux 路径（Windows 使用 `C:` 等价路径）：

| 路径              | 说明                                                                         |
| ----------------- | ---------------------------------------------------------------------------- |
| `/logs/verifier/` | 奖励与验证器输出                                                             |
| `/logs/agent/`    | 可选的 Agent 日志                                                            |
| `/solution/`      | Oracle 将[题解](/docs/core-concepts/tasks/solution)复制到此处                |
| `/tests/`         | Harbor 将[测试](/docs/core-concepts/tasks/verifier)复制到此处，供共享验证器使用 |

`/logs/` 会在试次结束后同步到宿主机，便于调试。

## 资源 {#resources}

资源在 `task.toml` 的 `[environment]` 段中声明。

```toml
[environment]
cpus = 2
memory_mb = 4096
storage_mb = 10240
gpus = 1
gpu_types = ["H100", "A100"]

[environment.tpu]
type = "v6e"
topology = "2x4"
```

这些字段均为可选；若省略，Harbor 将使用提供方的默认规格。

Harbor 用户还可以使用 `--cpus` 和 `--memory` 标志，选择提供方如何应用这些资源声明。详见 [资源](/docs/core-concepts/tasks/resources)。

## 操作系统 {#operating-system}

`[environment].os` 为 `"linux"`（默认）或 `"windows"`。Windows 支持情况请查看 [Agent 能力](/docs/core-concepts/agents/pre-integrated-agents#agent-capabilities)。
