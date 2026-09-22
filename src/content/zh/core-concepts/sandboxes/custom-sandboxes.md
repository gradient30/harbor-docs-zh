# 自定义沙箱 {#custom-sandboxes}

> 将自己的沙箱集成到 Harbor 并运行。

自定义沙箱是在 Harbor [内置注册表](/docs/core-concepts/sandboxes/pre-integrated-sandboxes) 之外开发的提供商集成。它们可以是本地进行中的工作，也可以是不打算上游合入的私有集成。实现 `BaseEnvironment` 即可添加一个。

## 运行自定义沙箱 {#run-a-custom-sandbox}

自定义沙箱未按名称注册，因此需将 `module.path:ClassName` 传给 `--env`（`-e`）。Harbor 在宿主机上导入自定义沙箱。请在与 Harbor 相同的 Python 环境中安装其模块和提供商 SDK。对于 `my_sandbox.py` 中的 `MySandbox` 类，使用 `my_sandbox:MySandbox`。

**CLI**

```bash
    export OPENAI_API_KEY="..."
    harbor run \
      -t hello-world/hello-world \
      -a codex -m openai/gpt-5.6-sol \
      -e my_sandbox:MySandbox
    ```

**Config**

```json
    {
      "environment": {
        "import_path": "my_sandbox:MySandbox"
      },
      "agents": [
        {
          "name": "codex",
          "model_name": "openai/gpt-5.6-sol"
        }
      ],
      "tasks": [
        {
          "name": "hello-world/hello-world"
        }
      ]
    }
    ```

    ```bash
    export OPENAI_API_KEY="..."
    harbor run --config config.json
    ```

**Python**

```python
    import asyncio

    from harbor.job import Job
    from harbor.models.job.config import JobConfig
    from harbor.models.trial.config import (
        AgentConfig,
        EnvironmentConfig,
        TaskConfig,
    )

    async def main():
        job = await Job.create(
            JobConfig(
                environment=EnvironmentConfig(
                    import_path="my_sandbox:MySandbox",
                ),
                agents=[
                    AgentConfig(
                        name="codex",
                        model_name="openai/gpt-5.6-sol",
                    )
                ],
                tasks=[TaskConfig(name="hello-world/hello-world")],
            )
        )
        await job.run()

    asyncio.run(main())
    ```

通过 `--environment-kwarg`（`--ek`）或 `environment.kwargs` 传递构造函数选项：

```bash
harbor run ... -e my_sandbox:MySandbox --ek region=us-west-2
```

## 实现自定义沙箱 {#implement-a-custom-sandbox}

扩展 [`BaseEnvironment`](https://github.com/harbor-framework/harbor/blob/main/src/harbor/environments/base.py)，并实现其生命周期、命令执行和文件传输方法。使用 `_validate_definition()` 拒绝缺少所需文件的任务，例如 [`environment/Dockerfile`](/docs/core-concepts/tasks/environment)。如果不需要任何任务文件，该方法可以为空。

### BaseEnvironment 接口 {#baseenvironment-interface}

```python
  from pathlib import Path

  from harbor.environments.base import BaseEnvironment, ExecResult
  from harbor.environments.capabilities import EnvironmentCapabilities

  class MySandbox(BaseEnvironment):
      @staticmethod
      def type() -> str:
          return "my-sandbox"

      @property
      def capabilities(self) -> EnvironmentCapabilities:
          return EnvironmentCapabilities()

      def _validate_definition(self) -> None:
          # Validate the task's environment/ directory.
          ...

      async def start(self, force_build: bool) -> None:
          # Build or create the sandbox, then prepare prebuilt-image tasks.
          ...
          await self._upload_environment_dir_after_start()

      async def stop(self, delete: bool) -> None:
          ...

      async def exec(
          self,
          command: str,
          cwd: str | None = None,
          env: dict[str, str] | None = None,
          timeout_sec: int | None = None,
          user: str | int | None = None,
      ) -> ExecResult:
          env = self._merge_env(env)
          user = self._resolve_user(user)
          # Execute through the provider and return stdout, stderr, and return code.
          ...

      async def upload_file(self, source_path: Path | str, target_path: str) -> None:
          ...

      async def upload_dir(self, source_dir: Path | str, target_dir: str) -> None:
          ...

      async def download_file(self, source_path: str, target_path: Path | str) -> None:
          ...

      async def download_dir(self, source_dir: str, target_dir: Path | str) -> None:
          ...
  ```

`_merge_env()` 会应用沙箱、Agent 阶段和验证器阶段的变量。`_resolve_user()` 会应用 Harbor 的默认执行用户。每次实现 `exec()` 时都应使用这两者。

只声明提供商实际强制执行的能力。如果启用了 `docker_compose`，还需实现 [Compose 任务](/docs/core-concepts/tasks/multi-container) 所使用的按服务执行和文件传输方法。

> **说明** 添加 `preflight()` 以在试次入队前检查提供商凭据。将提供商凭据保留在 Harbor 进程中；见[环境变量](/docs/core-concepts/jobs/environment-variables)。
