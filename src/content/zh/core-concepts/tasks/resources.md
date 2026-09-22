# 资源 {#resources}

> 管理环境资源。

任务在 `task.toml` 中声明资源。Harbor 通过**强制策略**应用 CPU 和内存；存储、GPU 和 TPU 请求会在提供方支持时透传。

## 任务字段 {#task-fields}

```toml
[environment]
cpus = 2
memory_mb = 4096
storage_mb = 10240
gpus = 1
gpu_types = ["H100", "A100"]

[environment.tpu]   # optional; GKE only
type = "v6e"
topology = "2x4"
```

| 字段           | 说明                                                                              |
| -------------- | --------------------------------------------------------------------------------- |
| `cpus`         | CPU 数量                                                                          |
| `memory_mb`    | 内存，单位 MB                                                                     |
| `storage_mb`   | 临时磁盘，单位 MB                                                                 |
| `gpus`         | GPU 数量                                                                          |
| `gpu_types`    | 可接受的 GPU 类型（可选）                                                         |
| `tpu.type`     | TPU 加速器类型 — 别名（`v6e`、`trillium`、`v4`）或 GKE 标签（`tpu-v6e-slice`）    |
| `tpu.topology` | TPU 拓扑，格式为 `NxM` 或 `NxMxK`（必填；芯片数 = 各维度之积）                    |

所有字段均为可选。省略的字段使用提供方的默认规格。

[独立验证器沙箱](/docs/core-concepts/tasks/separate-verifier) 可以在 `[verifier.environment]` 下设置各自的值。

## 强制策略 {#enforcement-policies}

CPU 和内存各自拥有独立策略。通过 `--cpus` / `--memory` 设置，或在作业或试次配置中设置 `cpu_enforcement_policy` / `memory_enforcement_policy`。

| 策略        | 含义                               | 是否需要 `cpus` / `memory_mb`？ |
| ----------- | ---------------------------------- | ------------------------------- |
| `auto`      | 使用提供方的默认模式               | 否                              |
| `limit`     | 仅硬上限                           | 是                              |
| `request`   | 仅预留，无上限                     | 是                              |
| `guarantee` | 同时预留并设置硬上限               | 是                              |
| `ignore`    | 不将该值传给提供方                 | 否                              |

**CLI**

```bash
    harbor run -p "<path/to/dataset>" -m "<model>" -a "<agent>" \
      -e docker --cpus limit --memory guarantee
    ```

**配置**

```yaml
    environment:
      type: docker
      cpu_enforcement_policy: limit
      memory_enforcement_policy: auto
    ```

你可以在运行时覆盖资源值：

**CLI**

```bash
    harbor run -p "<path/to/dataset>" -m "<model>" -a "<agent>" \
      --override-cpus 4 \
      --override-memory-mb 8192 \
      --override-storage-mb 20480 \
      --override-tpu v6e=2x4
    ```

**配置**

```yaml
    environment:
      override_cpus: 4
      override_memory_mb: 8192
      override_storage_mb: 20480
      override_tpu:
        type: v6e
        topology: 2x4
    ```

## 提供方支持 {#provider-support}

Harbor 在作业开始时校验策略。不支持的组合会在试次运行前失败。`limit` 和 `guarantee` 需要提供方支持上限；`request` 和 `guarantee` 需要提供方支持预留。

存储、GPU 和 TPU 没有强制策略。Harbor 会将声明的值传给支持它们的提供方。

| 能力                  | 环境                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| CPU 和内存上限        | `apple-container`, `cwsandbox`, `docker`, `ec2`, `gke`, `modal`, `opensandbox`, `openshift`, `podman`, `skypilot`, `runta`                                         |
| CPU 预留              | `beam`, `cwsandbox`, `daytona`, `e2b`, `gke`, `hyperbrowser`, `islo`, `modal`, `novita`, `openshift`, `runloop`, `skypilot`, `tensorlake`, `vercel`, `runta`       |
| 内存预留              | `beam`, `blaxel`, `cwsandbox`, `daytona`, `e2b`, `gke`, `hyperbrowser`, `islo`, `modal`, `novita`, `openshift`, `runloop`, `skypilot`, `tensorlake`, `vercel`, `runta` |
| 存储规格              | `ack`, `daytona`, `gke`, `hyperbrowser`, `islo`, `langsmith`, `runloop`, `tensorlake`, `use-computer`                                                              |
| GPU 分配              | `beam`, `daytona`, `gke`, `modal`, `opensandbox`                                                                                                                   |
| TPU 分配              | `gke`                                                                                                                                                              |

## 校验 {#validation}

| 检查项                                           | 时机         |
| ------------------------------------------------ | ------------ |
| 策略与提供方是否匹配                             | 作业创建时   |
| 非 `auto`/`ignore` 策略缺少对应值                | 环境启动时   |
| GPU / TPU / 互联网要求                           | 环境启动时   |
| 同时设置了 GPU 和 TPU（GKE）                     | 环境启动时   |
