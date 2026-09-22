# 内置评判项 {#built-in-criteria}

> 所有内置评判项函数的参考。

RewardKit 附带用于常见评分细则的内置评判项。从 tests 目录中的任意 Python 文件使用它们：

```python
import rewardkit as rk

rk.file_exists("output.txt")
rk.command_succeeds("python main.py", weight=2.0)
```

除下列参数外，所有评判项都接受可选的 `weight`（默认 `1.0`）和 `isolated`（默认 `false`）参数。

## 文件评判项 {#file-criteria}

| 评判项                | 参数             | 描述                                                                  |
| --------------------- | ---------------- | --------------------------------------------------------------------- |
| `file_exists`         | `path`           | 工作区中存在该文件                                                    |
| `file_not_exists`     | `path`           | 文件不存在                                                            |
| `file_contains`       | `path, text`     | 文件包含某个子字符串                                                  |
| `file_contains_regex` | `path, pattern`  | 文件内容匹配正则表达式                                                |
| `file_matches`        | `path, expected` | 文件内容等于期望文本（去除空白后）                                    |
| `files_equal`         | `path1, path2`   | 两个文件内容完全相同                                                  |
| `diff_ratio`          | `path, expected` | 文件内容与期望文本的相似度比率（返回 0.0–1.0）                        |

## 命令评判项 {#command-criteria}

| 评判项                         | 参数                            | 描述                                      |
| ------------------------------ | ------------------------------- | ----------------------------------------- |
| `command_succeeds`             | `cmd, cwd?, timeout?`           | 命令以退出码 0 结束                       |
| `command_output_contains`      | `cmd, text, cwd?, timeout?`     | 命令 stdout 包含指定文本                  |
| `command_output_matches`       | `cmd, expected, cwd?, timeout?` | 命令 stdout 等于期望值（去除空白后）      |
| `command_output_matches_regex` | `cmd, pattern, cwd?, timeout?`  | 命令 stdout 匹配正则表达式                |

默认超时为 30 秒。`cwd` 参数相对于工作区。

## 数据格式评判项 {#data-format-criteria}

| 评判项                | 参数                           | 描述                                        |
| --------------------- | ------------------------------ | ------------------------------------------- |
| `json_key_equals`     | `path, key, expected`          | 顶层 JSON 键等于某个值                      |
| `json_path_equals`    | `path, json_path, expected`    | 以点分隔的 JSON 路径等于某个值              |
| `csv_cell_equals`     | `path, row, col, expected`     | 位于 row/col 的 CSV 单元格等于某个值        |
| `xlsx_cell_equals`    | `path, cell, expected, sheet?` | Excel 单元格等于某个值                      |
| `sqlite_query_equals` | `db_path, query, expected`     | SQL 查询结果等于某个值                      |

> **说明** `xlsx_cell_equals` 需要 `documents` extra：`uv tool install harbor-rewardkit[documents]`

> **说明** 对于 `csv_cell_equals`，行号取决于列类型。当 `col` 为**整数**时，使用原始 CSV 读取器，第 0 行是表头行。当 `col` 为**字符串**（列名）时，第 0 行是表头之后的第一行数据。

## HTTP 评判项 {#http-criteria}

| 评判项                   | 参数                     | 描述                                                     |
| ------------------------ | ------------------------ | -------------------------------------------------------- |
| `http_status_equals`     | `url, status?, timeout?` | HTTP 响应具有期望的状态码（默认 200）                    |
| `http_response_contains` | `url, text, timeout?`    | HTTP 响应体包含指定文本                                  |

默认超时为 10 秒。

## 图像评判项 {#image-criteria}

| 评判项              | 参数                  | 描述                                           |
| ------------------- | --------------------- | ---------------------------------------------- |
| `image_similarity`  | `path1, path2`        | 像素级相似度比率（返回 0.0–1.0）               |
| `image_size_equals` | `path, width, height` | 图像具有期望的尺寸                             |

> **说明** 图像评判项需要 `image` extra：`uv tool install harbor-rewardkit[image]`

## 轨迹评判项 {#trajectory-criteria}

这些评判项检查 Agent 的 ATIF 轨迹文件（默认路径：`/logs/agent/trajectory.json`）。

| 评判项                     | 参数                           | 描述                                                                                          |
| -------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------- |
| `trajectory_tool_used`     | `tool_name, min_count?, path?` | Agent 至少使用了指定工具 `min_count` 次（默认 1）                                             |
| `trajectory_tool_not_used` | `tool_name, path?`             | Agent 未使用指定工具                                                                          |
| `trajectory_turn_count`    | `max_turns, path?`             | 惩罚超出轮次预算：在 `max_turns` 时返回 1.0，线性衰减到两倍轮次时的 0.0                       |

## 可选 extras {#optional-extras}

| Extra       | 评判项                                  | 安装                                          |
| ----------- | --------------------------------------- | --------------------------------------------- |
| `documents` | `xlsx_cell_equals`                      | `uv tool install harbor-rewardkit[documents]` |
| `image`     | `image_similarity`, `image_size_equals` | `uv tool install harbor-rewardkit[image]`     |
| `all`       | 以上全部                                | `uv tool install harbor-rewardkit[all]`       |
