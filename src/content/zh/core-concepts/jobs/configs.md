# 配置 {#configs}

> 配置 Harbor 作业的完整模式。

```bash
harbor run -c "<config.yaml>"
```

作业配置文件提供与 `harbor run` 标志相同的控制项，同时支持在一份可复用的 JSON 或 YAML 文件中配置多个 Agent、数据集和任务。

示例：

```yaml
job_name: my-first-job
tasks:
  - path: "<task-path>"
agents:
  - name: codex
    model_name: openai/gpt-6-astra
environment:
  type: docker
```

## 创建配置 {#creating-a-config}

可以使用

```bash
harbor job init
```

生成配置。它接受与 `harbor run` 相同的标志。

要生成包含全部可用字段的配置：

```bash
harbor job init "<config.yaml>" --full
```

使用 `--print-config` 可检查已解析配置而不运行作业：

```bash
harbor run --config "<config.yaml>" --print-config
```

使用 `harbor job schema` 打印配置 JSON Schema：

```bash
harbor job schema
```

使用 `--dry-run` 检查配置、Agent kwargs、凭据和任务来源，而不下载任务或运行作业：

```bash
harbor run --dry-run --config "<config.yaml>"
```

加上 `--launch` 可使用 Harbor Hub 模式与校验。

> **说明** 所有顶层字段均为可选。Harbor 会应用下方所示的默认值。标记为必填的字段仅在其所属对象存在时才必填。

## 作业 {#job}

- `job_name` (`string`) 默认 `current timestamp` — 作业名称。省略时，Harbor 使用当前时间，格式为 `YYYY-MM-DD__HH-MM-SS`。

- `jobs_dir` (`string`) — Harbor 存储作业结果的目录。

- `n_attempts` (`integer`) 默认 `1` — 每个任务与 Agent 组合的尝试次数。

- `install_only` (`boolean`) 默认 `false` — 仅运行 Agent 设置，跳过 Agent 阶段并禁用验证。

- `timeout_multiplier` (`number`) 默认 `1.0` — 应用于任务超时的乘数，除非被阶段特定乘数覆盖。

- `agent_timeout_multiplier` (`number | null`) 默认 `null` — 应用于 Agent 执行超时的乘数。

- `verifier_timeout_multiplier` (`number | null`) 默认 `null` — 应用于验证器超时的乘数。

- `agent_setup_timeout_multiplier` (`number | null`) 默认 `null` — 应用于 Agent 设置超时的乘数。

- `environment_build_timeout_multiplier` (`number | null`) 默认 `null` — 应用于环境构建超时的乘数。

- `debug` (`boolean`) 默认 `false` — 启用调试日志。

- `n_concurrent_trials` (`integer`) 默认 `4` — 最大并发试次数。必须至少为 1。每个 Agent 的并发限制不能超过此值。

- `quiet` (`boolean`) 默认 `false` — 抑制各个试次的进度显示。

- `retry` (`RetryConfig`) — 重试与指数退避配置。

- `environment` (`EnvironmentConfig`) — 应用于每个试次的共享环境提供方配置。

- `verifier` (`VerifierConfig`) — 应用于每个试次的共享验证器配置。

- `metrics` (`list[MetricConfig]`) 默认 `[]` — 作业级指标，会追加到每个数据集的指标之后。

- `agents` (`list[AgentConfig]`) — 作业要评估的 Agent。

- `user_agent` (`UserAgentConfig | null`) 默认 `null` — 可选的模拟用户 Agent 与桥接，应用于每个试次。

- `datasets` (`list[DatasetConfig]`) 默认 `[]` — 展开为任务的数据集来源。

- `tasks` (`list[TaskConfig]`) 默认 `[]` — 单个任务来源。

- `artifacts` (`list[string | ArtifactConfig]`) 默认 `[]` — 每个试次结束后收集的环境路径。字符串是仅设置 `source` 的产物简写。

- `extra_instruction_paths` (`list[string]`) 默认 `[]` — 追加到每个任务指令的文件，位于 `extra_instructions` 之前。

