# 现有插件 {#existing-plugins}

> 将 Harbor 作业连接到可观测性平台。

作业插件在 Harbor 进程中运行，并对作业和试次事件作出响应。在运行时通过 `--plugin` 传入；插件不会存储在 `config.json` 中。

> **说明** 请在与 Harbor 相同的 Python 环境中安装插件。插件凭据是 [Harbor 进程变量](/docs/core-concepts/jobs/environment-variables)，而非 Agent 环境变量。

## 发现插件 {#discover-plugins}

已安装的包会注册一个简短的插件名称。使用以下命令列出它们：

```bash
harbor plugins list
```

Harbor 提供两个官方插件：`langsmith` 和 `atif2otel`。`harbor plugins list` 显示运行 Harbor 的环境中已安装的插件。源码检出可能已将两者作为可编辑的工作区包包含在内；PyPI 安装必须额外添加所需的插件包。

也可以将完整的 `module:Class` 导入路径传给 `--plugin`。

## LangSmith {#langsmith}

[LangSmith](https://www.langchain.com/langsmith/observability) 插件将 Harbor 任务同步到 LangSmith 数据集，并将每个作业记录为一次实验。

```bash
uv tool install "harbor[langsmith]"
```

```bash
export OPENAI_API_KEY="..."
export LANGSMITH_API_KEY="..."

harbor run \
  -t hello-world/hello-world \
  -a codex -m openai/gpt-5.6-sol \
  --plugin langsmith \
  --pk dataset_name=harbor-evals \
  --pk experiment_name=codex-baseline
```

<Frame caption="LangSmith 中的 Harbor 实验">
  <img src="https://mintcdn.com/harborframework/8T-R9LwwMcmGz1Hx/images/langsmith-experiments.jpeg?fit=max&auto=format&n=8T-R9LwwMcmGz1Hx&q=85&s=ee89234657b7a62a1acd8c07a9a662ce" alt="LangSmith 显示带有奖励、延迟、token 和错误指标的 Harbor 实验" width="3436" height="1676" data-path="images/langsmith-experiments.jpeg" />
</Frame>

### LangSmith 选项 {#langsmith-options}

| 选项              | 环境变量                         |
  | ----------------- | -------------------------------- |
  | `dataset_name`    | `HARBOR_LANGSMITH_DATASET`       |
  | `experiment_name` | `HARBOR_LANGSMITH_EXPERIMENT`    |
  | `experiment_id`   | `HARBOR_LANGSMITH_EXPERIMENT_ID` |
  | `endpoint`        | `LANGSMITH_ENDPOINT`             |
  | `workspace_id`    | `LANGSMITH_WORKSPACE_ID`         |
  | `sync_dataset`    | `HARBOR_LANGSMITH_SYNC_DATASET`  |
  | `fail_fast`       | `HARBOR_LANGSMITH_FAIL_FAST`     |

  也接受 `api_key`，但凭据推荐使用 `LANGSMITH_API_KEY`。

见 [LangSmith 文档](https://docs.langchain.com/langsmith/harbor-integrations) 和 [发布帖](https://x.com/LangChain/status/2071972238128005278)。

## ATIF 到 OpenTelemetry {#atif-to-opentelemetry}

ATIF 到 OpenTelemetry 插件将每个 Agent 的 [ATIF **轨迹**](/docs/core-concepts/agents/atif) 转换为 [OpenTelemetry](https://opentelemetry.io/) span。

它将 `agent/trajectory.json` 转换为模型调用、工具调用和子 Agent 的 span。

```bash
uv tool install --with harbor-atif2otel harbor
```

**写入文件**

在作业结束后导出所有试次：

    ```bash
    export OPENAI_API_KEY="..."

    harbor run \
      -t hello-world/hello-world \
      -a codex -m openai/gpt-5.6-sol \
      --plugin atif2otel \
      --pk output_dir=./otel-traces \
      --pk encoding=json
    ```

**流式传输到 MLflow**

内置上传器会在每个试次结束时将其导出到 MLflow 服务器：

    ```bash
    export OPENAI_API_KEY="..."
    export MLFLOW_TRACKING_TOKEN="..."

    harbor run \
      -t hello-world/hello-world \
      -a codex -m openai/gpt-5.6-sol \
      --plugin atif2otel \
      --pk endpoint=https://mlflow.example.com \
      --pk experiment_name=harbor-evals
    ```

### ATIF 到 OpenTelemetry 选项 {#atif-to-opentelemetry-options}

| 选项              | 环境变量                      | 默认值    |
  | ----------------- | ----------------------------- | --------- |
  | `endpoint`        | `OTEL_EXPORTER_OTLP_ENDPOINT` | —         |
  | `output_dir`      | `HARBOR_OTEL_OUTPUT_DIR`      | —         |
  | `experiment_name` | `MLFLOW_EXPERIMENT_NAME`      | 作业名称  |
  | `token`           | `MLFLOW_TRACKING_TOKEN`       | `""`      |
  | `workspace`       | —                             | `default` |
  | `encoding`        | —                             | `json`    |
  | `mode`            | —                             | `auto`    |

  `mode=auto` 在设置了 `endpoint` 时进行流式传输，在设置了 `output_dir` 时写入文件。两者都设置则可同时启用两种输出。

见[插件源码](https://github.com/harbor-framework/harbor/tree/main/packages/harbor-atif2otel)。

## 使用多个插件 {#use-multiple-plugins}

`--plugin` 和 `--plugin-kwarg` 可重复使用。使用多个插件时，用插件名称作为每个 kwarg 的前缀：

```bash
harbor run ... \
  --plugin langsmith \
  --plugin atif2otel \
  --pk langsmith.experiment_name=codex-baseline \
  --pk atif2otel.output_dir=./otel-traces
```

从作业配置运行时，将插件标志保留在命令行上：

```bash
harbor run --config config.json --plugin langsmith
```

要构建其他集成，见[自定义插件](/docs/core-concepts/plugins/custom-plugins)。
