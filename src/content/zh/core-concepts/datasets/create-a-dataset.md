# 创建数据集 {#create-a-dataset}

> 创建由 Harbor 任务组成的数据集

## 隐式数据集 {#implicit-datasets}

创建数据集最简单的方式，是将一组任务放在同一个目录中。

```bash
my-dataset/
├── task1/
├── task2/
└── task3/
```

然后可以这样运行：

```bash
harbor run -p ./my-dataset -a "<agent>" -m "<model>"
```

## 显式数据集 {#explicit-datasets}

你可能希望定义多个包含重叠任务的数据集。例如，某个任务目录本身构成一个隐式数据集，而你想按类别将其子集化。

在这种情况下，复制粘贴任务既不方便、也低效，还会增加维护成本。

相反，你应该创建 `dataset.toml` 清单，其中包含指向各任务目录的指针。

### 创建 `dataset.toml` 清单 {#create-a-dataset-toml-manifest}

要创建 `dataset.toml` 清单，运行

```bash
harbor dataset init "<org/name>"
```

这会在当前目录生成一份 `dataset.toml` 清单。

> **说明** 通常，`<org>` 是你的公司名称，`<name>` 是数据集名称。

### 添加和移除任务 {#add-and-remove-tasks}

要向数据集添加任务，运行

```bash
harbor dataset add "<task-dir>"
```

要从数据集移除任务，运行

```bash
harbor dataset remove "<task-dir>"
```

你也可以从另一个数据集添加或移除全部任务

```bash
harbor dataset add "<other-dataset.toml>"
harbor dataset remove "<other-dataset.toml>"
```

### 运行 `dataset.toml` {#run-the-dataset-toml}

要运行 `dataset.toml` 清单，执行

```bash
harbor run -p "<path-to-dataset.toml>"
```

## 发布数据集 {#publish-a-dataset}

要通过 Harbor Hub 与团队成员共享数据集，或公开发布，运行

```bash
harbor publish "<org/name>"
```

可以把 Harbor Hub 理解为类似 PyPI 或 NPM，而不是 GitHub。因为任务就是软件，开发通常在版本控制仓库中进行，版本则发布到 Harbor Hub。

数据集发布后，任何有权限的人都可以使用 `harbor run -d <org/name>` 命令运行它。
