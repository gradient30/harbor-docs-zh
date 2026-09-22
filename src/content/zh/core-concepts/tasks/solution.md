# 题解 {#solution}

> 任务题解。

**`solution/`** 文件夹是**可选的**。它存放供 Oracle Agent 使用的参考脚本，用于确认任务可解。在调试任务或沙箱集成时，题解往往很有帮助。

## 必需脚本 {#required-script}

| 操作系统 | 文件                 |
| -------- | -------------------- |
| Linux    | `solution/solve.sh`  |
| Windows  | `solution/solve.bat` |

Harbor 根据 [task.toml](/docs/core-concepts/tasks/configuration) 中的 `[environment].os` 选择扩展名。

允许包含其他文件（脚本、数据）。运行时 Harbor 会将该文件夹复制到 `/solution`，并从任务工作目录执行求解脚本。

## 何时包含题解 {#when-to-include-a-solution}

* **建议**在编写任务时包含 — 使用 Oracle Agent 运行 `harbor run`，以验证任务可解。
* **可选**用于已发布的基准测试 — 若不希望公开参考实现，可以省略。

没有 `solution/` 时，Oracle Agent 无法运行。

## 配置 {#configuration}

```toml
[solution]
env = { API_KEY = "sk-test-123" }
```

这些变量会在 Oracle 执行 `solve.sh` 时生效。