- `extra_instructions` (`list[string]`) 默认 `[]` — 在 `extra_instruction_paths` 之后追加到每个任务指令的内联文本。

- `source_jobs` (`list[SourceJobConfig]`) 默认 `[]` — 用于重新评分的源作业。设置后，Harbor 从每个匹配的源试次派生一个新试次，而不是按常规方式展开任务、Agent 和尝试次数。

## 重试 {#retry}

- `retry.max_retries` (`integer`) 默认 `0` — 最大重试次数。必须至少为 0。

- `retry.include_exceptions` (`set[string] | null`) 默认 `null` — 符合重试条件的异常类名。`null` 包含下方未排除的所有异常。

- `retry.exclude_exceptions` (`set[string] | null`) 默认 `built-in non-retryable exceptions` — 永不重试的异常类名。排除优先于包含。默认值为 `AgentTimeoutError`、`VerifierTimeoutError`、`RewardFileNotFoundError`、`RewardFileEmptyError`、`VerifierOutputParseError`、`ApiUsageLimitError`、`AgentSafetyRefusalError`、`AgentAuthenticationError` 和 `ModelNotFoundError`。

- `retry.wait_multiplier` (`number`) 默认 `1.0` — 指数退避等待时间的乘数。

- `retry.min_wait_sec` (`number`) 默认 `1.0` — 重试之间的最小延迟（秒）。

- `retry.max_wait_sec` (`number`) 默认 `60.0` — 重试之间的最大延迟（秒）。

## Agent {#agents}

- `agents[].name` (`string | null`) — 预集成 Agent 名称。自定义 Agent 请使用 `import_path`。

- `agents[].import_path` (`string | null`) 默认 `null` — 自定义 Agent 导入路径，格式为 `module.path:ClassName`。

- `agents[].model_name` (`string | null`) 默认 `null` — 传给 Agent 的模型标识符。

- `agents[].n_concurrent` (`integer | null`) 默认 `null` — 单个 Agent 并发 `agent.run()` 阶段的上限。必须至少为 1，且不能超过 `n_concurrent_trials`。

- `agents[].concurrency_group` (`string | null`) 默认 `null` — 共享并发池名称。同一组中的 Agent 必须设置相同的 `n_concurrent` 值。

- `agents[].skills` (`list[string]`) 默认 `[]` — 本地 Skill 目录、Git URL，或 `org/name[@ref]` Skill 来源。

- `agents[].override_timeout_sec` (`number | null`) 默认 `null` — 用此值（秒）替换任务的 Agent 超时。

- `agents[].override_setup_timeout_sec` (`number | null`) 默认 `null` — 用此值（秒）替换 Agent 设置超时。

- `agents[].max_timeout_sec` (`number | null`) 默认 `null` — 有效 Agent 超时的上限（秒）。

- `agents[].resume_trajectory` (`boolean`) 默认 `false` — 在多步骤任务的步骤之间恢复 Agent 的原生会话。需要 Agent 支持恢复。

- `agents[].load_trajectory` (`string | null`) 默认 `null` — 在第一步之前加载原生 `.jsonl` 或 ATIF `.json` 轨迹。需要相应的 Agent 能力。

- `agents[].extra_allowed_hosts` (`list[string]`) 默认 `[]` — 仅在 `agent.run()` 期间添加到允许列表的主机名、IP 地址或 CIDR 范围。

- `agents[].include_logs` (`list[string]`) 默认 `[]` — 选择要下载的 Agent 日志文件的 glob 模式。

- `agents[].exclude_logs` (`list[string]`) 默认 `[]` — 在应用 `include_logs` 之后，从已下载 Agent 日志中排除的 glob 模式。

- `agents[].kwargs` (`object`) — 传给 Agent 构造函数的集成特定关键字参数。

- `agents[].env` (`object[string, string]`) — 仅在 Agent 阶段暴露的环境变量。

- `agents[].mcp_servers` (`list[MCPServerConfig]`) 默认 `[]` — 提供给 Agent 的 MCP 服务器。

