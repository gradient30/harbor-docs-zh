# 在独立沙箱中验证 Harbor 任务 {#verify-harbor-tasks-in-a-separate-sandbox}

> 在与 Agent 分离的沙箱中运行任务验证，并在两个环境之间显式交接产物。

[← 全部新闻](/docs/news)

<p className="text-sm text-gray-500 dark:text-gray-400">2026 年 5 月 15 日 · Harbor 团队</p>

从今天起，你可以在与 Agent 所用沙箱分离的沙箱中验证 Harbor 任务。

在 `task.toml` 中，可以指定要在 Agent 沙箱与验证器沙箱之间复制的产物。

在独立沙箱中验证：

* 可使用与 Agent 沙箱不同的资源配置或依赖
* 允许用户将依赖预烘焙到验证器镜像中，避免不稳定的软件包安装
* 在 Agent 与验证过程之间提供额外的安全边界

它也带来一些约束：

* 验证仅限于已复制的产物，而非完整容器状态（例如正在运行的进程）
* 任务必须将验证器所需的一切显式写入产物路径

独立验证同时适用于单步骤和多步骤任务。多步骤任务可以为每一步选择独立的验证器沙箱。

要开始使用此功能，请更新 `create-task` skill：

```bash
npx skills add harbor-framework/harbor --skill create-task
```

或者在 `task.toml` 中添加以下部分：

```toml
artifacts = ["/tmp/answer.json"]

[verifier]
environment_mode = "separate"
```

你也可以配置验证器沙箱：

```toml
artifacts = ["/tmp/answer.json"]

[verifier]
environment_mode = "separate"

[verifier.environment]
network_mode = "no-network"  # baseline; [verifier].network_mode is an optional phase override
cpus = 2
memory_mb = 4096
```

逐步验证器配置使用 `[steps.verifier]` 和 `[steps.verifier.environment]`，规则相同。

选择加入后，`tests/` 目录会被视为环境目录，类似于 `environment/`。

一如既往，我们期待看到你的构建成果，也欢迎反馈！
