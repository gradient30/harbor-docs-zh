# 独立验证器 {#separate-verifier}

> 在独立环境中运行验证。

默认情况下，验证器与 Agent 运行在同一容器中。`tests/` 文件夹会在验证器阶段开始时上传到 `/tests/`。

不过，你可以选择在独立容器中运行验证器，这对于隔离评分很有用。这可以加强 Agent 与验证器之间的安全边界，并允许你将依赖预装进验证器镜像并提前构建，从而减少安装不稳定性并加快验证器阶段。它还支持[试次重新评分](/docs/core-concepts/jobs/regrade)。

## 启用 {#opt-in}

有两种方式启用独立验证器环境：

1. 在 `task.toml` 的 `[verifier]` 下设置 `environment_mode = "separate"`。
2. 在 `task.toml` 中添加 `[verifier.environment]`。

### 方案 1：复用 Agent 的环境配置 {#option-1-reuse-the-agent-s-environment-configuration}

在 `[verifier]` 下设置 `environment_mode = "separate"`：

```toml
[environment]
docker_image = "some/image:latest"
cpus = 2
memory_mb = 1024

[verifier]
environment_mode = "separate"
```

如果没有验证器专用镜像或构建定义，Harbor 会启动一份全新的 Agent 环境副本，并将 `tests/` 上传到 `/tests/`。不会继承 Agent 对文件系统的更改。

### 方案 2：使用验证器专用环境 {#option-2-use-a-verifier-specific-environment}

添加 `[verifier.environment]` 以使用不同的镜像或资源。这会隐式启用独立模式：

```toml
[verifier.environment]
docker_image = "my-org/grading-image:latest"
cpus = 2
memory_mb = 1024
```

它使用与 `[environment]` 相同的 schema，包括[网络策略](/docs/core-concepts/tasks/network-policies)。不能与 `environment_mode = "shared"` 同时使用。

### 模式解析 {#mode-resolution}

| `environment_mode` | `[verifier.environment]` | 结果                                             |
| ------------------ | ------------------------ | ------------------------------------------------ |
| 省略               | 省略                     | `"shared"`                                       |
| 省略               | 存在                     | `"separate"`                                     |
| `"shared"`         | 省略                     | `"shared"`                                       |
| `"shared"`         | 存在                     | **校验错误**                                     |
| `"separate"`       | 省略                     | `"separate"`（顶层 `[environment]` 的副本）      |
| `"separate"`       | 存在                     | `"separate"`（验证器专用环境）                   |

## 镜像选择 {#image-selection}

Harbor 选择第一个可用的定义：

| 优先级 | 定义                                                            | 测试                                   |
| ------ | --------------------------------------------------------------- | -------------------------------------- |
| 1      | `[verifier.environment].docker_image`                           | 必须烘焙进镜像。                       |
| 2      | `tests/Dockerfile`（或 `tests/docker-compose.yaml`）            | 必须烘焙进镜像。                       |
| 3      | `[environment].docker_image`                                    | 从 `tests/` 上传到 `/tests/`。         |
| 4      | `environment/Dockerfile`（或 `environment/docker-compose.yaml`）| 从 `tests/` 上传到 `/tests/`。         |

资源设置在提供时来自 `[verifier.environment]`，否则来自 `[environment]`。继承的 Agent 镜像永远不会覆盖验证器构建定义。

### 专用验证器镜像 {#dedicated-verifier-image}

专用验证器镜像必须提供 `/tests/test.sh`（Windows 上为 `/tests/test.bat`）。Harbor 不会在运行时向这些镜像上传测试。

```bash
my-task/
├── task.toml
├── instruction.md
├── environment/
│   └── Dockerfile        # agent environment
└── tests/
    ├── Dockerfile        # verifier image
    ├── test.sh
    └── grader.py
```

例如，`tests/Dockerfile` 可以打包评分文件：

```dockerfile
FROM python:3.12-slim
COPY . /tests/
```

## 产物传输 {#artifact-transfer}

独立验证器运行时，Harbor 会复制以下内容到验证器环境：

* `/logs/artifacts/`（Agent 发布目录）
* 任务级、试次级和步骤级 `artifacts` 字段中列出的路径

产物会按原始 `source` 路径上传到验证器环境，而不是宿主机上的 `destination` 路径。例如，`{ source = "/app/report.json", destination = "report.json" }` 会在验证器中还原到 `/app/report.json`；`destination` 只控制它在宿主机上的保存位置。参见 [产物](/docs/core-concepts/tasks/artifacts)。

除非声明为产物，否则不会复制 `/logs/agent/` 和 `/logs/verifier/` — 例如用于轨迹评分：

```toml
artifacts = ["/logs/agent/trajectory.json"]
```

## 多步骤任务 {#multi-step-tasks}

每个步骤都可以在 `[steps.verifier]` 下覆盖验证器模式。支持按步骤混合共享/独立：

```toml
[[steps]]
name = "build"
# Inherits trial-level mode (shared by default). {#inherits-trial-level-mode-shared-by-default}

[[steps]]
name = "grade"
[steps.verifier.environment]
docker_image = "my-org/grading-image:latest"
```

解析规则：若设置了 `[steps.verifier].environment_mode` 则使用它；否则若存在 `[steps.verifier.environment]` 则隐含 `"separate"`；否则使用试次级设置。网络规则参见 [网络策略](/docs/core-concepts/tasks/network-policies)。

镜像优先级为：步骤镜像、步骤测试构建定义、任务验证器镜像、任务测试构建定义，然后是 Agent 环境。没有构建定义的步骤 `tests/` 目录不会覆盖任务验证器镜像。在回退到 Agent 环境时，Harbor 先上传基础测试，再叠加步骤测试。

测试会对照每个步骤的**有效**验证器操作系统进行校验，因此当存在匹配的 `test.sh` / `test.bat` 时，Linux Agent 可以在 Windows 上评分（反之亦然）。
