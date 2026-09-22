# 预集成沙箱 {#pre-integrated-sandboxes}

> 使用 Harbor 支持的本地或远程环境运行任务。

Harbor 在隔离环境中运行每个试次。本地运行时便于开发；远程提供商可释放本地资源并支持更高并发。

> **说明** Harbor 在 CLI（`--env`/`-e`）和作业配置（`environment.type`）中将沙箱称为「**环境**」。这个名字确实不太合适，但现在改已经太晚了。

## 使用云沙箱运行 {#run-with-a-cloud-sandbox}

沙箱默认不会安装。安装一个沙箱，例如 [Daytona](https://www.daytona.io/)：

```bash
uv tool install "harbor[daytona]"
```

将 `daytona` 替换为[所有沙箱选项](#available-sandboxes)中的对应名称即可安装该沙箱。要安装**全部**预集成沙箱，使用：

```bash
uv tool install "harbor[cloud]"
```

本地运行时（例如 `docker`）不需要可选的 Harbor Python 依赖，但其运行时或 CLI 仍须安装。

**CLI**

```bash
    export DAYTONA_API_KEY="..."
    harbor run \
      -d terminal-bench@2.0 \
      -a codex -m openai/gpt-5.6-sol \
      -e daytona \
      -n 32
    ```

**Config**

```json
    {
      "n_concurrent_trials": 32,
      "environment": {
        "type": "daytona"
      },
      "agents": [
        {
          "name": "codex",
          "model_name": "openai/gpt-5.6-sol"
        }
      ],
      "datasets": [
        {
          "name": "terminal-bench",
          "version": "2.0"
        }
      ]
    }
    ```

    ```bash
    export DAYTONA_API_KEY="..."
    harbor run --config config.json
    ```

### 替代方案：从源码运行 Harbor {#alternative-run-harbor-from-source}

从源码运行 Harbor 时，`--extra daytona` 会在执行命令前安装 Daytona 的可选依赖：

  ```bash
  export DAYTONA_API_KEY="..."
  uv run --no-dev --extra daytona harbor run \
    -t hello-world/hello-world \
    -a codex -m openai/gpt-5.6-sol \
    -e daytona
  ```

Harbor 会在可用时运行提供商预检。否则，缺失的设置会在提供商启动时报告。**重要**：请参阅[环境变量](/docs/core-concepts/jobs/environment-variables)，以配置提供商凭据并控制哪些变量进入沙箱。

## 可用沙箱 {#available-sandboxes}

这些分类描述试次的运行位置；它们是文档分组，并非 Harbor API 中的独立类型。

* **本地运行时** 在运行 Harbor 的机器上执行容器。
* **远程沙箱** 通过你所配置的提供商 API 或基础设施运行。

### 沙箱名称与安装 extra {#sandbox-names-and-install-extras}

**本地运行时：** `docker`（默认）、`podman`、`apple-container`、`singularity`

  **远程沙箱：**
  [`ack`](https://www.alibabacloud.com/en/product/kubernetes)（使用 kubeconfig）、
  [`beam`](https://www.beam.cloud/)、
  [`blaxel`](https://blaxel.ai/sandbox)、[`cua-cloud`](https://cua.ai/)
  （`cua` extra）、
  [`cwsandbox`](https://docs.coreweave.com/products/sandboxes)、
  [`daytona`](https://www.daytona.io/)、[`e2b`](https://e2b.dev/)、
  [`ec2`](https://aws.amazon.com/ec2/)、
  [`gke`](https://cloud.google.com/kubernetes-engine)、
  [`hf-sandbox`](https://huggingface.co/docs/huggingface_hub/main/guides/sandbox)、
  [`hyperbrowser`](https://www.hyperbrowser.ai/)、[`islo`](https://islo.dev/)、
  [`langsmith`](https://www.langchain.com/langsmith/sandboxes)、
  [`modal`](https://modal.com/products/sandboxes)、[`novita`](https://novita.ai/)、
  [`opensandbox`](https://www.opensandbox.ai/)、
  [`openshift`](https://www.redhat.com/en/technologies/cloud-computing/openshift)
  （使用 `oc` CLI）、[`runloop`](https://runloop.ai/)、
  [`skypilot`](https://skypilot.ai/)（早期访问）、
  [`tensorlake`](https://www.tensorlake.ai/)、
  [`use-computer`](https://use.computer/)、[`vercel`](https://vercel.com/sandbox)、
  [`runta`](https://runta.com/docs/integrations/harbor/)

## 常用沙箱 CLI 选项 {#common-sandbox-cli-options}

| 标志                                                                                                    | 用途                                                                                                                           | 默认值             |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| `-e`, `--env`                                                                                           | 选择内置沙箱或自定义导入路径。                                                                                                 | `docker`           |
| `--ek`, `--environment-kwarg`                                                                           | 传递提供商特定的构造函数选项。可重复。                                                                                         | 无                 |
| `-n`, `--n-concurrent`                                                                                  | 限制并发试次数量。                                                                                                             | `4`                |
| `--force-build`, `--no-force-build`                                                                     | 重建或复用任务环境。                                                                                                           | `--no-force-build` |
| `--delete`, `--no-delete`                                                                               | 试次结束后删除或保留沙箱。                                                                                                     | `--delete`         |
| `--cpus`, `--memory`                                                                                    | 选择 `auto`、`limit`、`request`、`guarantee` 或 `ignore`。                                                                     | `auto`             |
| `--override-cpus`, `--override-memory-mb`, `--override-storage-mb`, `--override-gpus`, `--override-tpu` | 覆盖本次运行的任务资源。                                                                                                       | 任务配置           |
| `--env-file`                                                                                            | 加载宿主机凭据及其他环境变量。见[环境变量](/docs/core-concepts/jobs/environment-variables)。                                   | 无                 |

提供商的生命周期规则可能覆盖 `--no-delete`。运行 `harbor run --help` 查看全部环境选项；每个提供商还定义了各自的 `--environment-kwarg` 取值。

## 提供商能力 {#provider-capabilities}

能力因沙箱而异，并可能取决于任务模式或提供商设置。

### 任务与硬件能力 {#task-and-hardware-capabilities}

| 能力              | 支持的环境                                                                                                                           |
  | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
  | Docker Compose    | `docker`, `podman`, `daytona`, `modal`, `ec2`, `gke`, `islo`, `langsmith`, `novita`, `blaxel`, `beam`, `hyperbrowser`, `vercel`, `runta` |
  | GPU               | `daytona`, `modal`, `gke`, `beam`, `opensandbox`                                                                                         |
  | TPU               | `gke`                                                                                                                                    |
  | Windows           | `docker`, `daytona`, `cua-cloud`, `use-computer`                                                                                         |
  | 宿主机挂载日志    | `docker`, `podman`, `apple-container`, `singularity`                                                                                     |
  | 通过 SSH 流式传输 | `daytona`, `docker`                                                                                                                      |

  Modal 的 GPU 支持取决于其运行时设置。GKE 仅对单容器任务暴露 GPU 和 TPU。`cua-cloud` 和 `use-computer` 需要其 Windows 平台设置。

### 网络能力 {#network-capabilities}

| 能力                   | 支持的环境                                                                                                                                                                                               |
  | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | 禁用互联网             | `docker`, `podman`, `daytona`, `e2b`, `modal`, `runloop`, `langsmith`, `ec2`, `gke`, `novita`, `islo`, `tensorlake`, `cwsandbox`, `blaxel`, `opensandbox`, `beam`, `skypilot`, `hyperbrowser`, `vercel`, `runta` |
  | 精确主机名             | `docker`, `podman`, `daytona`, `e2b`, `modal`, `runloop`, `langsmith`, `novita`, `islo`, `tensorlake`, `blaxel`, `beam`, `hyperbrowser`, `vercel`, `runta`                                                       |
  | 通配符主机名           | `docker`, `podman`, `daytona`, `e2b`, `modal`, `runloop`, `langsmith`, `novita`, `blaxel`, `hyperbrowser`, `vercel`, `runta`                                                                                     |
  | IPv4 地址              | `docker`, `podman`, `daytona`, `e2b`, `modal`, `novita`, `tensorlake`, `beam`, `hyperbrowser`                                                                                                                    |
  | IPv6 地址              | `docker`, `podman`, `beam`                                                                                                                                                                                       |
  | IPv4 CIDR              | `docker`, `podman`, `daytona`, `modal`, `novita`, `tensorlake`, `beam`, `hyperbrowser`                                                                                                                           |
  | IPv6 CIDR              | `docker`, `podman`, `beam`                                                                                                                                                                                       |
  | 运行时策略变更         | `docker`, `podman`, `daytona`, `e2b`, `modal`, `novita`, `islo`, `beam`, `hyperbrowser`, `vercel`, `runta`                                                                                                       |

  Docker 和 Podman 需要 Harbor 的出站控制支持。Daytona、Modal、Novita、Blaxel 和 Vercel 的允许列表仅适用于单容器。GKE 仅能在 Compose 模式下禁用互联网。Islo 的运行时变更需要其默认网关配置。

### CPU 与内存能力 {#cpu-and-memory-capabilities}

| 能力           | 支持的环境                                                                                                                                                 |
  | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | CPU 上限       | `docker`, `podman`, `apple-container`, `modal`, `gke`, `openshift`, `skypilot`, `cwsandbox`, `opensandbox`, `ec2`, `runta`                                 |
  | CPU 请求       | `daytona`, `e2b`, `modal`, `runloop`, `gke`, `openshift`, `novita`, `islo`, `tensorlake`, `cwsandbox`, `beam`, `skypilot`, `hyperbrowser`, `vercel`, `runta` |
  | 内存上限       | `docker`, `podman`, `apple-container`, `modal`, `gke`, `openshift`, `skypilot`, `cwsandbox`, `opensandbox`, `ec2`, `runta`                                 |
  | 内存请求       | `daytona`, `e2b`, `modal`, `runloop`, `gke`, `openshift`, `novita`, `islo`, `tensorlake`, `cwsandbox`, `blaxel`, `beam`, `skypilot`, `hyperbrowser`, `vercel`, `runta` |

  **上限（limit）** 是硬性封顶。**请求（request）** 用于预留或选择容量。`guarantee` 要求两者同时满足。当提供商声明了资源能力时，Harbor 会在试次开始前拒绝不受支持的策略。

切换提供商时，任务的[环境定义](/docs/core-concepts/tasks/environment)保持不变，但受上述能力约束。
