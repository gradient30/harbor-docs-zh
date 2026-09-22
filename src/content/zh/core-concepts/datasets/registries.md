# 注册表 {#registries}

> 创建自定义数据集注册表。

Harbor 支持通过 `--registry-url` 或 `--registry-path` 从自定义注册表运行和下载数据集。

> **说明** 本文说明任何人如何创建自定义注册表。默认情况下，Harbor 使用 Harbor Hub 作为注册表。

## 模式 {#schema}

`registry.json` 是一个 JSON 数组。每条记录定义数据集的一个版本，必须包含 `name`、`version`、`description` 和 `tasks`。`metrics` 字段可选。

```json
[
  {
    "name": "<dataset>",
    "version": "<version>",
    "description": "<description>",
    "tasks": [
      {
        "name": "<task>",
        "git_url": "https://github.com/<org>/<repo>.git",
        "git_commit_id": "<commit-sha>",
        "path": "<path/to/task>"
      }
    ],
    "metrics": [
      {
        "type": "mean",
        "kwargs": {}
      }
    ]
  }
]
```

### 数据集字段 {#dataset-fields}

- `name` (`string`) — 与 `--dataset` 一起使用的数据集名称。

- `version` (`string`) — 数据集版本。要发布同一数据集的另一个版本，请再定义一条顶层记录。

- `description` (`string`) — 数据集的人类可读描述。

- `tasks` (`list[Task]`) — 数据集中包含的任务。

- `metrics` (`list[Metric]`) 默认 `[]` — 可选的奖励聚合。请参阅[指标](/docs/core-concepts/datasets/metrics)。

### 任务字段 {#task-fields}

每个任务必须包含 `name` 和 `path`。Git 字段可选。

- `tasks[].name` (`string`) — 任务名称。

- `tasks[].git_url` (`string | null`) 默认 `null` — 包含该任务的 Git 仓库。在不使用 `--repo` 时，省略此字段会使 `path` 成为本地路径。

- `tasks[].git_commit_id` (`string | null`) 默认 `null` — 包含该任务的提交。若省略，Harbor 会解析仓库的默认分支。

- `tasks[].path` (`string`) — 任务目录路径。设置了 `git_url` 时，相对于 Git 仓库根目录。

### 指标字段 {#metric-fields}

- `metrics[].type` — 用于聚合任务奖励的指标实现。

- `metrics[].kwargs` (`object`) — 传递给指标实现的关键字参数。

> **说明** 使用 [`--repo`](/docs/core-concepts/datasets/git-repos) 加载注册表时，Harbor 会用所选仓库和已解析提交填补省略的 `git_url` 与 `git_commit_id`。

> **提示** 使用唯一的数据集名称与版本对，并将远程任务固定到完整提交 SHA，以保证可复现运行。
