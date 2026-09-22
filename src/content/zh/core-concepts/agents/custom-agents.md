# 自定义 Agent {#custom-agents}

> 将自己的 Agent 集成到 Harbor 并运行。

自定义 Agent 是在 Harbor 内置注册表之外开发的集成。它们可以是本地进行中的工作，也可以是不打算上游合入的私有集成。自定义 Agent 可以是**安装式**或**外部**的。

| 类型            | 运行方式                                                                                   | 示例                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| 安装式 Agent    | Harbor 在任务环境中安装并运行 Agent CLI。                                                  | [Claude Code](https://github.com/harbor-framework/harbor/blob/main/src/harbor/agents/installed/claude_code.py) |
| 外部 Agent      | Agent 循环在 Harbor 中运行，并通过 `BaseEnvironment` 控制任务环境。                        | [Terminus-2](https://github.com/harbor-framework/harbor/blob/main/src/harbor/agents/terminus_2/terminus_2.py)  |

> **提示** 在本地添加新 Agent 或将其集成到 Harbor 时，**优先**使用 `BaseInstalledAgent`。大多数 Agent 集成都遵循这一设计。**仅当** Agent 循环必须保留在任务环境之外时，才使用 `BaseAgent`。

根据 Agent 的运行位置选择基类。

**安装式 Agent**

当 Harbor 应在任务环境中安装并运行 Agent CLI 时，扩展 `BaseInstalledAgent`。

    ```python
    import shlex

    from harbor.agents.installed.base import (
        BaseInstalledAgent,
        with_prompt_template,
    )
    from harbor.environments.base import BaseEnvironment
    from harbor.models.agent.context import AgentContext

    class MyAgent(BaseInstalledAgent):
        @staticmethod
        def name() -> str:
            return "my-agent"

        async def install(self, environment: BaseEnvironment) -> None:
            await self.exec_as_agent(
                environment,
                command="pip install my-agent",
            )

        @with_prompt_template
        async def run(
            self,
            instruction: str,
            environment: BaseEnvironment,
            context: AgentContext,
        ) -> None:
            await self.exec_as_agent(
                environment,
                command=f"my-agent {shlex.quote(instruction)}",
            )
    ```

    系统包使用 `exec_as_root`，用户级安装与执行使用 `exec_as_agent`。覆盖 `populate_context_post_run`，以便在日志同步后解析用量或轨迹数据。

**外部 Agent**

当 Agent 循环在任务环境之外运行，并通过 `BaseEnvironment` 控制任务环境时，扩展 `BaseAgent`。

    ```python
    from harbor.agents.base import BaseAgent
    from harbor.environments.base import BaseEnvironment
    from harbor.models.agent.context import AgentContext

    class MyAgent(BaseAgent):
        @staticmethod
        def name() -> str:
            return "my-agent"

        def version(self) -> str | None:
            return "1.0.0"

        async def setup(self, environment: BaseEnvironment) -> None:
            pass

        async def run(
            self,
            instruction: str,
            environment: BaseEnvironment,
            context: AgentContext,
        ) -> None:
            # Call your model and act through environment.exec(...).
            pass
    ```

## 运行自定义 Agent {#run-a-custom-agent}

自定义 Agent 未按名称注册，因此需将 `module.path:ClassName` 传给 `--agent`（`-a`）。该模块必须可从 Harbor 进程导入。

```bash
harbor run \
  -t hello-world/hello-world \
  -a examples.agents.marker_agent:MarkerAgent
```

如果 Agent 需要模型，使用 `--model`（`-m`）；其他构造函数选项使用 `--agent-kwarg`（`--ak`）；环境变量使用 `--agent-env`（`--ae`）。

- **[自定义 Agent 示例](https://github.com/harbor-framework/harbor/blob/main/examples/agents/marker_agent.py)** — 在 Harbor 仓库中查看完整的 `BaseAgent` 实现。
