# 评判器评判项 {#judge-criteria}

> 使用 TOML 配置的 LLM 或 Agent 评判器为任务打分。

评判器评判项让你使用 LLM 或 Agent 评判器为任务打分。它们通过 TOML 文件配置，便于在任务之间复用和共享评分细则。

## LLM 评判器 {#llm-judge}

```toml
[judge]
judge = "anthropic/claude-sonnet-5"
files = ["/app/main.py", "/app/utils.py"]

[[criterion]]
description = "Is the code correct?"
type = "binary"

[[criterion]]
description = "How readable is the code?"
type = "likert"
points = 5
weight = 2.0

[[criterion]]
description = "Rate the test coverage on a scale from 0 to 100"
type = "numeric"
min = 0
max = 100
```

`judge` 字段接受任意 [LiteLLM 模型字符串](https://docs.litellm.ai/docs/providers)。可以在调用时覆盖，无需编辑评分细则。见[提供商路由](#provider-routing)。

## Agent 评判器 {#agent-judge}

Agent 评判器可以探索文件系统并运行命令来为任务打分。

```toml
[judge]
judge = "claude-code"
model = "anthropic/claude-sonnet-5"
isolated = true

[[criterion]]
description = "Does the solution handle edge cases?"
type = "binary"
```

### MCP 服务器 {#mcp-servers}

每个 `[[judge.mcp_servers]]` 条目与 Harbor 任务的 `[[environment.mcp_servers]]` 对应。每个服务器的 `allowed_tools` 列出评判器可以调用的工具；省略则允许该服务器的全部工具。

```toml
[judge]
judge = "claude-code"

[[judge.mcp_servers]]
name = "playwright"
transport = "stdio"
command = "npx"
args = ["@playwright/mcp@latest", "--headless", "--isolated"]
allowed_tools = ["navigate", "click"]

[[criterion]]
description = "Does the rendered page match the spec?"
type = "binary"
```

> **说明** Codex 不支持 `sse` 服务器。

## 逐项模式 {#individual-mode}

设置 `mode = "individual"` 可按每次调用只评估一项评判项，而不是将全部评判项批量放入一次调用。LLM 评判器会对每项评判项发出一次请求；Agent 评判器会按顺序为每项评判项运行一轮。对于 LLM 评判器，每项评判项还可以限定自己的 `files`：

```toml
[judge]
judge = "anthropic/claude-sonnet-5"
mode = "individual"

[[criterion]]
description = "Is the analysis correct?"
files = ["/app/analysis.pdf"]

[[criterion]]
description = "Is the spreadsheet well-structured?"
files = ["/app/data.xlsx"]
```

没有 `files` 的评判项会回退到 `[judge].files`。

如果评判器调用超时，RewardKit 会将受影响的评判项记为 `0.0`，并在 `reward-details.json` 中记录错误和警告。

## 提供商路由 {#provider-routing}

评判器调用 LiteLLM，后者从环境变量读取凭据。你可以在调用时更换提供商，无需编辑评分细则：

* `--je KEY=VALUE` 为本次运行设置环境变量，可重复使用。
* `--judge MODEL_OR_AGENT` 覆盖 `[judge].judge`。对应的环境变量是 `REWARDKIT_JUDGE`。
* `--model MODEL` 为 Agent 评判器覆盖 `[judge].model`。对应的环境变量是 `REWARDKIT_MODEL`。

Harbor 用户可以通过 `--ve` 传递相同的环境变量。

```bash
rewardkit /tests \
  --judge bedrock/anthropic.claude-3-5-sonnet-20240620-v1:0 \
  --je AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  --je AWS_REGION_NAME=us-east-1

rewardkit /tests \
  --judge claude-code \
  --model anthropic/claude-sonnet-5
```

各提供商使用的环境变量见 [LiteLLM 提供商文档](https://docs.litellm.ai/docs/providers)。

### 订阅认证 {#subscription-authentication}

对于 Anthropic LLM 评判器，当 Claude 订阅令牌是唯一存在的 Anthropic 凭据时，RewardKit 会使用它。使用 `claude setup-token` 创建一个并设置 `CLAUDE_CODE_OAUTH_TOKEN`。如果同时设置了 `ANTHROPIC_API_KEY`，则 API 密钥优先。设置 `REWARDKIT_FORCE_SUBSCRIPTION=1` 可强制使用订阅令牌。

对于 `codex` Agent 评判器，设置 `OPENAI_API_KEY`，或将经 ChatGPT 认证的 Codex `auth.json` 内容作为 `CODEX_AUTH_JSON` 传入。除非设置了 `REWARDKIT_FORCE_SUBSCRIPTION=1`，否则 API 密钥优先。

## 配置参考 {#configuration-reference}

评判器 TOML 在扫描 tests 目录时校验，早于任何评判器运行。未知键和未知值会引发错误。

### `[judge]` 部分 {#judge-section}

- `judge` (`string`) — LiteLLM 模型名称（例如 `"anthropic/claude-sonnet-5"`）、Agent 评判器名称（`"claude-code"`、`"codex"`、`"fx"`），或 `"jev"`。

- `model` (`string | null`) 默认 `null` — 对于 Agent 评判器，Agent 应使用的 LLM。对于 JEV 评判器，JEV 模型。

- `files` (`list[string]`) 默认 `[]` — 包含在评判器提示词中的工作区文件路径。

- `mode` — 是在一次调用中评估所有评判项（`batched`），还是每项评判项一次调用（`individual`）。

- `timeout` (`integer`) 默认 `300` — 等待评判器响应的秒数。

- `reasoning_effort` — LLM 评判器的推理力度。接受 LiteLLM 支持的级别；特定模型可能并不全部支持。

- `isolated` (`boolean`) 默认 `false` — 对于 Agent 评判器，通过 overlayfs 以只读方式挂载工作区。

- `cwd` (`string | null`) 默认 `null` — 对于 Agent 评判器，Agent 运行的工作目录。

- `mcp_servers` (`list[table]`) 默认 `[]` — 对于 Agent 评判器，运行前要配置的 MCP 服务器。每个条目与 Harbor 任务的 `[[environment.mcp_servers]]` 对应，外加每个服务器的 `allowed_tools` 允许列表。Codex 不支持 `sse` 服务器。

- `reference` (`string | null`) 默认 `null` — 用于比较的参考解答文件路径。

- `atif-trajectory` (`string | null`) 默认 `null` — 要包含在提示词中的 ATIF 轨迹 JSON 路径。

- `weight` (`number`) 默认 `1.0` — 该评判器分数与同一目录中其他分数合并时的权重。

- `prompt_template` (`string | null`) 默认 `null` — 自定义提示词模板（`.md` 或 `.txt`）。必须包含 `{criteria}` 占位符。

### `[[criterion]]` 条目 {#criterion-entries}

- `description` (`string`) — 要评估的内容。该文本会发送给评判器。

- `type` — 输出格式。

- `name` (`string | null`) 默认 `null` — 该评判项的标识符。省略时从 `description` 自动生成。

- `id` (`string | null`) 默认 `null` — 稳定的评分细则标识符，会传递到 `reward-details.json` 以供溯源（例如 `"1.1"`、`"2.3"`）。独立于 `name`；改写描述后仍然保留。

- `points` (`integer`) 默认 `5` — `likert` 类型的量表大小。

- `min` (`number`) 默认 `0.0` — `numeric` 类型的最小值。

- `max` (`number`) 默认 `1.0` — `numeric` 类型的最大值。

- `levels` (`list[string]`) 默认 `[]` — `rubric` 类型的等级描述，从低到高排列。2 到 10 条。

- `weight` (`number`) 默认 `1.0` — 分数聚合的重要性乘数。负权重支持惩罚性评判项，并要求 `aggregation = "weighted-sum"`。

- `files` (`list[string]`) 默认 `[]` — 限定到该评判项的文件。需要 `[judge].mode = "individual"`。省略时回退到 `[judge].files`。

- `negate` (`boolean`) 默认 `false` — 反转归一化分数。用于描述答案不应表现出的行为。见[取反评判项](#negated-criteria)。

- `optional` (`boolean`) 默认 `false` — 在 `aggregation = "required-pass"` 下豁免该评判项的门控。

### `[scoring]` 部分 {#scoring-section}

控制如何将该评判器的评判项聚合为单一分数。这只影响本 TOML 文件内的评判项。它不会改变目录中程序化分数与评判器分数的合并方式。

```toml
[scoring]
aggregation = "all-pass"  # weighted-mean | weighted-sum | all-pass | any-pass | threshold | required-pass
threshold = 0.7           # only used with "threshold" aggregation
```

`required-pass` 仅在每个非 `optional` 评判项都通过（`value > 0`）时返回 `1.0`；`optional` 评判项从不参与门控。如果没有非可选评判项，会发出警告并将分数记为 `0.0`。

`weighted-sum` 计算 `sum(value × weight)` 且不归一化。它是唯一接受负权重的聚合，其结果可能落在 `[0, 1]` 之外。

## 分数归一化 {#score-normalization}

* **Binary**：yes/true/1 → 1.0，其他任何值 → 0.0
* **Likert**：归一化到 \[0, 1]，公式为 `(raw - 1) / (points - 1)`
* **Numeric**：归一化到 \[0, 1]，公式为 `(raw - min) / (max - min)`
* **Rubric**：等级从 0 编号，归一化到 \[0, 1]，公式为 `raw / (levels - 1)`

## 取反评判项 {#negated-criteria}

对描述答案**不应**表现出的行为的评判项设置 `negate = true`。评判器照常为评判项打分，然后将分数反转（`value → 1 - value`）：存在 → 0.0，不存在 → 1.0。原始评判器答案保留在 `reward-details.json` 中，以便审核此次翻转。

```toml
[[criterion]]
description = "States there is no task execution history tracking in the database"
type = "binary"
negate = true   # the answer should NOT make this (false) claim
```

## 轨迹评估 {#trajectory-evaluation}

要评估 Agent 的过程而非仅仅其输出，将评判器指向轨迹文件：

```toml
[judge]
judge = "anthropic/claude-sonnet-5"
atif-trajectory = "/logs/agent/trajectory.json"
files = ["/app/main.py"]

[[criterion]]
description = "Did the agent take an efficient approach?"
type = "likert"
points = 5
```

轨迹内容会按比例截断，以适配模型的上下文窗口，同时保留所有步骤。

## 自定义提示词模板 {#custom-prompt-templates}

你可以提供自己的提示词，而不是使用内置提示词：

```toml
[judge]
judge = "anthropic/claude-sonnet-5"
prompt_template = "my_prompt.md"
```

模板必须包含 `{criteria}` 占位符，评判项描述会注入其中。

## JEV 评判器 {#jev-judge}

[JEV](https://docs.typesafe.ai) 是 TypeSafe 的一种新型语言模型。它对每项评判项返回概率或评分细则分数，且不返回推理，因此快速且便宜。它需要 `jev` extra（`uv tool install harbor-rewardkit[jev]`）和 `TYPESAFE_API_KEY`：

```toml
[judge]
judge = "jev"
files = ["/app/answer.md"]

[[criterion]]
description = "Does the answer address the requested task?"
type = "binary"

[[criterion]]
description = "How complete is the answer?"
type = "rubric"
levels = [
  "Omits the requested information",
  "Provides some requested information but misses important details",
  "Provides all requested information",
]
```

Binary 评判项在概率大于等于 0.5 时得分为 1.0。Rubric 的 `levels` 必须从最差到最好排列，因为列表中的位置决定分数。原始概率或分数会保留在 `reward-details.json` 中。

JEV 仅对文本文件打分，并支持 `binary` 和 `rubric` 评判项。不支持 `atif-trajectory` 和 `prompt_template`。文件和最长的评判项必须适合 32k token，任务镜像需要 CA 证书（Debian 和 Ubuntu 上为 `ca-certificates`）。

要通过 LiteLLM 代理或 Vercel AI Gateway 路由，将 `TYPESAFE_BASE_URL` 设为网关的 TypeSafe 端点，将 `TYPESAFE_API_KEY` 设为网关密钥。Vercel 还需要 `model = "typesafe-ai/jev"`。
