# 多步骤任务 {#multi-step-tasks}

> Harbor 任务格式的首次重大扩展：任务拆分为顺序步骤，每步有自己的指令和验证器。

[← 全部新闻](/docs/news)

<p className="text-sm text-gray-500 dark:text-gray-400">2026 年 4 月 23 日 · Harbor 团队</p>

我们正在发布 Harbor 任务格式的首次重大扩展：多步骤任务。

多步骤任务让 Agent 在单个共享环境中按顺序执行一组有序步骤。每一步都有自己的指令和验证器。

多步骤任务适用于实现带提前停止条件的长时程任务、测试记忆等持续学习方法，以及观察 Agent 在先前工作基础上继续推进的能力。

```text
task.toml
environment/
  Dockerfile
steps/
  step-one/
    instruction.md
    workdir/
      setup.sh
      ...
    tests/
      test.sh
    solution/
      solve.sh
  step-two/
    instruction.md
    ...
tests/
  test.sh
```

安装 Harbor 0.5.0 或更高版本即可使用多步骤任务：

```bash
uv tool install "harbor>=0.5.0"
```

```bash
pip install "harbor>=0.5.0"
```

更多信息见[多步骤任务文档](/docs/core-concepts/tasks/multi-step)；也可以下载我们的 `create-task` skill，让编码 Agent 引导你创建多步骤任务：

```bash
npx skills add harbor-framework/harbor --skill create-task
```

我们期待看到 Harbor 用户构建的多步骤任务！
