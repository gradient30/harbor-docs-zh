# 共享 {#sharing}

> 共享任务、数据集和作业。

Harbor Hub 允许你与其他用户共享任务、数据集和作业。

## 共享任务和数据集 {#sharing-tasks-and-datasets}

任务和数据集可以公开或私有共享。

使用 `--public` 或 `--private` 在发布新任务或数据集时设置可见性：

```bash
harbor publish "<task-path>" --public
harbor publish "<dataset-path>" --public
harbor publish "<task-or-dataset-path>" --private
```

新包默认为私有。这些标志仅对新包设置可见性；为已有包发布另一个版本会保留其可见性。使用下方的 `visibility` 命令进行更改。

要将已发布的任务或数据集私有地共享给某个组织，使用：

```bash
harbor task share "<owner-org>/<task-name>" --org "<recipient-org>"
harbor dataset share "<owner-org>/<dataset-name>" --org "<recipient-org>"
```

要将已发布的任务或数据集设为公开，使用：

```bash
harbor task visibility "<org>/<task-name>" --public
harbor dataset visibility "<org>/<dataset-name>" --public
```

> **注意** 共享数据集会使所有任务变为公开，包括先前和未来版本中引用的任务。

## 共享作业 {#sharing-jobs}

可以在上传时或上传后共享作业。

```bash
harbor run ... --upload --share "<org>"
harbor upload "<job-path>" --share "<org>"
harbor job share "<job-id>" --org "<org>"
```

共享作业会自动将该作业的全部试次和轨迹共享给被共享方。

要将作业设为公开，使用：

```bash
harbor run ... --upload --public
harbor upload "<job-path>" --public
```

对于已经上传的作业，`harbor upload "<job-path>" --public` 会使用本地作业目录更新其可见性。使用 `--private` 可重新设为私有。

## 查看共享状态 {#inspecting-share-status}

可以使用以下命令查看任务和数据集的访问权限以及作业的共享情况：

```bash
harbor task access "<org>/<task-name>"
harbor dataset access "<org>/<dataset-name>"
harbor hub job shares "<job-id>"
```
