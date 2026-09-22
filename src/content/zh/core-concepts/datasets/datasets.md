# 数据集 {#datasets}

> 用于评估与训练的任务集合。

[Harbor 任务](/docs/core-concepts/tasks/overview)由指令、沙箱环境和测试脚本组成。数据集是任务的集合。数据集有时会定义自定义指标，用于聚合任务奖励。

使用数据集有三种方式：

1. **本地数据集**：运行本地任务目录或 `dataset.toml` 清单
2. **已发布数据集**：从 [Harbor Hub](https://hub.harborframework.com/) 运行数据集
3. **Git 仓库数据集**：从 Git 仓库运行数据集

## 本地数据集 {#local-datasets}

使用 `--path` 或 `-p` 运行本地数据集：

```bash
harbor run -p "<path/to/dataset>" -a "<agent>" -m "<model>"
```

路径可以是任务目录，也可以是 `dataset.toml` 清单文件。

## 已发布数据集 {#published-datasets}

数据集可以发布到 [Harbor Hub](https://hub.harborframework.com/)，在组织内共享或公开。

使用 `--dataset` 或 `-d` 运行已发布数据集：

```bash
harbor run -d "<org/name@version>" -a "<agent>" -m "<model>"
```

了解如何创建并发布数据集，请参阅[发布数据集](/docs/core-concepts/datasets/create-a-dataset#publish-a-dataset)。

## Git 仓库数据集 {#git-repository-datasets}

使用 `--repo` 直接从任意 Git 仓库运行数据集：

```bash
harbor run --repo org/repo-name -p "./tasks" -a "<agent>" -m "<model>"
```

支持 GitHub、GitLab 和 Hugging Face URL，并可选用引用固定（`@v1.0`、`@main`）。

完整指南请参阅 [Git 仓库](/docs/core-concepts/datasets/git-repos)。
