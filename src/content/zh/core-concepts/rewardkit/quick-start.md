# 快速开始 {#quick-start}

> 定义并运行能产出奖励分数的验证器。

RewardKit 让你针对 Agent 的工作区和轨迹定义验证器。它会并行运行评判项，并将分数写入 JSON。评判项可以是：

* **程序化：** 检查文件、运行命令或评估输出的 Python 函数
* **基于评判器：** 使用可复用 TOML 文件配置的 LLM 或 Agent 评判器

> **信息** RewardKit 是一个独立的 Python 包。与 Harbor 配合使用时最强大，但单独使用也同样可行。

## 安装 {#installation}

```bash
uv tool install harbor-rewardkit
```

对于需要读取图像或常见文档文件（如 PDF、DOCX、PPTX 和 XLSX）的评判项或评判器，请安装 extras：

```bash
uv tool install harbor-rewardkit[all]
```

## 与 Harbor 配合使用 {#using-with-harbor}

Harbor 会将任务的 `tests/` 目录复制到 `/tests` 并运行 `test.sh`。将评判项文件放在其旁边：

```bash
tests/
├── files.py
├── quality.toml
└── test.sh
```

程序化评判项在 Python 文件中实现，评判器在 `.toml` 文件中指定。RewardKit 会从 tests 目录同时拾取两者。

```bash
#!/bin/bash
uvx --from 'harbor-rewardkit==0.2.*' rewardkit /tests
```

RewardKit 会发现 `/tests` 中的评判项，针对 `/app` 处的工作区运行它们，并将结果写入 `/logs/verifier/reward.json`：

```json
{ "reward": 0.75 }
```

所有默认值都与 Harbor 的约定一致。

