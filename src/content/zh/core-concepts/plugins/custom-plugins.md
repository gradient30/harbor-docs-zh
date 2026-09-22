# 自定义插件 {#custom-plugins}

> 围绕 Harbor 作业和试次运行自定义逻辑。

Harbor 在内部将插件接口用于 [Harbor Hub](https://hub.harborframework.com)。其[上传插件](https://github.com/harbor-framework/harbor/blob/main/src/harbor/cli/plugins/harbor_hub.py) 会流式传输已完成的试次并完成作业收尾。

自定义插件使用同一接口实现本地或私有集成。它们在 Harbor 进程中运行，对作业和试次事件作出响应，并在运行时传入，而不是存储在 `config.json` 中。

## 生命周期 {#lifecycle}

| 方法                     | 运行时机                                                                  |
| ------------------------ | ------------------------------------------------------------------------- |
| `on_job_start(job)`      | 作业运行之前。在此初始化客户端或注册试次回调。                            |
| `on_job_end(job_result)` | 作业结束后。在此刷新、上传或关闭资源。                                    |

可用的试次回调包括 `on_trial_started`、`on_environment_started`、`on_agent_started`、`on_agent_ended`、`on_verification_started`、`on_trial_ended` 和 `on_trial_cancelled`。

## 实现插件 {#implement-a-plugin}

扩展 [`BaseJobPlugin`](https://github.com/harbor-framework/harbor/blob/main/src/harbor/models/job/plugin.py) 并实现其两个生命周期方法。当插件需要按试次事件时，从 `on_job_start` 注册试次回调。

```python
from harbor.job import Job
from harbor.models.job.plugin import BaseJobPlugin
from harbor.models.job.result import JobResult
from harbor.trial.hooks import TrialHookEvent

class TrialLoggerPlugin(BaseJobPlugin):
    def __init__(self, prefix: str = "trial") -> None:
        self.prefix = prefix

    async def on_job_start(self, job: Job) -> None:
        job.on_trial_ended(self._on_trial_ended)

    async def _on_trial_ended(self, event: TrialHookEvent) -> None:
        print(f"{self.prefix}: {event.trial_name}")

    async def on_job_end(self, job_result: JobResult) -> None:
        print(f"job finished: {len(job_result.trial_results)} trials")
```

> **说明** 插件在沙箱之外运行。请在与 Harbor 相同的 Python 环境中安装插件及其依赖。Harbor 进程变量与沙箱变量的区别见[环境变量](/docs/core-concepts/jobs/environment-variables)。

## 运行自定义插件 {#run-a-custom-plugin}

自定义插件不需要已注册的名称。将 `module.path:ClassName` 传给 `--plugin`。对于 `trial_logger.py` 中的 `TrialLoggerPlugin`，使用 `trial_logger:TrialLoggerPlugin`。

```bash
export OPENAI_API_KEY="..."
harbor run \
  -t hello-world/hello-world \
  -a codex -m openai/gpt-5.6-sol \
  --plugin trial_logger:TrialLoggerPlugin \
  --plugin-kwarg prefix=completed
```

`--plugin-kwarg`（`--pk`）向插件传递构造函数选项。`--plugin` 和 `--pk` 均可重复使用。多插件语法见[使用多个插件](/docs/core-concepts/plugins/existing-plugins#use-multiple-plugins)。

## 示例 {#examples}

更多实现见 Harbor 的[插件包](https://github.com/harbor-framework/harbor/tree/main/packages)。第三方集成指南见 [Braintrust](https://www.braintrust.dev/docs/integrations/sdk-integrations/harbor)。
