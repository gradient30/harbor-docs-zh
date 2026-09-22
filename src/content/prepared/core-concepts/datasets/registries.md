# Registries {#registries}

> Create custom registries of datasets.

Harbor supports running and downloading datasets from custom registries via `--registry-url` or `--registry-path`.

> **说明** This document describes how anyone can create a custom registry. By default, Harbor uses Harbor Hub as the registry.

## Schema {#schema}

`registry.json` is a JSON array. Each entry defines one version of a dataset and must include `name`, `version`, `description`, and `tasks`. The `metrics` field is optional.

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

### Dataset fields {#dataset-fields}

- `name` (`string`) — Dataset name used with `--dataset`.

- `version` (`string`) — Dataset version. Define another top-level entry to publish another version of the same dataset.

- `description` (`string`) — Human-readable description of the dataset.

- `tasks` (`list[Task]`) — Tasks included in the dataset.

- `metrics` (`list[Metric]`) 默认 `[]` — Optional reward aggregations. See [Metrics](/docs/core-concepts/datasets/metrics).

### Task fields {#task-fields}

Every task must include `name` and `path`. The Git fields are optional.

- `tasks[].name` (`string`) — Task name.

- `tasks[].git_url` (`string | null`) 默认 `null` — Git repository containing the task. Without `--repo`, omitting this field makes `path` a local path.

- `tasks[].git_commit_id` (`string | null`) 默认 `null` — Commit containing the task. If omitted, Harbor resolves the repository's default branch.

- `tasks[].path` (`string`) — Path to the task directory, relative to the Git repository root when `git_url` is set.

### Metric fields {#metric-fields}

- `metrics[].type` — Metric implementation used to aggregate task rewards.

- `metrics[].kwargs` (`object`) — Keyword arguments passed to the metric implementation.

> **说明** When loading the registry with [`--repo`](/docs/core-concepts/datasets/git-repos), Harbor fills omitted `git_url` and `git_commit_id` values from the selected repository and resolved commit.

> **提示** Use unique dataset name and version pairs, and pin remote tasks to full commit SHAs for reproducible runs.