请参阅[预集成 Agent](/docs/core-concepts/agents/pre-integrated-agents)、[自定义 Agent](/docs/core-concepts/agents/custom-agents)、[Skills](/docs/core-concepts/jobs/skills)和[加载轨迹](/docs/core-concepts/jobs/loading-trajectories)。

### MCP 服务器 {#mcp-servers}

- `agents[].mcp_servers[].name` (`string`) — 必填的服务器名称。

- `agents[].mcp_servers[].transport` — MCP 传输。旧值 `http` 会规范化为 `streamable-http`。

- `agents[].mcp_servers[].url` (`string | null`) 默认 `null` — 服务器 URL。`sse` 和 `streamable-http` 传输必填。

- `agents[].mcp_servers[].command` (`string | null`) 默认 `null` — 可执行命令。`stdio` 传输必填。

- `agents[].mcp_servers[].args` (`list[string]`) 默认 `[]` — 传给 `stdio` 服务器命令的参数。

## 模拟用户 {#simulated-user}

`user_agent` 支持 `agents[]` 中的每个字段，外加下方字段。配置 `user_agent` 时，`bridge` 字段必填。

- `user_agent.user_persona_path` (`string | null`) 默认 `null` — 定义模拟用户人设的文件路径。

- `user_agent.user_prompt_template_path` (`string | null`) 默认 `null` — 模拟用户使用的 Jinja2 提示模板路径。

- `user_agent.bridge` (`BridgeConfig`) — 将模拟用户连接到主 Agent 的必填桥接。

- `user_agent.bridge.kind` — 必填的桥接实现。目前仅支持 `acp`。

- `user_agent.bridge.prompt_path` (`string | null`) 默认 `null` — 可选，用于替换桥接指令。

- `user_agent.bridge.kwargs` (`object`) — 桥接特定的关键字参数。

请参阅[模拟用户](/docs/core-concepts/jobs/simulate-a-user)。

## 环境 {#environment}

- `environment.type` (`EnvironmentType | null`) — 预集成环境提供方：`docker`、`podman`、`daytona`、`e2b`、`modal`、`runloop`、`langsmith`、`ec2`、`gke`、`ack`、`openshift`、`novita`、`apple-container`、`singularity`、`islo`、`tensorlake`、`cwsandbox`、`use-computer`、`cua-cloud`、`blaxel`、`opensandbox`、`beam`、`skypilot`、`hf-sandbox`、`hyperbrowser` 或 `vercel`。请参阅[预集成沙箱](/docs/core-concepts/sandboxes/pre-integrated-sandboxes)。

- `environment.import_path` (`string | null`) 默认 `null` — 自定义环境导入路径，格式为 `module.path:ClassName`。

- `environment.force_build` (`boolean`) 默认 `false` — 即使存在缓存构建也重新构建环境。

- `environment.delete` (`boolean`) 默认 `true` — 试次结束后删除环境。

- `environment.cpu_enforcement_policy` — 提供方如何强制执行任务的 CPU 值。

- `environment.memory_enforcement_policy` — 提供方如何强制执行任务的内存值。

- `environment.override_cpus` (`integer | null`) 默认 `null` — 在运行时替换任务的 CPU 值。

- `environment.override_memory_mb` (`integer | null`) 默认 `null` — 替换任务的内存值（MB）。

- `environment.override_storage_mb` (`integer | null`) 默认 `null` — 替换任务的存储值（MB）。

- `environment.override_gpus` (`integer | null`) 默认 `null` — 替换任务的 GPU 数量。

- `environment.override_tpu` (`TpuSpec | null`) 默认 `null` — 替换任务的 TPU 规格。

- `environment.suppress_override_warnings` (`boolean`) 默认 `false` — 已弃用。此字段会被接受但无效果，序列化配置时会被排除。

- `environment.mounts` (`list[ServiceVolumeConfig] | null`) 默认 `null` — 仅用于 Agent 环境的 Docker Compose 长语法卷挂载。

- `environment.extra_docker_compose` (`list[string]`) 默认 `[]` — 仅用于 Agent 环境的额外 Docker Compose 覆盖层文件。

