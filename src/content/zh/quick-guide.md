# 快速手册 {#quick-guide}

> 安装、跑作业、看结果、写任务：日常最高频的四步。

Harbor 把 Agent 评测拆成四件可组合的东西：**任务**、**数据集**、**Agent**、**沙箱**。作业（job）把它们编在一起，并行跑出试次（trial），验证器给出奖励。

## 安装 {#install}

```bash
uv tool install harbor
```

默认沙箱是 Docker。云沙箱（Modal、Daytona 等）见 [预集成沙箱](/docs/core-concepts/sandboxes/pre-integrated-sandboxes)。

完整步骤：[安装](/docs/getting-started/installation)。

## 跑第一次作业 {#first-job}

```bash
OPENAI_API_KEY="<your-key>" \
harbor run -t hello-world/hello-world \
  -a codex -m openai/gpt-5.6-luna
```

- `-t` 任务，`-d` 数据集，`-a` Agent，`-m` 模型，`-e` 沙箱。
- `--launch` 把作业交到 Harbor Hub 上跑。

详见 [运行作业](/docs/core-concepts/jobs/run-a-job)。

## 看结果 {#view}

```bash
harbor view ./jobs
```

本地查看器可以浏览作业、打开试次轨迹、对比奖励。见 [查看作业结果](/docs/core-concepts/results/view-job-results)。

把结果上传到 Hub：

```bash
harbor upload "./jobs/<job-id>"
```

## 写一个任务 {#write-task}

一个任务目录至少有：

```bash
my-task/
├── instruction.md
├── task.toml
├── environment/
│   └── Dockerfile
├── solution/
│   └── solve.sh
└── tests/
    └── test.sh
```

`tests/test.sh` 必须把奖励写到 `/logs/verifier/reward.txt` 或 `reward.json`。逐步教程：[创建任务](/docs/tutorials/create-a-task)。

## 核心对象 {#objects}

| 对象 | 一句话 | 手册位置 |
| --- | --- | --- |
| 任务 | 指令 + 环境 + 验证脚本 | [/docs/core-concepts/tasks/overview](/docs/core-concepts/tasks/overview) |
| 数据集 | 任务的集合，通常对应一个基准 | [/docs/core-concepts/datasets/datasets](/docs/core-concepts/datasets/datasets) |
| Agent | 完成任务的程序 | [/docs/core-concepts/agents/pre-integrated-agents](/docs/core-concepts/agents/pre-integrated-agents) |
| 沙箱 | 隔离运行环境 | [/docs/core-concepts/sandboxes/pre-integrated-sandboxes](/docs/core-concepts/sandboxes/pre-integrated-sandboxes) |
| 验证器 | 给工作打分 | [/docs/core-concepts/tasks/verifier](/docs/core-concepts/tasks/verifier) |
| 试次 | 一次 Agent × 一个任务 | [核心概念](/docs/core-concepts/index) |
| 作业 | 一组并行试次 | [/docs/core-concepts/jobs/run-a-job](/docs/core-concepts/jobs/run-a-job) |
| 轨迹 | 对话与动作历史（ATIF） | [/docs/core-concepts/agents/atif](/docs/core-concepts/agents/atif) |

## 本站怎么跟着官网走 {#sync}

1. 每日拉取 [llms.txt](https://docs.harborframework.com/llms.txt) 与各页 `.md`。
2. 指纹一变，[对照表](/docs/sitemap) 把该行标成待更新，并指出中文站路径。
3. [同步日志](/docs/updates) 单独记一笔：新增 / 更新 / 删除了哪一页、中文站在哪。

风格：顶栏 **明 / 暗 / 彩**，选择保存在本机。
