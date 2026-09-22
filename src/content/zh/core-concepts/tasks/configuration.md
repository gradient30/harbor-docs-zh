# 配置 {#configuration}

> 任务配置、元数据与 schema 参考。

**`task.toml`** 文件指定任务配置和元数据。

```toml
schema_version = "1.3"

[task]
name = "apple/create-unix-os"
authors = [{ name = "Steve Jobs", email = "steve@apple.com" }]

[metadata]
difficulty_explanation = "Trivial task for demonstration"
category = "programming"

[verifier]
timeout_sec = 120.0
env = { API_KEY = "sk-test-123" }
user = "root"  # optional: run the verifier as this OS user

[agent]
timeout_sec = 120.0
user = "agent"  # optional: run the agent as this OS user

[solution]
env = { API_KEY = "sk-test-123" }

[environment]
network_mode = "allowlist"  # baseline; defaults to "public" when omitted
allowed_hosts = ["pypi.org"]
docker_image = "apple/unix-os:latest"
cpus = 1
memory_mb = 2048
storage_mb = 10240
```

## `[environment]` 与 `environment/` {#environment-vs-environment}

默认情况下，Harbor 会尽可能把配置放到 `environment/` 规范中，而不是 `task.toml`。业界已在设计 `environment/` 规范（如 `Dockerfile`）上投入了大量工程精力，它们为常见用例提供了约定。

只有在绝对必要时，Harbor 才要求在 `task.toml` 中进行配置。

`task.toml` 中的少数字段是由于缺少约定或常见陷阱而产生的：

| 字段                        | 说明                                                                                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `environment.docker_image`  | 指定环境使用的 Docker 镜像。（若设置此项，可以完全省略 `environment/`）                                                                                            |
| `environment.network_mode`  | 设置网络隔离模式（例如 `public`、`allowlist`）。                                                                                                                   |
| `environment.allowed_hosts` | 当 `network_mode` 为 `allowlist` 时，列出允许出站网络访问的域名/IP。                                                                                               |
| `environment.env`           | 定义要注入环境的环境变量。                                                                                                                                         |
| `environment.healthcheck`   | 用于检查环境是否健康或就绪的配置。                                                                                                                                 |
| `environment.workdir`       | 设置环境中所运行命令的工作目录。该字段因广泛需求而添加，以便在无需重建镜像的情况下补设 `workdir`。                                                             |

## 字段参考 {#field-reference}

### 通用 {#general}

- `schema_version` (`string`) — 任务配置格式的版本。

- `multi_step_reward_strategy` 默认 `null` — 如何从每步验证器结果推导试次级奖励。仅在设置了 \[\[steps]] 时适用；单步骤任务请保持未设置（多步骤时默认为 "mean"）。参见 [多步骤](/docs/core-concepts/tasks/multi-step)。

### `[task]` {#task}

- `task` (`PackageInfo | null`) 默认 `null` — 可选的 \[task] 段，用于注册表包元数据。若存在，则必须提供 task.name。

- `task.name` (`string`) — org/name 格式的包名（例如 "harbor/hello-world"）。声明 \[task] 时必填。

- `task.authors` (`list[Author]`) 默认 `[]` — 任务作者列表。每项包含必填的 name 和可选的 email（例如 `[{ name = "Jane", email = "jane@example.com" }]`）。

- `task.description` (`string`) — 任务的可读描述。

- `task.keywords` (`list[string]`) 默认 `[]` — 用于搜索和分类的关键词。

### `[metadata]` {#metadata}

- `metadata` (`object`) — 任务作者提供的任意元数据。

### `[verifier]` {#verifier}

- `verifier.timeout_sec` (`number`) 默认 `600` — 验证器超时时间（秒）。

- `verifier.network_mode` 默认 `null`（不覆盖） — verify() 期间的可选覆盖。仅在已设置且与验证器基线不同时应用。参见 [网络策略](/docs/core-concepts/tasks/network-policies)。

- `verifier.allowed_hosts` (`list[string] | null`) 默认 `null` — 当 verifier.network\_mode 为 allowlist 时的允许列表主机名。

- `verifier.env` (`object`) — 运行验证器时要设置的环境变量。

- `verifier.user` (`string | int | null`) 默认 `null` — 运行验证器所使用的用户名或 UID。设置后，会在验证前相应地配置环境的默认用户。若未设置，则使用环境容器的默认用户（通常为 root）。

- `verifier.environment_mode` 默认 `null` — 验证器的运行位置。"shared"（未声明 \[verifier.environment] 时的默认值）复用 Agent 的容器；"separate" 启动带有自有镜像的专用验证器容器。省略此字段同时声明 \[verifier.environment] 即隐含 "separate"。将 "shared" 与 \[verifier.environment] 同时声明是校验错误。

