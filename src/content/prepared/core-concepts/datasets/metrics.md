# Metrics {#metrics}

> Custom dataset metrics.

Metrics define how to aggregate rewards across tasks in a job or dataset. By default, Harbor averages rewards across tasks and treats missing rewards as 0.

However, you may want to define custom logic or handle missing rewards differently. You can do this by creating a `metric.py` file. If you are working with a `dataset.toml`, you can run the following command to create a `metric.py` file and automatically add it to the `[[files]]` section of your `dataset.toml`:

```bash
harbor init --dataset "<org>/<name>" --with-metric
```

If you are running a local dataset, it will automatically use the `metric.py` if it's present in the dataset directory.

## Default behavior {#default-behavior}

By default, Harbor averages rewards across tasks and treats missing rewards as 0.

**Single dimension**

```jsonl
    {"reward": 1}
    {"reward": 0}
    null
    {"reward": 0}
    ```

    ```json
    {"mean": 0.25}
    ```

**Multi-dimensional**

```jsonl
    {"correctness": 1, "style": 0.5}
    {"correctness": 0, "style": 1}
    null
    {"correctness": 1, "style": 0.5}
    ```

    ```json
    {"correctness": 0.5, "style": 0.5}
    ```

**Missing dimensions**

```jsonl
    {"correctness": 1}
    {"style": 1}
    {}
    null
    ```

    ```json
    {"correctness": 0.25, "style": 0.25}
    ```

For single-dimension rewards, Harbor names the aggregate after the metric (`mean`). For multi-dimensional rewards, it aggregates each dimension independently. Missing rewards and missing dimensions count as 0.

## Custom metrics with `metric.py` {#custom-metrics-with-metric-py}

A `metric.py` script must accept the following arguments:

* `-i, --input-path`: rewards JSONL file
* `-o, --output-path`: output JSON file with computed metrics

### Example {#example}

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

### Considerations {#considerations}

When implementing a custom metric, be sure to account for

1. Missing or invalid reward keys
2. Invalid reward values
3. Null rows in the JSONL input
4. Default aggregate reward keys

### Publishing custom metrics {#publishing-custom-metrics}

When publishing a dataset, Harbor automatically publishes the `metric.py` file in the same directory:

```bash
harbor publish "<path/to/dataset>" --public
```

### Output format {#output-format}

`metric.py` output should be a JSON object. Multiple metric values are allowed:

```json
{"mean": 0.81, "pass_rate": 0.5}
```
