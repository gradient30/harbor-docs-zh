# 使用 RewardKit 创建验证器 {#create-a-verifier-with-rewardkit}

> 构建一个将程序化准则、权重和可选 LLM judge 组合在一起的任务验证器。

本教程将构建一个小型任务，并用 RewardKit 对其进行评分。Agent 需要编写文本统计模块和分析脚本。验证器分别对 `structure` 和 `correctness` 打分，再将它们合并为主要的 `reward`。完成后的任务见 Harbor 仓库中的 [reward-kit-example](https://github.com/harbor-framework/harbor/tree/main/examples/tasks/reward-kit-example)。

## 步骤 1：创建任务 {#step-1-create-the-task}

[安装 Harbor](/docs/getting-started/installation)，然后创建任务目录：

```bash
harbor task init textstats
```

完成后的任务结构如下：

```bash
textstats/
├── instruction.md
├── task.toml
├── environment/
│   ├── Dockerfile
│   └── sample.txt
├── solution/
│   └── solve.sh
└── tests/
    ├── test.sh
    ├── criteria.py            # 共享的自定义准则
    ├── reward.toml            # 跨维度的主奖励
    ├── structure/
    │   ├── files_exist.py
    │   ├── functions_defined.py
    │   └── reward.toml
    └── correctness/
        ├── word_count.py
        ├── most_common.py
        ├── reward.toml
        └── pipeline/
            └── pipeline_runs.py
```

## 步骤 2：编写指令与环境 {#step-2-write-the-instruction-and-environment}

````markdown
Create a text statistics module and analysis script.

1. `/app/textstats.py` with `word_count(text: str) -> int` (words split by
   whitespace) and `most_common(text: str) -> str` (most frequent word,
   lowercase, empty string for empty input).
2. `/app/analyze.py`, which reads `/app/sample.txt` and writes
   `/app/results.json` as:

```json
{ "word_count": <int>, "most_common": "<string>" }
```
````

环境需要 Python、`uv` 以及样本文本：

```dockerfile
FROM ubuntu:24.04

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY sample.txt /app/sample.txt
```

```text
the quick brown fox jumps over the lazy dog
the dog barked at the fox
the fox ran away quickly
```

生成的 `task.toml` 保持不变即可。

## 步骤 3：编写解答 {#step-3-write-the-solution}

Oracle Agent 会运行此脚本，以确认任务可解：

```bash
#!/bin/bash

cat > /app/textstats.py << 'EOF'
from collections import Counter

def word_count(text: str) -> int:
    return len(text.split())

def most_common(text: str) -> str:
    words = text.lower().split()
    return Counter(words).most_common(1)[0][0] if words else ""
EOF

cat > /app/analyze.py << 'EOF'
import json
from pathlib import Path

from textstats import most_common, word_count

text = Path("sample.txt").read_text().strip()
results = {"word_count": word_count(text), "most_common": most_common(text)}
Path("results.json").write_text(json.dumps(results, indent=2))
EOF

cd /app && uv run python analyze.py
```

## 步骤 4：从测试脚本运行 RewardKit {#step-4-run-rewardkit-from-the-test-script}

Harbor 会将 `tests/` 复制到 `/tests` 并运行 `test.sh`。该脚本只需调用 RewardKit，后者会发现 `/tests` 下的每一条准则，针对 `/app` 运行它们，并写入 `/logs/verifier/reward.json`：

```bash
#!/bin/bash
uvx --from 'harbor-rewardkit==0.2.*' rewardkit /tests
```

## 步骤 5：添加结构准则 {#step-5-add-structure-criteria}

`tests/` 的每个子目录会成为以该目录命名的一项奖励，其中每个 Python 文件会成为以该文件命名的一项分数。`structure` 使用[内置准则](/docs/core-concepts/rewardkit/built-in-criteria)检查所需文件和函数是否存在。路径相对于 `/app`：

```python
from rewardkit import criteria

criteria.file_exists("textstats.py")
criteria.file_exists("analyze.py")
criteria.file_exists("results.json")
```

```python
from rewardkit import criteria

criteria.file_contains("textstats.py", "def word_count")
criteria.file_contains("textstats.py", "def most_common")
```

## 步骤 6：添加正确性准则 {#step-6-add-correctness-criteria}

检查返回值需要自定义逻辑。在 tests 根目录用 `shared=True` 定义一次，这样任何维度都可以调用它。返回 `float` 可给予部分分数：

```python
import importlib.util
from pathlib import Path

from rewardkit import criterion

def _load_module(workspace: Path, name: str):
    spec = importlib.util.spec_from_file_location(name, workspace / f"{name}.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

@criterion(shared=True)
def word_count_correct(workspace: Path) -> float:
    try:
        mod = _load_module(workspace, "textstats")
    except Exception:
        return 0.0
    cases = [("hello world", 2), ("one", 1), ("", 0), ("the quick brown fox", 4)]
    return sum(mod.word_count(t) == n for t, n in cases) / len(cases)

@criterion(shared=True)
def most_common_correct(workspace: Path) -> float:
    try:
        mod = _load_module(workspace, "textstats")
    except Exception:
        return 0.0
    cases = [("the cat and the dog", "the"), ("hello hello world", "hello"), ("", "")]
    return sum(mod.most_common(t) == w for t, w in cases) / len(cases)
```

从 `correctness` 调用共享准则，每个文件一条；将端到端流水线检查放在嵌套的 `pipeline/` 组中，以便单独加权：

```python
from rewardkit import criteria

criteria.word_count_correct()
```

```python
from rewardkit import criteria

criteria.most_common_correct()
```

```python
from rewardkit import criteria

criteria.command_succeeds("python analyze.py")
criteria.json_key_equals("results.json", "most_common", "the")
```

## 步骤 7：配置评分 {#step-7-configure-the-scoring}

默认情况下，同一个 Python 文件内的准则按权重取平均，同一维度内的文件权重相等，每个维度会单独写入 `reward.json`。三个 `reward.toml` 文件用于调整这一行为。

`structure` 仅在每个文件和函数都存在时才通过。`[scoring.<stem>]` 配置单个 Python 文件内的准则，未命名的 `[[reward]]` 则组合这些文件：

```toml
[scoring.files_exist]
aggregation = "all-pass"

[scoring.functions_defined]
aggregation = "all-pass"

[[reward]]
aggregation = "all-pass"
```

在 `correctness` 中，两个函数检查以及嵌套的 `pipeline` 组按名称加权：

```toml
[[reward]]
weights = { word_count = 3.0, most_common = 2.0, pipeline = 1.0 }
```

根目录的 `reward.toml` 添加 Harbor 所读取的主 `reward`，要求两个维度都通过：

```toml
[[reward]]
name = "reward"
aggregation = "all-pass"
```

验证器现在会写入：

```json
{ "correctness": 1.0, "structure": 1.0, "reward": 1.0 }
```

聚合模式见[分数如何合并](/docs/core-concepts/rewardkit/quick-start#how-scores-are-combined)。

## 步骤 8（可选）：添加 LLM judge {#step-8-optional-add-an-llm-judge}

添加带 judge TOML 的 `quality` 维度，并通过 `task.toml` 传入 API 密钥：

```toml
[judge]
judge = "anthropic/claude-sonnet-5"
files = ["/app/textstats.py", "/app/analyze.py"]

[[criterion]]
description = "Are the functions implemented in a clear and idiomatic way?"
type = "likert"
points = 5
```

```toml
[verifier.env]
ANTHROPIC_API_KEY = "${ANTHROPIC_API_KEY}"
```

`quality` 会成为第四项分数，根目录的 `all-pass` 聚合会将其纳入。Agent judge 以及完整 TOML 参考见 [Judge 准则](/docs/core-concepts/rewardkit/judge-criteria)。

## 步骤 9：运行并检查 {#step-9-run-and-inspect}

对验证器运行解答，然后打开查看器：

```bash
harbor run -p textstats -a oracle
harbor view ./jobs
```

每个维度的分数都应为 1。在试次的 **Verifier Logs** 选项卡中，**Rewards** 部分会将 `reward-details.json` 渲染为树状结构，显示每条准则的分数、权重以及任何错误。

- **[reward-kit-example](https://github.com/harbor-framework/harbor/tree/main/examples/tasks/reward-kit-example)** — 本教程构建的完整任务。
