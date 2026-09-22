# 多容器 {#multi-container}

> Harbor 的多容器文档。

多容器环境可以向环境中添加额外服务，用于表示数据库、API、MCP 等。

## 规范 {#specification}

大多数情况下，使用 **`environment/docker-compose.yaml`** 来指定多容器环境。

> **说明** Harbor 本身不绑定某一种基础设施即代码规范，因此也可以用 `docker-compose.yaml` 以外的方式支持多容器环境。我们尚未原生实现其他规范的支持，但用户可以通过实现[自定义环境](/docs/core-concepts/sandboxes/custom-sandboxes)自行支持。

## 保留服务与默认 Compose {#reserved-services-and-default-compose}

Harbor 将 `main` 服务名保留给 Agent 容器。所有其他服务都视为边车。Harbor 会把你的 `environment/docker-compose.yaml` 合并到基础 compose 文件之上，因此你无需自己定义 `main` 服务的构建或保活命令。

对于包含 `Dockerfile` 的任务，基础 compose 是 [`docker-compose-build.yaml`](https://github.com/harbor-framework/harbor/blob/main/src/harbor/environments/docker/docker-compose-build.yaml)：

```yaml
services:
  main:
    build:
      context: ${CONTEXT_DIR}
    pull_policy: build
    command: [ "sh", "-c", "sleep infinity" ]
```

对于使用预构建镜像而不是本地构建的任务，Harbor 使用 [`docker-compose-prebuilt.yaml`](https://github.com/harbor-framework/harbor/blob/main/src/harbor/environments/docker/docker-compose-prebuilt.yaml)：

```yaml
services:
  main:
    image: ${PREBUILT_IMAGE_NAME}
    command: [ "sh", "-c", "sleep infinity" ]
```

## 示例布局 {#example-layout}

```bash
my-task/
├── instruction.md
├── task.toml
└── environment/
    ├── Dockerfile              # agent (main) service
    ├── docker-compose.yaml     # sidecars + depends_on
    └── mcp-server/             # optional service build context
        ├── Dockerfile
        └── server.py
```

Harbor 将 Agent 服务视为 **`main`**。在 compose 中，你通常只需添加 `depends_on` 和健康检查等覆盖项；其余部分由 Harbor 负责对接。

```yaml
services:
  main:
    depends_on:
      mcp-server:
        condition: service_healthy

  mcp-server:
    build:
      context: ./mcp-server
    expose:
      - "8000"
    healthcheck:
      test: ["CMD", "python", "-c", "import socket; s=socket.create_connection(('localhost',8000),timeout=2); s.close()"]
      interval: 2s
      timeout: 5s
      retries: 15
      start_period: 5s
```

边车与 `main` 共享同一个 Docker 网络；通过**服务名**访问它们（例如 `http://mcp-server:8000`）。

## 支持 {#support}

| 支持                     | 环境                                                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原生 Compose             | `docker`, `podman`, `ec2`, `islo`, `vercel`                                                                                                       |
| DinD Docker Compose      | `blaxel`, `beam`, `daytona`, `gke`, `hyperbrowser`, `langsmith`, `modal`, `novita`, `tensorlake`                                                  |
| 其他多容器规范           | 仅自定义环境                                                                                                                                      |
| 不支持                   | `e2b`, `runloop`, `ack`, `openshift`, `apple-container`, `singularity`, `cwsandbox`, `use-computer`, `cua-cloud`, `opensandbox`, `skypilot`, `hf-sandbox` |