- `verifier.environment` (`EnvironmentConfig | null`) 默认 `null` — 可选的验证器配置，使用与 `[environment]` 相同的 schema。验证器镜像和 `tests/` 构建定义优先于 Agent 环境。专用验证器镜像必须打包测试；回退到 Agent 环境时会将测试上传到 `/tests/`。参见 [镜像选择](/docs/core-concepts/tasks/separate-verifier#image-selection)。

- `verifier.environment.network_mode` — 设置了 \[verifier.environment] 时的独立验证器环境基线。模式与 environment.network\_mode 相同。

- `verifier.environment.allowed_hosts` (`list[string] | null`) 默认 `null` — 当 verifier.environment.network\_mode 为 allowlist 时的允许列表主机名。

### `[agent]` {#agent}

- `agent.timeout_sec` (`number | null`) 默认 `null` — Agent 超时时间（秒）。若未设置，则不强制超时。

- `agent.network_mode` 默认 `null`（不覆盖） — agent.run() 期间的可选覆盖。仅在已设置且与 \[environment] 不同时应用。参见 [网络策略](/docs/core-concepts/tasks/network-policies)。

- `agent.allowed_hosts` (`list[string] | null`) 默认 `null` — 当 agent.network\_mode 为 allowlist 时的允许列表主机名。

- `agent.user` (`string | int | null`) 默认 `null` — 运行 Agent 所使用的用户名或 UID。设置后，会在 Agent 设置和执行前相应地配置环境的默认用户。若未设置，则使用环境容器的默认用户（通常为 root）。

### `[solution]` {#solution}

- `solution.env` (`object`) — 运行题解时要设置的环境变量。

### `[environment]` {#environment}

- `environment.build_timeout_sec` (`number`) 默认 `600` — 环境构建超时时间（秒）。

- `environment.network_mode` — Agent 环境基线。当没有独立验证器环境覆盖时，也是共享验证器的基线。参见 [网络策略](/docs/core-concepts/tasks/network-policies)。

- `environment.allowed_hosts` (`list[string] | null`) 默认 `null` — 当 environment.network\_mode 为 allowlist 时的允许列表主机名。

- `environment.docker_image` (`string | null`) 默认 `null` — 用于环境的预构建 Docker 镜像。设置后，对于受支持的环境类型，environment/Dockerfile 为可选。

- `environment.os` — 任务容器的目标操作系统。"linux"（默认）或 "windows"。为 "windows" 时，Harbor 使用 Windows 风格路径、cmd.exe 执行、通过 tar-over-exec 传输文件，并将脚本发现过滤为仅 .bat。启动时会对照该值校验 Docker 守护进程模式和镜像操作系统；不匹配则立即失败。

- `environment.cpus` (`integer | null`) 默认 `null` — 任务请求的 CPU 数量。省略时，Harbor 将 CPU 规格留给所选提供方决定。

- `environment.memory_mb` (`integer | null`) 默认 `null` — 任务请求的内存量（兆字节）。省略时，Harbor 将内存规格留给所选提供方决定。

- `environment.storage_mb` (`integer | null`) 默认 `null` — 任务请求的存储量（兆字节）。省略时，Harbor 将存储规格留给所选提供方决定。

- `environment.gpus` (`integer | null`) 默认 `null` — 任务请求的 GPU 数量。省略时，Harbor 不请求 GPU。

- `environment.gpu_types` (`list[string] | null`) 默认 `null` — 可接受的 GPU 类型列表（例如 \['H100', 'A100', 'T4']）。None 表示任何 GPU 类型均可。

- `environment.tpu` (`TpuSpec | null`) 默认 `null` — TPU 切片规格（类型 + 拓扑）。设置后，环境会请求匹配该规格的 TPU 节点；每个 pod 的芯片数由拓扑推导。使用单数形式，因为每个任务每个 pod 恰好分配一个 TPU 切片。仅在支持 TPU 的环境上可用（目前为 GKE）。

- `environment.tpu.type` (`string`) — TPU 加速器类型。接受用户友好的别名（例如 'v6e'、'trillium'、'v4'）或规范的 GKE 标签（例如 'tpu-v6e-slice'、'tpu7x'）。

- `environment.tpu.topology` (`string`) — TPU 拓扑，格式为 'NxM' 或 'NxMxK'（例如 '2x4'、'2x2x1'）。必填 — GKE 的隐式默认拓扑不是稳定契约的一部分，省略它会使 Harbor 运行在不同 GKE 版本之间不可复现。每个 pod 的 TPU 芯片数按各维度之积计算（例如 '2x2x1' → 4 个芯片，'2x4' → 8 个芯片）。每个维度必须是正整数（无前导零）。

- `environment.allow_internet` (`boolean | null`) 默认 `null` — 已弃用的兼容字段。请优先使用 \[environment].network\_mode。当已设置且省略了 \[environment].network\_mode 时，false 映射为 no-network，true 映射为 public。

- `environment.env` (`object`) — 任务所需的环境变量，在运行时从宿主机解析。支持 `${VAR}` 和 `${VAR:-default}` 模板语法。

- `environment.mcp_servers.name` (`string`) — 每个 MCP 服务器条目的唯一名称（在 TOML 中以 \[\[environment.mcp\_servers]] 声明服务器）。兼容的 Agent 会自动注册它们。参见 [MCP](/docs/core-concepts/tasks/environment#mcps)。

- `environment.mcp_servers.transport` — Agent 连接服务器的方式。"sse" 和 "streamable-http" 需要 url；"stdio" 需要 command。旧值 "http" 会规范化为 "streamable-http"。

- `environment.mcp_servers.url` (`string | null`) 默认 `null` — 当 transport 为 "sse" 或 "streamable-http" 时的端点 URL（例如 Compose 边车的 [http://mcp-server:8000/mcp](http://mcp-server:8000/mcp)）。这些传输方式必填。

- `environment.mcp_servers.command` (`string | null`) 默认 `null` — 当 transport 为 "stdio" 时要启动的可执行文件。stdio 必填。

- `environment.mcp_servers.args` (`list[string]`) 默认 `[]` — 当 transport 为 "stdio" 时传给 command 的参数。

- `environment.skills_dir` (`string | null`) 默认 `null` — 环境中 [Skills 目录](/docs/core-concepts/tasks/skills) 的路径。内容会注册到兼容的 Agent。

- `environment.healthcheck` (`HealthcheckConfig | null`) 默认 `null` — 环境启动后运行的可选健康检查块（省略整个 \[environment.healthcheck] 段即禁用）。设置后必须提供 command；其他字段使用下面的默认值。

- `environment.healthcheck.command` (`string`) — 环境启动后作为健康检查运行的 shell 命令。退出码 0 表示健康。存在 \[environment.healthcheck] 时必填。

- `environment.healthcheck.interval_sec` (`number`) 默认 `5` — 健康检查尝试之间的间隔秒数。

- `environment.healthcheck.timeout_sec` (`number`) 默认 `30` — 单次健康检查命令的最长秒数。

- `environment.healthcheck.start_period_sec` (`number`) 默认 `0` — 环境启动后的宽限期（秒），在此期间失败不计入。

- `environment.healthcheck.start_interval_sec` (`number`) 默认 `5` — 启动期内检查之间的间隔秒数。

- `environment.healthcheck.retries` (`integer`) 默认 `3` — 将健康检查视为失败前的连续失败次数。

- `environment.workdir` (`string | null`) 默认 `null` — 环境中命令执行的默认工作目录。设置后会覆盖容器的 WORKDIR。

### 产物 {#artifacts}

- `artifacts` (`list[string | ArtifactConfig]`) 默认 `[]` — 要从环境中采集并保存到试次产物目录的根级路径。单步骤：验证后收集一次。多步骤：包含在每个步骤的收集过程中（步骤级路径使用 \[\[steps]].artifacts — 参见 [多步骤](/docs/core-concepts/tasks/multi-step)）。每项是容器路径字符串，或包含 source / destination / exclude 的表。

- `artifacts.source` (`string`) — 要下载的容器路径（文件或目录）。表条目必填；产物列表中的裸字符串是仅指定 source 的简写。

- `artifacts.destination` (`string | null`) 默认 `null` — 试次产物目录下的相对路径。省略时，Harbor 从 source 推导宿主机路径。

- `artifacts.exclude` (`list[string]`) 默认 `[]` — 当 source 为目录时要排除的 glob 模式（作为 tar --exclude 标志传递）。

### 溯源 {#provenance}

- `source` (`string | null`) 默认 `null` — 可选的任务溯源字符串。

## 多步骤配置 {#multi-step-configuration}

上面的字段参考覆盖了单步骤和共享的任务根设置。多步骤任务通过 `[[steps]]` 条目添加每步的 `agent`、`verifier`、`healthcheck`、`min_reward` 和 `artifacts` 覆盖。步骤字段、`workdir/setup.sh` 以及试次级奖励汇总记录在[多步骤任务](/docs/core-concepts/tasks/multi-step)中。

## TOML 模板 {#toml-templates}

在创建任务时，你可以传入 `--metadata-template` 标志，并提供一个 TOML 文件路径，以用元数据字段和配置默认值预填充 `task.toml`：

```bash
harbor task init [org]/[name] --metadata-template task-template.toml
```

模板中的段会覆盖 Harbor 的内置默认值。未指定的内容回退到上面列出的默认值。
