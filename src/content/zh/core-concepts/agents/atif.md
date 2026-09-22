# ATIF {#atif}

> 以标准 JSON 格式记录并交换 Agent 轨迹。

**Agent Trajectory Interchange Format（ATIF）** 将 Agent 的完整交互历史记录为 JSON：消息、推理、工具调用、观察结果和指标。

## 为何需要 ATIF {#why}

Agent 会生成[不同的原生日志](/docs/core-concepts/jobs/loading-trajectories#native-trajectories)。如果没有统一格式，每个查看器、数据集和训练流水线都需要针对特定 Agent 编写解析器。ATIF 在各 Agent 之间提供了一种稳定的表示，使轨迹更易于检查、比较、校验、加载和复用。

完整规范见 [ATIF RFC](https://github.com/harbor-framework/harbor/blob/main/rfcs/0001-trajectory-format.md)。

## Harbor 中的 `trajectory.json` {#trajectory-json-in-harbor}

> **信息** 在 Harbor 中，ATIF 轨迹通常命名为 **`trajectory.json`**。

具有 `capabilities.atif = true` 的 Agent 会将其写入 Agent 日志目录。在已下载的试次结果中，路径为 `agent/trajectory.json`。

Harbor 使用该文件来：

* **渲染轨迹：** [结果查看器](/docs/core-concepts/results/view-job-results#start-the-viewer) 读取 `agent/trajectory.json`，并在 **Trajectory** 选项卡中显示其步骤。
* **加载轨迹：** 受支持的 Agent 可以使用 [ATIF 轨迹](/docs/core-concepts/jobs/loading-trajectories#atif-trajectories) 来初始化新会话。

> **说明** 生成 ATIF 与加载 ATIF 是两项独立的能力。Agent 可以写入 `trajectory.json` 而不支持[加载轨迹](/docs/core-concepts/jobs/loading-trajectories)。

自定义 Agent 仅应在写入有效的 `self.logs_dir / "trajectory.json"` 时声明 `AgentCapabilities(atif=True)`。

## 结构 {#structure}

Harbor 当前的格式为 `ATIF-v1.7`。一条轨迹包含：

| 字段                    | 用途                                                       |
| ----------------------- | ---------------------------------------------------------- |
| `agent`                 | Agent 名称、版本、模型以及可选的工具定义。                 |
| `steps`                 | 有序的 system、user 和 agent 交互。                        |
| `session_id`            | 可选标识符，同一运行产生的轨迹可共享该标识。               |
| `trajectory_id`         | 可选文档标识符；嵌入子 Agent 时必填。                      |
| `final_metrics`         | 可选的聚合 token、成本和步骤指标。                         |
| `subagent_trajectories` | 可选的嵌入式 ATIF 轨迹。                                   |
| `extra`                 | 自定义根级元数据。                                         |

步骤 ID 从 `1` 开始并保持连续。Agent 步骤可以包含 `tool_calls`、匹配的 `observation` 结果，以及逐步的 `metrics`。

```json
{
  "schema_version": "ATIF-v1.7",
  "session_id": "session-123",
  "agent": {
    "name": "my-agent",
    "version": "1.0.0",
    "model_name": "openai/gpt-5.6-sol"
  },
  "steps": [
    {
      "step_id": 1,
      "source": "user",
      "message": "Create hello.txt."
    },
    {
      "step_id": 2,
      "source": "agent",
      "message": "I'll create it.",
      "tool_calls": [
        {
          "tool_call_id": "call-1",
          "function_name": "write_file",
          "arguments": {"path": "hello.txt", "content": "Hello"}
        }
      ],
      "observation": {
        "results": [
          {"source_call_id": "call-1", "content": "File created"}
        ]
      }
    }
  ]
}
```

### 使用 Harbor 模型构建 {#build-with-harbor-models}

Harbor 在 `harbor.models.trajectories` 中提供 Pydantic 模型：

  ```python
  import json
  from pathlib import Path

  from harbor.models.trajectories import Agent, Step, Trajectory

  trajectory = Trajectory(
      agent=Agent(name="my-agent", version="1.0.0"),
      steps=[
          Step(step_id=1, source="user", message="Create hello.txt."),
          Step(step_id=2, source="agent", message="Done."),
      ],
  )

  Path("trajectory.json").write_text(
      json.dumps(trajectory.to_json_dict(), indent=2) + "\n"
  )
  ```

## 校验轨迹 {#validate-a-trajectory}

```bash
uv run python -m harbor.utils.trajectory_validator path/to/trajectory.json
```

校验会检查模式、连续的步骤 ID、工具调用引用、时间戳以及所引用的本地图像。使用 `--no-validate-images` 可跳过图像文件检查。

### 在 Python 中校验 {#validate-in-python}

```python
  from harbor.utils.trajectory_validator import TrajectoryValidator

  validator = TrajectoryValidator()

  if not validator.validate("trajectory.json"):
      for error in validator.get_errors():
          print(error)
  ```

## 版本与扩展 {#versions-and-extensions}

Harbor 接受 `ATIF-v1.0` 到 `ATIF-v1.7`。1.7 版本新增了嵌入式子 Agent 轨迹、每文档轨迹 ID、`llm_call_count` 以及额外的扩展字段。更早版本见 [RFC 变更日志](https://github.com/harbor-framework/harbor/blob/main/rfcs/0001-trajectory-format.md#version-history)。

> **提示** 使用模式中的 `extra` 字段存放自定义元数据。Harbor 的 Pydantic 模型会拒绝未声明的字段。

## 资源 {#resources}

[ATIF RFC](https://github.com/harbor-framework/harbor/blob/main/rfcs/0001-trajectory-format.md)、[Harbor 轨迹模型](https://github.com/harbor-framework/harbor/tree/main/src/harbor/models/trajectories)、[有效轨迹示例](https://github.com/harbor-framework/harbor/tree/main/tests/golden)、[轨迹校验器](https://github.com/harbor-framework/harbor/blob/main/src/harbor/utils/trajectory_validator.py)