- **[可运行示例](https://github.com/harbor-framework/harbor/tree/main/examples/tasks/reward-kit-example)** — 一个使用 RewardKit 的完整任务，可用作起点。

> **信息** 希望编码 Agent 帮助你用 RewardKit 设计验证器？安装 `rewardkit` skill：
>   ```bash
>   npx skills add harbor-framework/harbor --skill rewardkit
>   ```

## 程序化评判项 {#programmatic-criteria}

### 内置评判项 {#built-in-criteria}

RewardKit 包含流行基准中常用的评判项。从 tests 目录中的任意 Python 文件调用它们：

```python
import rewardkit as rk

rk.file_exists("output.txt")
rk.file_contains("output.txt", "hello")
rk.command_succeeds("python main.py")
```

内置评判项有 20 余项，覆盖文件、命令、JSON、CSV、HTTP、图像和 Agent 轨迹。完整列表见[内置评判项](/docs/core-concepts/rewardkit/built-in-criteria)。

### 自定义评判项 {#custom-criteria}

需要任务特定逻辑时，使用 `@criterion` 装饰器定义函数。第一个参数始终是 `workspace: Path`，函数返回 `bool` 或 `float`：

```python
from pathlib import Path

from rewardkit import criterion

@criterion
def has_valid_output(workspace: Path) -> bool:
    output = (workspace / "output.txt").read_text()
    return len(output.splitlines()) >= 10
```

除 `workspace` 外没有其他参数的评判项会自动被调用。带有额外参数的评判项必须通过 `rewardkit` 调用：

```python
from pathlib import Path

import rewardkit as rk
from rewardkit import criterion

@criterion(description="output has at least {n} lines")
def has_n_lines(workspace: Path, n: int) -> bool:
    output = (workspace / "output.txt").read_text()
    return len(output.splitlines()) >= n

rk.has_n_lines(10, weight=2.0)
rk.has_n_lines(50, weight=1.0)
```

## 评判器评判项 {#judge-criteria}

有些方面用 LLM 打分更容易，例如代码质量、边界情况处理或可读性。在 TOML 文件中定义这些评判项：

```toml
[judge]
judge = "anthropic/claude-sonnet-5"
files = ["/app/main.py"]

[[criterion]]
description = "Is the code correct?"
type = "binary"

[[criterion]]
description = "How readable is the code?"
type = "likert"
points = 5
```

Python 评判项和评判器 TOML 可以放在同一目录。Agent 评判器、逐项评估、MCP 服务器以及完整 TOML 参考见[评判器评判项](/docs/core-concepts/rewardkit/judge-criteria)。

评判器需要 API 密钥。在 Harbor 任务中，通过 `task.toml` 中的 `[verifier.env]` 传递：

```toml
[verifier]
timeout_sec = 300.0

[verifier.env]
ANTHROPIC_API_KEY = "${ANTHROPIC_API_KEY}"
```

要在不编辑评分细则的情况下更换评判器提供商，见[提供商路由](/docs/core-concepts/rewardkit/judge-criteria#provider-routing)。

## 分数如何合并 {#how-scores-are-combined}

每个评判项都接受可选的 `weight`；默认值为 `1.0`：

```python
rk.file_exists("output.txt", weight=3.0)
rk.file_exists("readme.md", weight=1.0)
```

每个注册了评判项的 Python 文件会产生一个分数，每个评判器 TOML 也是如此。名称是去掉 `.py` 或 `.toml` 后的文件名：`files.py` 变为 `files`，`quality.toml` 变为 `quality`。仅包含导入或共享评判项定义、未注册任何评判项的文件会被忽略。

当验证器文件直接位于 `tests/` 下时，它们的分数会以相等权重合并为 `reward`。要更改任一层级，在评判项文件旁边添加 `reward.toml`：

```toml
# Require every criterion registered by files.py to pass. {#require-every-criterion-registered-by-files-py-to-pass}
[scoring.files]
aggregation = "all-pass"

# Give files.py twice the weight of quality.toml. {#give-files-py-twice-the-weight-of-quality-toml}
[[reward]]
name = "reward"
aggregation = "weighted-mean"
weights = { files = 2.0, quality = 1.0 }
```

`[scoring.files]` 控制如何合并来自 `files.py` 的评判项。命名的 `[[reward]]` 表控制如何合并该目录中的 `files`、`quality` 及其他分数。没有该表时，RewardKit 会使用加权平均创建 `reward`，其中评判器的份额来自其 `[judge]` 部分中的 `weight`。

可用的聚合模式为 `weighted-mean`、`weighted-sum`、`all-pass`、`any-pass`、`threshold` 和 `required-pass`。`weighted-sum` 计算 `sum(value × weight)` 且不归一化。它是唯一接受负权重的模式，其结果可能落在 `[0, 1]` 之外。使用阈值聚合时，在同一表中设置 `threshold`；其默认值为 `0.5`。对于程序化评判项，`required-pass` 与 `all-pass` 相同。评判器 TOML 使用各自的 `[scoring]` 部分来合并该评判器内的评判项。

## 多奖励任务 {#multi-reward-tasks}

当你希望为正确性、结构和质量等维度分别打分时，将评判项组织到子目录中。每个子目录成为一个奖励：

```bash
tests/
├── test.sh
├── correctness/
│   ├── files.py
│   └── behavior.py
├── structure/
│   └── files.py
└── quality/
    └── judge.toml
```

这会产出独立的分数：

```json
{ "correctness": 0.75, "structure": 1.0, "quality": 0.6 }
```

在一个维度内，Python 文件、评判器 TOML 和子目录以相等权重合并。在该维度内添加 `reward.toml` 可改变此行为：

```toml
[[reward]]
aggregation = "weighted-mean"
weights = { files = 2.0, behavior = 1.0 }
```

Python 文件和评判器 TOML 按文件名词干引用，子目录按目录名引用。未列入 `weights` 的输入保留其自身权重。省略 `name`，因为目录名定义了该分数的名称。

直接放在 `tests/` 下、与维度目录并列的 Python 文件和评判器 TOML，会成为以文件名词干命名的顶级奖励。仅定义共享评判项（如下所述）的文件不产生分数。

### 嵌套分组 {#nested-groups}

子目录可以嵌套，以便在一个维度内对相关评判项分组：

```bash
tests/
└── correctness/
    ├── reward.toml
    ├── files.py
    └── behavior/
        ├── runtime.py
        └── edge_cases.py
```

`behavior/` 将其评判项合并为内部的 `behavior` 分数。其父级可以按目录名引用该分数：

```toml
[[reward]]
weights = { files = 1.0, behavior = 2.0 }
```

`behavior/` 内部的权重不会泄漏到其父级。每个目录导出一个分数。

要在现有维度之上向输出添加主奖励，创建带有命名 `[[reward]]` 表的根级 `tests/reward.toml`：

```toml
[[reward]]
name = "reward"
aggregation = "weighted-mean"
weights = { correctness = 2.0, structure = 1.0, quality = 1.0 }
```

```json
{
  "correctness": 0.75,
  "structure": 1.0,
  "quality": 0.6,
  "reward": 0.775
}
```

维度分数仍会保留在输出中。没有根级聚合时，多奖励任务没有隐式的 `reward`。Harbor 将 `reward` 键作为任务的主分数读取。额外的命名 `[[reward]]` 表可以添加其他聚合分数；名称不得与维度冲突。

要在各维度间复用自定义评判项，在 tests 根目录用 `shared=True` 定义它们：

```python
from pathlib import Path

from rewardkit import criterion

@criterion(shared=True)
def word_count_correct(workspace: Path) -> float:
    # Criterion logic ...
    return score
```

```python
import rewardkit as rk

rk.word_count_correct(weight=3.0)
```

## 隔离 {#isolation}

有些评判项会运行修改工作区的命令。为防止一个评判项影响另一个，请在隔离中运行。RewardKit 会通过 overlayfs 以只读方式挂载工作区，并在该评判项结束后丢弃其更改。

对于程序化评判项，传入 `isolated=True`：

```python
rk.command_succeeds("python main.py", isolated=True)
```

对于 Agent 评判器，在 `[judge]` 部分设置 `isolated = true`：

```toml
[judge]
judge = "claude-code"
isolated = true
```

在 Harbor 中使用 RewardKit 时，使用[独立的验证器环境](/docs/core-concepts/tasks/separate-verifier)，并将其所需文件声明为产物。验证器镜像应包含 `fuse-overlayfs`，其沙箱必须允许文件系统挂载。每个沙箱提供商可能需要略有不同的运行时选项，请查阅其文档。将任何额外权限仅限于验证器，切勿授予 Agent 环境。

## 输出 {#output}

RewardKit 会并排写入两个文件：

* `reward.json`：奖励分数
* `reward-details.json`：各项评判项分数、评判器推理、错误和警告

`harbor view` 会在 **Verifier Logs → Rewards** 下以可折叠树的形式渲染详情。Agent 评判器详情还包括归一化的 token `usage`、已复制的原生 JSONL `judge_logs` 路径，以及失败 Codex 尝试的含 stdout 和 stderr 的文本日志。

## 比较验证器 {#comparing-verifiers}

传入多个测试目录以并排比较验证器设计：

```bash
rewardkit /tests/v1 /tests/v2
```

RewardKit 会独立运行每个目录，为匹配的奖励名称打印比较表，并将如 `v1/correctness` 和 `v2/correctness` 这样的命名空间键写入 `reward.json`。

## CLI {#cli}

```bash
rewardkit <tests_dirs...> \
    --workspace /app \
    --output /logs/verifier/reward.json \
    --max-concurrent-programmatic 8 \
    --max-concurrent-llm 8 \
    --max-concurrent-agent 2
```

所有标志都是可选的。传入多个测试目录会独立运行每一个并打印比较结果。

## Python API {#python-api}

```python
import rewardkit as rk

# Run and get scores {#run-and-get-scores}
scores = rk.run("/tests", workspace="/app")

# Inspect discovered rewards without running them {#inspect-discovered-rewards-without-running-them}
rewards = rk.discover("/tests", workspace="/app")
```
