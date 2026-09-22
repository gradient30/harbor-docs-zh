# 核心概念 {#core-concepts}

> 理解 Harbor 的核心概念。

Harbor 包含以下核心概念：

## 任务 {#task}

任务定义一条或多条指令、一个沙箱环境以及一个验证器。任务用于评估 Agent 和模型，并以[Harbor 任务格式](/docs/core-concepts/tasks/overview)的目录形式实现。包含多条指令的任务见[多步骤](/docs/core-concepts/tasks/multi-step)。

## 数据集 {#dataset}

[数据集](/docs/core-concepts/datasets/datasets)是任务的集合，用于评估 Agent 和模型。通常，一个数据集对应一个基准测试（例如 Terminal-Bench 或 SWE-Bench Verified）。数据集可以选择通过 [Harbor Hub](https://hub.harborframework.com) 分发。

## Agent {#agent}

Agent 是完成任务的程序。Harbor 包含[预集成 Agent](/docs/core-concepts/agents/pre-integrated-agents)，并支持通过 `BaseAgent` 接口实现的[自定义 Agent](/docs/core-concepts/agents/custom-agents)。

## 沙箱 {#sandbox}

沙箱是运行任务的隔离环境。Harbor 包含[预集成沙箱](/docs/core-concepts/sandboxes/pre-integrated-sandboxes)，例如 [Daytona](https://www.daytona.io/) 和 [Modal](https://modal.com/products/sandboxes)。其他运行时可通过实现 `BaseEnvironment` 集成为[自定义沙箱](/docs/core-concepts/sandboxes/custom-sandboxes)。

## 验证器 {#verifier}

[验证器](/docs/core-concepts/tasks/verifier)评估 Agent 的工作并产生该任务的奖励。

## 试次 {#trial}

试次是某个 Agent 对某项任务的一次完成尝试。

## 作业 {#job}

[作业](/docs/core-concepts/jobs/run-a-job)是用于评估 Agent 和模型的一组试次。作业可以组合数据集、Agent、任务和模型。

在底层，作业会生成试次并并行运行它们。

## 轨迹 {#trajectory}

轨迹是 Agent 与用户在完成任务过程中的对话和动作历史。轨迹是理解与调试 Agent 行为最有用的工具之一。

Harbor 的标准轨迹格式是 [ATIF](/docs/core-concepts/agents/atif)。轨迹也可以[加载到后续的 Agent 会话中](/docs/core-concepts/jobs/loading-trajectories)。
