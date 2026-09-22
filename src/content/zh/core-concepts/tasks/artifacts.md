# 产物 {#artifacts}

> 声明要保留并传给验证器的任务输出。

产物是 Agent 运行后从沙箱中收集的文件或目录。在 `task.toml` 中声明它们，以便保留输出供检查，并传输给[独立验证器](/docs/core-concepts/tasks/separate-verifier)。

## 配置 {#configuration}

在 `task.toml` 的顶层、任何段标题之前设置 `artifacts`：

```toml
artifacts = ["/app/report.json", "/app/output"]
```

Harbor 会将它们保存到 `<trial-dir>/artifacts/app/`。可在结果查看器的 [产物选项卡](/docs/core-concepts/results/view-job-results#trial-files) 中查看。

### 高级选项 {#advanced-options}

使用对象来自定义收集方式。字符串与对象可以混用：

```toml
artifacts = [
  "/app/report.json",
  { source = "/app/output", destination = "output", exclude = ["*.tmp"] },
]
```

| 字段          | 说明                                                                                 |
| ------------- | ------------------------------------------------------------------------------------ |
| `source`      | 沙箱内的文件或目录。必填。                                                           |
| `destination` | `<trial-dir>/artifacts/` 下的相对路径。默认是去掉根后的源路径。                      |
| `exclude`     | 收集目录时要排除的模式。                                                             |
| `service`     | 要从中收集的 Compose 服务。默认为 `main`。                                           |

关于边车输出和收集前命令，参见 [边车产物](/docs/core-concepts/jobs/artifact-collection#sidecar-artifacts)。

## 独立验证器 {#separate-verifiers}

[独立验证器](/docs/core-concepts/tasks/separate-verifier) 在全新沙箱中启动，不会包含 Agent 对文件系统的更改。将其需要的每个由 Agent 产生的文件都声明为产物。Harbor 会在 Agent 运行后收集这些文件，并在评分前复制到验证器中。

```toml
artifacts = ["/app/report.json"]

[verifier]
environment_mode = "separate"
```

验证器可以在 `/app/report.json` 读取该报告。产物路径会被保留；`destination` 只改变宿主机上的保存路径。无需单独的传输配置。

未声明的输出不会被传输，当前自动收集的 `/logs/artifacts/` 目录除外。专用验证器镜像会打包评分代码；在复用 Agent 环境时，Harbor 会上传 `tests/`。参见 [镜像选择](/docs/core-concepts/tasks/separate-verifier#image-selection)。

## 多步骤任务 {#multi-step-tasks}

在 `[[steps]]` 下添加步骤专属输出：

```toml
[[steps]]
name = "report"
artifacts = ["/app/report.json"]
```

它们会与任务级和运行级产物一并加入，在该步骤的验证器之前收集，并保存到 `steps/<step-name>/artifacts/`。参见 [多步骤](/docs/core-concepts/tasks/multi-step)。

> **注意** 即将移除从 `/logs/artifacts/` 的自动收集。新任务请显式声明产物。

关于 CLI/运行级追加项和收集报告，参见 [产物收集](/docs/core-concepts/jobs/artifact-collection)。