- `environment.env` (`object[string, string]`) — 在沙箱内暴露的基线环境变量。

- `environment.kwargs` (`object`) — 传给环境构造函数的提供方特定关键字参数。

- `environment.extra_allowed_hosts` (`list[string]`) 默认 `[]` — 添加到环境网络基线的主机名、IP 地址或 CIDR 范围。

请参阅[资源](/docs/core-concepts/tasks/resources)、[网络策略](/docs/core-concepts/tasks/network-policies)和[自定义沙箱](/docs/core-concepts/sandboxes/custom-sandboxes)。

### TPU 覆盖 {#tpu-override}

- `environment.override_tpu.type` (`string`) — 必填的 TPU 别名或规范 GKE accelerator 标签，例如 `v6e` 或 `tpu-v6e-slice`。

- `environment.override_tpu.topology` (`string`) — 必填拓扑，格式为 `NxM` 或 `NxMxK`，例如 `2x4`。

### 挂载 {#mounts}

- `environment.mounts[].type` — 必填的挂载类型。

- `environment.mounts[].source` (`string`) — 必填的主机路径、命名卷或镜像来源。

- `environment.mounts[].target` (`string`) — 容器内的必填目标路径。

- `environment.mounts[].read_only` (`true`) 默认 `omitted` — 设为 `true` 表示只读挂载。

- `environment.mounts[].bind.create_host_path` (`false`) 默认 `omitted` — 设为 `false` 可阻止 Docker Compose 创建缺失的 bind 源路径。

- `environment.mounts[].bind.selinux` 默认 `omitted` — bind 挂载的可选 SELinux 重新标记模式。

- `environment.mounts[].volume.subpath` (`string`) 默认 `omitted` — 命名卷内的可选子路径。

- `environment.mounts[].image.subpath` (`string`) 默认 `omitted` — 镜像挂载内的可选子路径。

## 验证器 {#verifier}

- `verifier.override_timeout_sec` (`number | null`) 默认 `null` — 用此值（秒）替换任务的验证器超时。

- `verifier.max_timeout_sec` (`number | null`) 默认 `null` — 有效验证器超时的上限（秒）。

- `verifier.include_logs` (`list[string]`) 默认 `[]` — 选择要下载的验证器日志文件的 glob 模式。奖励文件始终会下载。

- `verifier.exclude_logs` (`list[string]`) 默认 `[]` — 在应用 `include_logs` 之后，从验证器日志中排除的 glob 模式。

- `verifier.env` (`object[string, string]`) — 仅在验证器阶段暴露的环境变量。

- `verifier.import_path` (`string | null`) 默认 `null` — 自定义验证器导入路径，格式为 `module.path:ClassName`。

- `verifier.kwargs` (`object`) — 传给自定义验证器的关键字参数。

- `verifier.disable` (`boolean`) 默认 `false` — 跳过验证。启用 `install_only` 时会自动设为 `true`。

请参阅[自定义验证器](/docs/core-concepts/jobs/custom-verifiers)和[环境变量](/docs/core-concepts/jobs/environment-variables)。

## 数据集 {#datasets}

- `datasets[].path` (`string | null`) 默认 `null` — 本地数据集目录。与 `repo` 一起使用时，选择仓库相对的隐式数据集目录。

- `datasets[].name` (`string | null`) 默认 `null` — `org/name` 格式的 Harbor Hub 数据集，或自定义/Git 仓库注册表的裸数据集名称。

- `datasets[].version` (`string | null`) 默认 `null` — 从 JSON 注册表或命名 Git 仓库注册表中选择的版本。

- `datasets[].ref` (`string | null`) 默认 `null` — 为 Harbor Hub 数据集选择的标签、修订或摘要。

- `datasets[].registry_url` (`string | null`) 默认 `null` — 自定义 `registry.json` 文件的 URL。

- `datasets[].registry_path` (`string | null`) 默认 `null` — 自定义 `registry.json` 的路径。与 `repo` 一起使用时，此路径相对于仓库。

