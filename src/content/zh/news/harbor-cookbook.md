# 探索 Harbor cookbook {#explore-the-harbor-cookbook}

> 推出 Harbor cookbook：用于构建 Harbor 任务和优化循环的配方。

[← 全部新闻](/docs/news)

<p className="text-sm text-gray-500 dark:text-gray-400">2026 年 3 月 27 日 · Harbor 团队</p>

如果你曾经构建过 Harbor 任务，大概也花过时间解决所有人都会遇到的问题：多容器配置、模拟用户、添加 MCP 工具、实现 computer use 环境，等等。

我们构建 Harbor，就是为了让 Agent 评估变得简单。因此我们发布了 [Harbor Cookbook](https://github.com/harbor-framework/harbor-cookbook)。它收录了一批真实、可直接运行的示例，展示如何用 Harbor 构建评估并优化 Agent。

**内容概览**

建议把最接近你当前目标的配方交给编码 Agent 作为上下文，再据此改编。

| 配方                                                                                                                               | 作用                                                                         |
| :--------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| [simple-task](https://github.com/harbor-framework/harbor-cookbook/tree/main/harbor_cookbook/recipes/simple-task)                   | 最简的单容器任务                                                             |
| [multi-container](https://github.com/harbor-framework/harbor-cookbook/tree/main/harbor_cookbook/recipes/multi-container)           | Docker Compose 任务，Agent 与本地托管的 REST API 交互                        |
| [mcp-tools](https://github.com/harbor-framework/harbor-cookbook/tree/main/harbor_cookbook/recipes/mcp-tools)                       | 通过本地托管的 FastMCP 服务器向 Agent 提供自定义工具                         |
| [skills](https://github.com/harbor-framework/harbor-cookbook/tree/main/harbor_cookbook/recipes/skills)                             | 在 Harbor 任务中纳入 Skills 的配方                                           |
| [multi-reward](https://github.com/harbor-framework/harbor-cookbook/tree/main/harbor_cookbook/recipes/multi-reward)                 | 多个独立验证器，各自产生分数                                                 |
| [simulated-user](https://github.com/harbor-framework/harbor-cookbook/tree/main/harbor_cookbook/recipes/simulated-user)             | Agent 通过与模拟用户对话发现需求                                             |
| [computer-use-ubuntu](https://github.com/harbor-framework/harbor-cookbook/tree/main/harbor_cookbook/recipes/computer-use-ubuntu)   | 基于 Ubuntu 虚拟桌面的 computer use 参考实现                                 |
| [computer-use-windows](https://github.com/harbor-framework/harbor-cookbook/tree/main/harbor_cookbook/recipes/computer-use-windows) | 基于远程 Windows 桌面（Daytona）的 computer use 参考实现                     |
| [dns-blacklisting](https://github.com/harbor-framework/harbor-cookbook/tree/main/harbor_cookbook/recipes/dns-blacklisting)         | 网络层主机名黑名单，支持精确、通配符和正则规则                               |

**超越评估：优化 Agent**

Harbor 任务会产生奖励，因此你用于评估的同一批数据集也可以作为训练环境。cookbook 包含两个演示配方：一个将 Harbor 与 [GEPA](https://github.com/harbor-framework/harbor-cookbook/tree/main/harbor_cookbook/gepa) 配对，在 MedAgentBench 上优化 Agent harness；另一个是 [Thinking Machines](https://github.com/harbor-framework/harbor-cookbook/tree/main/harbor_cookbook/tinker_rl) 贡献的 Harbor 集成，通过 Tinker SDK 将 Harbor 任务用作强化学习环境。

欢迎反馈接下来应构建哪些示例，以及如何改进 Harbor。我们正在积极开发 Harbor 框架，以提升其融入优化循环的能力。

**开始使用**

克隆 cookbook，然后运行：

```bash
uv tool install harbor
```

```bash
pip install harbor
```

```bash
harbor run -p harbor_cookbook/recipes/simple-task -a "<agent>" -m "<model>"
```

我们欢迎社区贡献，并将持续添加有趣的 Harbor 用例示例。我们的目标是让这里成为所有 Harbor 相关工作的起点。

[GitHub →](https://github.com/harbor-framework/harbor-cookbook)
