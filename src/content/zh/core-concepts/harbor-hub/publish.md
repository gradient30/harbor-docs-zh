# 发布 {#publish}

> 将数据集和任务发布到 Hub。

Harbor Hub 支持发布和共享数据集与任务。可以把 Harbor Hub 理解为面向强化学习环境的 HuggingFace 或 PyPI。

## 发布 {#publishing}

要将任务或数据集发布到 Harbor Hub，运行：

```bash
harbor publish "<path/to/task>" # or path/to/dataset
```

也可以使用 `--tag` 标志为上传内容打标签。

如果发布的是数据集，同一文件夹中被引用的任务会自动一并发布。路径可以是 `dataset.toml` 文件，也可以是包含该文件的目录。

## 可见性 {#visibility}

默认情况下，已发布的任务和数据集为私有。可以使用 `--public` 标志将其设为公开。

```bash
harbor publish "<path/to/task>" --public # or dataset
```

将数据集设为公开会级联作用于任意数据集版本中包含的全部任务。

关于共享已发布内容的说明，请参见 [共享](/docs/core-concepts/harbor-hub/sharing)。
