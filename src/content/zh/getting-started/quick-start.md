# 快速开始 {#quick-start}

> 运行你的第一个作业。

## 安装 Harbor {#install-harbor}

请按照[安装说明](/docs/getting-started/installation)安装 Harbor，包括安装软件包及其依赖。

## 运行作业 {#run-a-job}

在 Harbor 中，试次（trial）是 Agent 对某项任务的一次求解尝试。作业（job）是一组试次的集合。

要运行你的第一个作业，执行：

```bash
OPENAI_API_KEY="<your-key>" \
harbor run -t hello-world/hello-world \
  -a codex -m openai/gpt-5.6-luna
```

默认情况下，Agent 会在 [Docker](https://www.docker.com/) 沙箱中运行。

使用 `--env/-e` 标志可将其配置为在云沙箱中运行，例如 [Modal](https://modal.com/products/sandboxes) 或 [Daytona](https://www.daytona.io/)。

添加 `--launch` 标志可在 Harbor Hub 上运行该作业。

更多信息见[运行作业](/docs/core-concepts/jobs/run-a-job)。

## 查看结果 {#view-the-results}

Harbor 内置本地 Web 查看器，用于检查结果。

```bash
harbor view ./jobs
```

更多信息见[查看作业结果](/docs/core-concepts/results/view-job-results)。

## 分享结果 {#share-results}

你可以将结果上传到 Harbor Hub 并与他人分享。被分享者可以查看作业配置并复现结果。

```bash
harbor upload "./jobs/<job-id>"
```

关于发布结果如何实现完整可审计性，可参考 [Terminal-Bench 网站](https://www.tbench.ai/)上的示例。

## 其他资源 {#other-resources}

  - **[任务概览](/docs/core-concepts/tasks/overview)** — 了解什么是 Harbor 任务。

  - **[创建任务](/docs/tutorials/create-a-task)** — 构建你的第一个 Harbor 任务。
