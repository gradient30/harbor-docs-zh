# 自定义验证器 {#custom-verifiers}

> 自定义作业验证过程。

在试次中，Agent 运行之后，`Verifier` 对象会将 `tests/` 目录上传到沙箱，并执行 `/tests/test.sh`。

`Verifier` 对象是 `BaseVerifier` 的默认实现。如果用户希望以不同方式编排验证，或在主机上运行部分验证器逻辑，可以实现自定义 `BaseVerifier`。

|                | 使用默认 `Verifier` 的 `tests/`                                                            | 自定义 `BaseVerifier`                                                                            |
| -------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 逻辑          | 任务文件，通常是 `tests/test.sh`                                                    | 可导入的 Python 类                                                                       |
| 执行      | 在验证器沙箱内                                                              | `verify()` 在 Harbor 进程中运行，可通过 `self.environment` 调用沙箱操作 |
| Harbor 负责 | 上传测试、运行脚本、下载验证器日志，以及解析奖励文件 | 构造验证器并调用 `verify()`                                                 |
| 奖励输出  | `/logs/verifier/reward.txt` 或 `/logs/verifier/reward.json`                              | 返回的 `VerifierResult`                                                                      |
| 配置  | 包含在任务中                                                                   | 作业配置中的 `verifier.import_path` 以及可选的 `verifier.kwargs`                          |
| 最适用于       | 可移植的、任务特定的验证                                                     | 自定义编排或主机侧检查                                                         |

> **说明** 自定义验证器会替换默认工作流。它必须自行执行所需的上传、命令和奖励计算。

例如，此验证器检查 Agent 是否在沙箱中创建了所需文件：

```python
from typing import Any

from harbor.models.verifier.result import VerifierResult
from harbor.verifier.base import BaseVerifier

class OutputVerifier(BaseVerifier):
    def __init__(
        self, *, required_path: str = "/app/output.json", **kwargs: Any
    ) -> None:
        super().__init__(**kwargs)
        self.required_path = required_path

    async def verify(self) -> VerifierResult:
        exists = await self.environment.is_file(self.required_path)
        return VerifierResult(rewards={"reward": int(exists)})
```

该文件必须能被 Harbor 进程导入。用 `verifier.import_path` 选择该类；`verifier.kwargs` 中的值会传给其构造函数。

**CLI**

```bash
    harbor run -p "<path/to/dataset>" -a "<agent>" -m "<model>" \
      --verifier custom_verifier:OutputVerifier \
      --verifier-kwarg required_path=/app/output.json
    ```

**配置**

```yaml
    verifier:
      import_path: custom_verifier:OutputVerifier
      kwargs:
        required_path: /app/output.json
    ```

完整验证器配置模式请参阅[配置](/docs/core-concepts/jobs/configs)。