- `datasets[].repo` (`string | null`) 默认 `null` — Git 仓库简写或 URL，可选使用 `@ref` 固定。

- `datasets[].overwrite` (`boolean`) 默认 `false` — 覆盖已缓存的远程任务。

- `datasets[].download_dir` (`string | null`) 默认 `null` — 用于缓存已下载任务的目录。

- `datasets[].task_names` (`list[string] | null`) 默认 `null` — 按名称选择任务的 glob 模式。

- `datasets[].exclude_task_names` (`list[string] | null`) 默认 `null` — 在应用 `task_names` 之后排除任务的 glob 模式。

- `datasets[].n_tasks` (`integer | null`) 默认 `null` — 应用包含与排除过滤器后的最大任务数。

每个数据集必须恰好选择一种来源形态。不使用 `repo` 时，设置 `path` 或 `name` 之一，但不能同时设置。使用 `repo` 时，`path` 选择隐式数据集，`name` 选择命名注册表数据集。`version` 和 `ref` 不能同时设置。

请参阅[数据集](/docs/core-concepts/datasets/datasets)、[注册表](/docs/core-concepts/datasets/registries)和 [Git 仓库](/docs/core-concepts/datasets/git-repos)。

## 任务 {#tasks}

- `tasks[].path` (`string | null`) 默认 `null` — 本地任务目录；设置了 `git_url` 时，为 Git 仓库内的路径。

- `tasks[].git_url` (`string | null`) 默认 `null` — 包含该任务的 Git 仓库。

- `tasks[].git_commit_id` (`string | null`) 默认 `null` — 包含该任务的 Git 提交。需要 `git_url`。

- `tasks[].name` (`string | null`) 默认 `null` — `org/name` 格式的 Harbor Hub 任务名称。

- `tasks[].ref` (`string | null`) 默认 `null` — Harbor Hub 任务的标签、修订或摘要。需要 `name`。

- `tasks[].overwrite` (`boolean`) 默认 `false` — 覆盖已缓存的远程任务。

- `tasks[].download_dir` (`string | null`) 默认 `null` — 用于缓存已下载任务的目录。

- `tasks[].source` (`string | null`) 默认 `null` — 可选的来源标签，用于对任务和指标分组。

每个任务必须设置 `path` 或 `name` 之一，但不能同时设置。Git 任务将 `path` 与 `git_url` 一起使用；Harbor Hub 任务使用 `name` 以及可选的 `ref`。

请参阅[任务 → 概述](/docs/core-concepts/tasks/overview)。

## 指标 {#metrics}

- `metrics[].type` — 用于聚合任务奖励的指标实现。

- `metrics[].kwargs` (`object`) — 传给指标实现的关键字参数。`uv-script` 需要 `script_path`。

请参阅[指标](/docs/core-concepts/datasets/metrics)。

## 产物 {#artifacts}

- `artifacts[].source` (`string`) — 要收集的必填环境路径。不能包含 `..` 路径分量。

- `artifacts[].destination` (`string | null`) 默认 `null` — 试次产物目录下的可选路径。省略时 Harbor 从 `source` 推导。

- `artifacts[].exclude` (`list[string]`) 默认 `[]` — 下载目录产物时排除的模式。

- `artifacts[].service` (`string | null`) 默认 `null` — 要从中收集的 Docker Compose 服务。`null` 和 `main` 指向 Agent 容器。

请参阅[产物收集](/docs/core-concepts/jobs/artifact-collection)。

## 重新评分来源 {#regrade-sources}

- `source_jobs[].action` — 必填的派生操作。目前仅支持 `regrade`。

- `source_jobs[].type` — 必填的来源位置。

- `source_jobs[].job_id` (`string | null`) 默认 `null` — 源作业 UUID。Hub 来源必填，本地来源可选。

- `source_jobs[].path` (`string | null`) 默认 `null` — 源作业目录。本地来源必填，Hub 来源无效。

重新评分不能与 `install_only` 组合使用。请参阅[重新评分](/docs/core-concepts/jobs/regrade)。
