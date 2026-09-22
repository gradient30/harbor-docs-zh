# 排行榜 {#leaderboards}

> 在 Harbor Hub 上创建、排名并共享评估结果。

排行榜是某个数据集的结果排名表。你可以定义列和排名规则，添加带有元数据和分数的行，并可选地将每一行链接到其背后的试次。

> **说明** Harbor Hub 有意不根据已链接的试次计算行分数，以便最大程度地灵活构建排行榜。

公开排行榜无需登录即可读取。私有排行榜仅对所属组织的成员可见。创建排行榜需要对数据集所属组织的所有者权限。

在下方命令中，`<leaderboard>` 可以是 UUID，也可以是 `org/dataset/leaderboard` 形式的 slug。

## 总体流程 {#general-approach}

1. 选择一个已发布的数据集，以及排行榜将覆盖的 [版本](#dataset-versions)。
2. 使用 `init` [生成配置](#create)，然后定义元数据、指标、列和排名规则。
3. 将结果准备为 [行](#add-rows)，自行计算分数。如果希望将每条结果链接到对应运行，请包含试次 ID。
4. 使用定义文件和行文件创建排行榜。审阅结果期间保持私有。
5. [查看排行榜](#browse)，检查排名和试次链接，准备就绪后 [将其设为公开](#edit-a-leaderboard)。

## 浏览 {#browse}

```bash
harbor hub leaderboard list
harbor hub leaderboard list "<org>/<dataset>"
harbor hub leaderboard show "<leaderboard>"
```

`list` 可选择按数据集 slug 或 ID 过滤。

## 创建 {#create}

生成配置文件，编辑后创建排行榜：

```bash
harbor auth login
harbor hub leaderboard init \
  --package "<org>/<dataset>" \
  --name main \
  --title "Main leaderboard" \
  --output leaderboard.yaml
# Edit leaderboard.yaml. {#edit-leaderboard-yaml}
harbor hub leaderboard create --config leaderboard.yaml
```

新排行榜为私有。在文件中设置 `visibility: public`，或向 `create` 传入 `--visibility public`。

### 配置 schema {#configuration-schema}

传给 `create --config` 的定义文件接受以下字段。使用 `package` 或 `package_id` 其一。行放在通过 `--rows` 传入的单独文件中。

- `package` (`string`) — 数据集 slug，例如 `acme/my-dataset`。未提供 `package_id` 时必填。

- `package_id` (`string (UUID)`) — 数据集包 UUID，作为 `package` 的替代。

- `name` (`string`) — 排行榜 slug，最多 100 个字符。以小写字母或数字开头；还可以包含 `.`、`_` 和 `-`。

- `title` (`string`) — 显示标题，长度为 1 到 200 个字符。

- `description` (`string | null`) — 可选描述，最多 5,000 个字符。

- `visibility` (`string`) 默认 `private` — `public` 或 `private`。

- `metadata_schema` (`object`) — 每行元数据的 schema，例如 Agent 名称和配置。

- `metrics_schema` (`object`) — 每行指标的 schema，例如分数和成本。

- `columns` (`object[]`) 默认 `[]` — 显示列，按从左到右的顺序。    <Expandable title="列字段">     <ParamField body="id" type="string" required>       唯一列键。以字母、数字或下划线开头；还可以包含 `.` 和 `-`。

    - `header` (`string`) — 非空的显示标题。

    - `accessor` (`string`) — 以 `metadata.` 或 `metrics.` 开头的取值路径，例如 `metrics.reward`。

    - `type` (`string`) — `text`、`number`、`boolean`、`date`、`markdown` 或 `link`。链接接受 URL 字符串，或包含 `url` 和 `label` 的对象。

    - `display_accessor` (`string`) — 用于显示的备用取值路径。原始 `accessor` 仍作为排序值。

    - `display_type` (`string`) — 备用显示值的格式化器；接受与 `type` 相同的值。

    - `align` (`string`) — `left`、`center` 或 `right`。

    - `description` (`string`) — 该列的说明。

    - `enable_sorting` (`boolean`) — 用户是否可以在 Hub 中按此列排序。
  </Expandable>
</ParamField>

- `rank_by` (`object[]`) 默认 `[]` — 排名规则，按顺序求值以打破平局。    <Expandable title="排名规则字段">     <ParamField body="accessor" type="string" required>       以 `metadata.` 或 `metrics.` 开头的取值路径。

    - `direction` (`string`) — `asc` 表示最低优先，`desc` 表示最高优先。

    - `nulls` (`string`) — 将缺失值放在 `first`（最前）或 `last`（最后）。
  </Expandable>
</ParamField>

- `dataset_version_refs` (`string[]`) — 要关联的数据集版本引用，例如 `latest` 或版本标签。创建时解析为固定 UUID。

- `dataset_version_ids` (`string (UUID)[]`) — 要关联的数据集版本 UUID。可与 refs 组合使用。同时省略这两个字段以关联所有现有版本；将两者都设为 `[]` 表示不关联任何版本。

### 列与排名 {#columns-and-ranking}

生成的文件包含一个示例，含 Agent 名称和奖励分数：

```yaml
metadata_schema:
  type: object
  properties:
    agent:
      type: string
metrics_schema:
  type: object
  properties:
    reward:
      type: number
columns:
  - id: agent
    header: Agent
    accessor: metadata.agent
    type: text
  - id: reward
    header: Reward
    accessor: metrics.reward
    type: number
rank_by:
  - accessor: metrics.reward
    direction: desc
    nulls: last
```

这将显示 Agent 列和奖励列，奖励最高者排名第一。

### 数据集版本 {#dataset-versions}

默认情况下，新排行榜会关联创建时已存在的每一个数据集版本。之后的版本不会自动添加。

要显式选择版本，在配置中添加 `dataset_version_refs` 或 `dataset_version_ids`：

```yaml
dataset_version_refs:
  - latest
```

引用会解析为固定的版本 UUID。两个字段可以组合使用；将两者都设为 `[]` 则不关联任何版本。

## 添加行 {#add-rows}

创建 `rows.yaml`，填入各列所期望的值：

```yaml
rows:
  - metadata:
      agent: Example agent
    metrics:
      reward: 0.85
```

然后添加这些行：

```bash
harbor hub leaderboard row create "<leaderboard>" --config rows.yaml
```

### 行文件 schema {#row-file-schema}

传给 `row create --config` 或 `create --rows` 的文件具有如下结构：

- `rows` (`object[]`) — 1 到 500 条新行。试次 ID 在该请求的各行之间必须唯一。    <Expandable title="行字段">     <ParamField body="metadata" type="object" default="{}">       与排行榜 `metadata_schema` 匹配的值。

    - `metrics` (`object`) — 与排行榜 `metrics_schema` 匹配的值。

    - `status` (`string`) 默认 `display` — `display` 表示显示该行，`hide` 表示隐藏。

    - `trial_ids` (`string (UUID)[]`) 默认 `[]` — 链接到该行的试次。链接试次不会计算元数据或指标。
  </Expandable>
</ParamField>

要同时创建排行榜及其行，将单独的行文件传给 `create`：

```bash
harbor hub leaderboard create --config leaderboard.yaml --rows rows.yaml
```

## 编辑排行榜 {#edit-a-leaderboard}

直接更改其标题、描述或可见性：

```bash
harbor hub leaderboard update "<leaderboard>" \
  --title "Updated leaderboard" --visibility public
```

使用 `--description` 更改描述，或使用 `--visibility private` 将排行榜设为私有。要替换数据集版本关联，重复使用 `--dataset-version-ref` 或 `--dataset-version-id`。省略这些字段以保留现有关联。

对于列、schema 或排名的更改，先导出定义，编辑后再应用：

```bash
harbor hub leaderboard export "<leaderboard>" --output leaderboard.yaml
# Edit leaderboard.yaml. {#edit-leaderboard-yaml}
harbor hub leaderboard update "<leaderboard>" --config leaderboard.yaml
```

标志会覆盖文件中的对应值。无法通过 `update` 更改包和排行榜名称。

## 编辑行 {#edit-rows}

列出各行以查找其 ID，然后查看或编辑某一行：

```bash
harbor hub leaderboard row list "<leaderboard>"
harbor hub leaderboard row show "<row-id>"
harbor hub leaderboard row export "<row-id>" --output row.yaml
# Edit row.yaml. {#edit-row-yaml}
harbor hub leaderboard row update "<row-id>" --config row.yaml
```

行更新会更改 `metadata`、`metrics` 或 `status`。要隐藏、恢复或永久删除行：

```bash
harbor hub leaderboard row update "<row-id>" --status hide
harbor hub leaderboard row update "<row-id>" --status display
harbor hub leaderboard row delete "<row-id>" "<another-row-id>" --yes
```

删除行同时会移除其试次链接。省略 `--yes` 以进行交互式确认。CLI 没有删除整个排行榜的命令。

### 批量编辑 {#batch-edits}

导出所有可见行，编辑后再应用该文件：

```bash
harbor hub leaderboard row export "<leaderboard>" --all --output rows.yaml
# Edit rows.yaml. {#edit-rows-yaml}
harbor hub leaderboard update "<leaderboard>" --rows rows.yaml
```

如果 schema 变更需要同步修改行，将两个文件一起应用，使其作为一次事务成功或失败：

```bash
harbor hub leaderboard update "<leaderboard>" \
  --config leaderboard.yaml --rows rows.yaml --dry-run
harbor hub leaderboard update "<leaderboard>" \
  --config leaderboard.yaml --rows rows.yaml
```

编辑前先导出这两个文件。其时间戳可防止覆盖更新的更改。`--dry-run` 要求同时包含定义变更和行更新。

## 链接试次 {#link-trials}

试次链接记录哪些运行支撑某一行。`set` 替换全部链接；`add` 和 `remove` 仅更改指定的链接。

```bash
harbor hub leaderboard row trial list "<row-id>"
harbor hub leaderboard row trial set "<row-id>" --trial-id "<trial-id>"
harbor hub leaderboard row trial add "<row-id>" --trial-id "<trial-id>"
harbor hub leaderboard row trial remove "<row-id>" --trial-id "<trial-id>"
harbor hub leaderboard row trial set "<row-id>" --clear
```

重复使用 `--trial-id` 可指定多个试次。也可以从包含非空 `trial_ids` 列表的 YAML 或 JSON 文件替换链接：

```bash
harbor hub leaderboard row trial set "<row-id>" --trial-ids-file trials.yaml
```

单独使用文件选项；使用 `--clear` 移除全部链接。

## 文件与脚本 {#files-and-scripting}

配置文件接受 YAML 或 JSON。导出要求使用 `.yaml`、`.yml` 或 `.json` 扩展名；`init` 也接受 `--format json`。使用 `--force` 覆盖已有输出文件。

读取和变更命令支持 `--json`。使用 `list --quiet` 获取排行榜 slug，使用 `row list --quiet` 获取行 ID，使用 `row trial list --quiet` 获取试次 ID。

行列表和试次列表支持 `--limit`（默认 50，最大 1,000）和 `--page`（从 1 开始）。JSON 返回单页。安静模式或管道输出会流式返回所有页，除非指定了 `--page`；`--no-headers` 会移除管道表格的表头。

```bash
harbor hub leaderboard row list "<leaderboard>" --page 2 --limit 100 --json
harbor hub leaderboard row trial list "<row-id>" --quiet
```

## 在自己的网站上展示排行榜 {#display-a-leaderboard-on-your-own-website}

无需身份验证即可获取公开排行榜，以便在自己的网站上展示：

```bash
curl --fail-with-body -sS \
  "https://api.harborframework.com/functions/v1/leaderboard-read" \
  -H "Content-Type: application/json" \
  -d '{
    "package": "<org>/<dataset>",
    "name": "<leaderboard-name>",
    "page": 1,
    "page_size": 100
  }'
```

响应包含 `leaderboard` 定义、已排名的 `rows` 以及 `pagination`。通过 `pagination.total_pages` 获取全部行。也可以用 `leaderboard_id` 代替 `package` 和 `name` 来选择排行榜。

对于私有排行榜，请从服务器进行身份验证；不要将 API 密钥放入浏览器代码。

示例流水线请参见 [terminal-bench-2-1](https://github.com/harbor-framework/terminal-bench-2-1)，由 Hub 支撑的自定义可视化请参见 [tbench.ai](https://www.tbench.ai/)。指向试次和版本化数据集的链接让读者可以审计结果并复现评估。
