# 产物收集 {#artifact-collection}

> 保留试次期间产生的文件。

Harbor 在 Agent 阶段之后收集产物，有两个目的：1. 保存文件供本地检查 2. 将 Agent 产生的
文件传输到独立验证器沙箱。

## 自动产物收集 {#automatic-artifact-collection}

> **注意** 即将移除从 `/logs/artifacts/` 的自动收集。新任务请显式
>   配置产物。

写入主沙箱 `/logs/artifacts/` 的文件会**自动**收集。Harbor 不会告诉 Agent 使用此目录；当 Agent 应产出该产物时，请在任务指令中
指定它。

```md
Save the final report to `/logs/artifacts/report.json`.
```

它们保存在 `<trial-dir>/artifacts/logs/artifacts/` 下，并显示在
查看器的[**产物**选项卡](/docs/core-concepts/results/view-job-results#trial-files)中。

## 配置产物收集 {#configure-artifact-collection}

对一次运行使用 `--artifact`，在 `config.json` 中使用 `artifacts`，或在
任务的 `task.toml` 中使用 `artifacts`。

> **说明** 以下两种形式都接受文件或目录。你可以指定多个产物。

### 基础 {#basic}

**CLI**

`--artifact` 可重复指定。

    ```bash
    export OPENAI_API_KEY="..."
    harbor run \
      -t hello-world/hello-world \
      -a codex -m openai/gpt-5.6-sol \
      --artifact /app/hello.txt
    ```

**运行配置**

```json
    {
      "artifacts": ["/app/hello.txt"]
    }
    ```

**任务配置**

```toml
    artifacts = ["/app/hello.txt"]
    ```

`/app/hello.txt` 在主机上保存为 `<trial-dir>/artifacts/app/hello.txt`。

运行级产物会追加到任务级产物。

### 高级选项 {#advanced-options}

使用对象形式可更改保存路径，或从目录中排除文件。
这些选项需要运行配置或任务配置。添加多条记录即可同时收集
文件和目录。

**运行配置**

```json
    {
      "artifacts": [
        {
          "source": "/workspace/output",
          "destination": "output",
          "exclude": ["*.tmp"]
        },
        {
          "source": "/app/report.json",
          "destination": "report.json"
        }
      ]
    }
    ```

**任务配置**

```toml
    artifacts = [
      { source = "/workspace/output", destination = "output", exclude = ["*.tmp"] },
      { source = "/app/report.json", destination = "report.json" },
    ]
    ```

在主机上，它们分别保存为 `<trial-dir>/artifacts/output/` 和
`<trial-dir>/artifacts/report.json`。

| 字段         | 说明                                            |
| ------------- | ------------------------------------------------------ |
| `source`      | 沙箱内的文件或目录。                  |
| `destination` | `<trial-dir>/artifacts/` 下的可选相对路径。 |
| `exclude`     | 收集目录时排除的模式。         |
| `service`     | 要从中收集的 Compose 服务。默认为 `main`。   |

## 独立验证器 {#separate-verifier}

验证器在新沙箱中运行。Harbor 仅从 Agent 沙箱传输
已声明的产物以及自动的 `/logs/artifacts/` 目录。使用
同一 `artifacts` 字段；没有单独的产物配置。

```toml
artifacts = ["/app/report.json"]

[verifier]
environment_mode = "separate"
```

Harbor 从 Agent 沙箱收集 `/app/report.json`，并将其放到
验证器沙箱中的 `/app/report.json`。`destination` 只控制产物在主机上的保存位置。

了解更多关于[独立验证器](/docs/core-concepts/tasks/separate-verifier)的信息。

> **注意** 独立验证器不会继承运行时挂载或 `extra_docker_compose`
>   覆盖层。请在验证器镜像中安装评分依赖，并将
>   Agent 输出作为产物传输。

## 收集清单 {#collection-manifest}

Harbor 将 `<trial-dir>/artifacts/manifest.json` 写为收集报告。每条
记录记录产物的来源、主机目标、服务、文件类型和
状态：`ok`、`empty`、`failed` 或 `skipped`。

目录条目还会记录收集期间使用的 `exclude` 模式，
重新评分要求更新后的声明使用相同的模式。

<Frame caption="manifest.json">
  <img src="https://mintcdn.com/harborframework/EOiRHkwCtHMj3USM/images/artifact-viewer-manifest.png?fit=max&auto=format&n=EOiRHkwCtHMj3USM&q=85&s=7a33740e66c21035004dfef2a58bdfef" alt="Harbor 查看器显示 manifest.json，包含产物来源、目标、类型和状态" width="3840" height="2020" data-path="images/artifact-viewer-manifest.png" />
</Frame>

> **说明** 收集失败会记录在清单中，但不会使试次失败。

如果两条记录会写入重叠的主机路径，Harbor 会保留第一条，并将
另一条记录为 `skipped`，而不是覆盖它。

## 边车产物 {#sidecar-artifacts}

对于[多容器任务](/docs/core-concepts/tasks/multi-container)，将 `service`
设为 Compose 服务。`verifier.collect` 钩子可以先将运行时状态写入
文件以便收集。

```toml
artifacts = [
  { source = "/var/log/api/orders.log", service = "api" },
  { source = "/tmp/stats.json", service = "api" },
]

[[verifier.collect]]
service = "api"
command = "curl -s http://localhost:8000/stats > /tmp/stats.json"
timeout_sec = 30
```

边车产物和收集钩子需要支持 Compose 的沙箱。请参阅
[工作示例](https://github.com/harbor-framework/harbor/tree/main/examples/tasks/sidecar-artifacts)
和[提供方能力](/docs/core-concepts/sandboxes/pre-integrated-sandboxes#provider-capabilities)。

## 多步骤任务 {#multi-step-tasks}

对于[多步骤任务](/docs/core-concepts/tasks/multi-step)，步骤级产物会
追加到任务级和运行级产物。Harbor 在每个
步骤的验证器之前收集它们，并存储在 `steps/<step-name>/artifacts/` 下。

## 查看产物 {#view-artifacts}

在结果查看器中打开试次的[**产物**选项卡](/docs/core-concepts/results/view-job-results#trial-files)。

<Frame caption="查看器中已收集的产物">
  <img src="https://mintcdn.com/harborframework/EOiRHkwCtHMj3USM/images/artifact-viewer-file.png?fit=max&auto=format&n=EOiRHkwCtHMj3USM&q=85&s=aa546d9e3eff1d1e9d9e2e44563cc594" alt="Harbor 结果查看器显示已收集的 hello.txt 产物" width="3840" height="2020" data-path="images/artifact-viewer-file.png" />
</Frame>
