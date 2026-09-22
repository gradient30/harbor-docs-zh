# 指标 {#metrics}

> 自定义数据集指标。

指标定义如何在作业或数据集中跨任务聚合奖励。默认情况下，Harbor 对任务奖励取平均，并将缺失奖励视为 0。

不过，你可能希望定义自定义逻辑，或以不同方式处理缺失奖励。可以通过创建 `metric.py` 文件实现。如果使用 `dataset.toml`，可以运行以下命令创建 `metric.py`，并自动将其添加到 `dataset.toml` 的 `[[files]]` 部分：

```bash
harbor init --dataset "<org>/<name>" --with-metric
```

如果运行的是本地数据集，只要数据集目录中存在 `metric.py`，就会自动使用它。

## 默认行为 {#default-behavior}

默认情况下，Harbor 对任务奖励取平均，并将缺失奖励视为 0。

**单维**

```jsonl
    {"reward": 1}
    {"reward": 0}
    null
    {"reward": 0}
    ```

    ```json
    {"mean": 0.25}
    ```

**多维**

```jsonl
    {"correctness": 1, "style": 0.5}
    {"correctness": 0, "style": 1}
    null
    {"correctness": 1, "style": 0.5}
    ```

    ```json
    {"correctness": 0.5, "style": 0.5}
    ```

**缺失维度**

```jsonl
    {"correctness": 1}
    {"style": 1}
    {}
    null
    ```

    ```json
    {"correctness": 0.25, "style": 0.25}
    ```

对于单维奖励，Harbor 以指标名称（`mean`）命名聚合结果。对于多维奖励，它会独立聚合每个维度。缺失奖励和缺失维度计为 0。

## 使用 `metric.py` 自定义指标 {#custom-metrics-with-metric-py}

`metric.py` 脚本必须接受以下参数：

* `-i, --input-path`：奖励 JSONL 文件
* `-o, --output-path`：包含计算出的指标的输出 JSON 文件

### 示例 {#example}

```python
# /// script {#script}
# dependencies = [] {#dependencies}
# ///
# To add a dependency: uv add --script metric.py <dependency> {#to-add-a-dependency-uv-add-script-metric-py}

import argparse
import json
from pathlib import Path

def main(input_path: Path, output_path: Path):
    rewards = []

    for line in input_path.read_text().splitlines():
        reward = json.loads(line)
        if reward is None:
            rewards.append(0)
        elif len(reward) != 1:
            raise ValueError(
                f"Expected exactly one key in reward dictionary, got {len(reward)}"
            )
        else:
            rewards.extend(reward.values())

    mean = sum(rewards) / len(rewards) if rewards else 0

    output_path.write_text(json.dumps({"mean": mean}))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-i",
        "--input-path",
        type=Path,
        required=True,
        help="Path to a jsonl file containing rewards, one json object per line.",
    )
    parser.add_argument(
        "-o",
        "--output-path",
        type=Path,
        required=True,
        help="Path to a json file where the metric will be written as a json object.",
    )
    args = parser.parse_args()
    main(args.input_path, args.output_path)
```

### 注意事项 {#considerations}

实现自定义指标时，请务必考虑

1. 缺失或无效的奖励键
2. 无效的奖励值
3. JSONL 输入中的空行（null）
4. 默认聚合奖励键

### 发布自定义指标 {#publishing-custom-metrics}

发布数据集时，Harbor 会自动发布同一目录中的 `metric.py` 文件：

```bash
harbor publish "<path/to/dataset>" --public
```

### 输出格式 {#output-format}

`metric.py` 的输出应为 JSON 对象。允许包含多个指标值：

```json
{"mean": 0.81, "pass_rate": 0.5}
```
