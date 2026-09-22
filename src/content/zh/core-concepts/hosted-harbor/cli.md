# CLI {#cli}

> 从 harbor CLI 启动远程 rollout，并浏览作业、试次和密钥

请确保已使用 `harbor auth login` 登录，或已签发 API 密钥
（参见 [Harbor Hub API 密钥](/docs/core-concepts/hosted-harbor/api-key)）

## 启动作业 {#launching-a-job}

命令 `harbor run --launch` 将尝试在你的个人组织下启动作业

`--launch` 标志可以与单一 Agent/模型组合一起使用（例如 `harbor run --launch -a claude-code -m anthropic/fable-5 -d harbor/hello-world`）。
Agent/模型 sweep 必须使用配置文件启动（例如 `harbor run --launch -c config.yaml`）

```yaml
# config.yaml {#config-yaml}
job_name: opus-vs-codex-sweep
organization: my-org          # omit to use your personal org
credential_mode: gateway      # or "direct"

n_attempts: 3                 # 1-10
n_concurrent_trials: 32       # 1-1000

# Every agent runs against every task. Trials = n_attempts x tasks x agents. {#every-agent-runs-against-every-task-trials-nattempts-x-tasks-x-agents}
agents:
  - name: claude-code
    model_name: anthropic/claude-opus-4-1
    secrets: [ANTHROPIC_API_KEY]

  - name: claude-code
    model_name: anthropic/claude-sonnet-4-5
    secrets: [ANTHROPIC_API_KEY]

  - name: codex
    model_name: openai/gpt-5
    secrets: [OPENAI_API_KEY, HF_TOKEN]
    n_concurrent: 8           # per-agent sub-limit under n_concurrent_trials
    env:
      RUST_LOG: info          # nonsensitive only - secrets go in `secrets`

  - name: oracle              # needs no inference credential
    secrets: []

datasets:
  - name: terminal-bench/terminal-bench-2-1
    ref: "6"                  # `ref` or `version`, never both
    n_tasks: 25
    exclude_task_names:
      - "flaky-*"

tasks:
  - name: harbor/hello-world
    ref: latest

# Supplied for this job only, read from your local environment at launch. {#supplied-for-this-job-only-read-from-your-local-environment-at-launch}
job_secrets:
  HF_TOKEN:
    from_env: HF_TOKEN

retry:
  max_retries: 2
  include_exceptions:
    - EnvironmentStartError
```

### 注入密钥 {#injecting-secrets}

向托管作业注入密钥有两种方法：标志 `--stored-secret <ENV_VAR_NAME>` 和 `--one-off-secret ENV_VAR_NAME=secret_value`，
以及配置字段 `job_secrets` 和 `secrets`。

使用标志时，`--stored-secret` 会从 Hub 上该组织已存储的凭据中拉取 `<ENV_VAR_NAME>`。
`--one-off-secret` 会加密密钥值，并确保该值不会持久化
到任何作业配置文件中。密钥仅在必要时解密，并在作业结束后标记为已吊销。
标志会将密钥应用于作业配置中的每一个 Agent/模型组合。

换言之，如果我使用以下命令启动：`harbor run --launch -c simple_config.yaml --stored-secret TEST_VAR`
其中 `simple_config.yaml` 为

```yaml
job_name: simple-config
organization: my-org          # omit to use your personal org

agents:
  - name: claude-code
    model_name: anthropic/claude-opus-4-1
    secrets: [ANTHROPIC_API_KEY]

  - name: claude-code
    model_name: anthropic/claude-sonnet-4-5
    secrets: [ANTHROPIC_API_KEY]

tasks:
  - name: harbor/hello-world
    ref: latest
```

最终解析得到的配置如下：

```yaml
job_name: simple-config
organization: my-org

agents:
  - name: claude-code
    model_name: anthropic/claude-opus-4-1
    secrets: [ANTHROPIC_API_KEY, TEST_VAR] # notice TEST_VAR is used in both agents

  - name: claude-code
    model_name: anthropic/claude-sonnet-4-5
    secrets: [ANTHROPIC_API_KEY, TEST_VAR] # notice TEST_VAR is used in both agents

tasks:
  - name: harbor/hello-world
    ref: latest
```

| 标志                | 值                 | 效果                                                                                                               |
| ------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `--dry-run`         | —                     | 校验而不入队。解析任务、Agent 和所属组织，检查选择，并报告试次数 |
| `--org`             | `TEXT`                | 应拥有该托管作业的组织。默认为你的个人组织                                           |
| `--credential-mode` | `gateway` \| `direct` | `gateway` 通过 Hub 代理密钥，`direct` 将真实密钥交给 Agent                                  |
| `--stored-secret`   | `NAME`                | 选择所属组织中已存储的密钥。可重复                                                         |
| `--one-off-secret`  | `NAME[=VALUE]`        | 仅为本次作业提供密钥。仅写 `NAME` 时从你的环境读取。可重复                            |
| `--env-file`        | `PATH`                | 加载 `.env`。其中每一个名称都会被选中，效果与 `--one-off-secret` 相同                                              |
| `--registry-secret` | `HOST=NAME_OR_ID`     | 为私有镜像主机固定一个已存储的拉取密钥。可重复                                                        |
| `--no-secrets`      | —                     | 完全不带凭据启动                                                                                    |

`--launch` 与 `--upload` 互斥，因此上传侧标志不适用于
托管启动：`--upload`、`--public` / `--private` 和 `--share`。

## 重新评分 {#regrading}

向已记录的 Hub 结果添加 `--launch`，使用更新后的验证器重新评分。这
会创建一个新的私有作业，而无需重新运行 Agent 或更改源。

为启动组织的额度、权限和
凭据指定 `--org`。它必须与源组织匹配，并且你必须有权限
在该处启动；仅有共享读取权限是不够的。

### 重新评分作业 {#regrade-a-job}

```bash
harbor job regrade <job-uuid> --launch --org <org> -d org/dataset@version
harbor job regrade <job-uuid> --launch --org <org> -p ./updated-tasks
```

使用 `-d` 指定数据集，`-p` 指定本地任务目录，或 `-t` 指定注册表任务。
这些选项可重复且可以组合。验证器按任务名称匹配。
Harbor 选择带有已记录归档的最新试次尝试。

### 重新评分试次 {#regrade-a-trial}

```bash
harbor trial regrade <trial-uuid> --launch --org <org> -t org/task@ref
```

恰好使用一个 `-t` 或 `-p`；对于 `-p`，提供单个任务目录。
本地验证器任务会作为临时私有包上传。添加 `--yes`
以在不提示的情况下接受启动和上传。

### 要求 {#requirements}

托管重新评分目前支持带有独立验证器的单步试次。
源试次必须已完成，且替换任务必须具有相同
名称，并能够根据已记录的产物评分。源必须是 Hub UUID。

使用 `--dry-run` 进行校验而不创建作业。对于本地验证器任务，
它会检查输入而不上传；完整的源验证在启动时进行。

### 选项 {#options}

这些选项与 `--launch` 一起适用。凭据详情请参见
[密钥选项](#injecting-secrets)。

| 选项                              | 说明                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| `--launch`                          | 在托管 Harbor 上运行重新评分。                                              |
| `--org NAME`                        | 启动组织。必填；必须与源组织匹配。             |
| `-p, --task-path PATH`              | 本地验证器任务。作业也接受父目录；对作业可重复。 |
| `-t, --task REF`                    | 注册表验证器任务，例如 `org/task@ref`。对作业可重复。           |
| `-d, --dataset REF`                 | 验证器任务的数据集。仅作业重新评分；可重复。                       |
| `-n, --n-concurrent N`              | 并发重新评分数。仅作业重新评分。                                         |
| `--job-name NAME`                   | 新托管作业的名称。仅作业重新评分。                                  |
| `--trial-name NAME`                 | 目前为试次重新评分设置新托管作业的名称。                    |
| `--ve, --verifier-env KEY=VALUE`    | 验证器环境变量。可重复。                                     |
| `--stored-secret NAME`              | 来自启动组织的已存储验证器凭据。可重复。           |
| `--one-off-secret NAME[=VALUE]`     | 仅限本次作业的凭据；仅写 `NAME` 时从本地环境读取。可重复。     |
| `--registry-secret HOST=NAME_OR_ID` | 选择用于拉取私有镜像的已存储凭据。可重复。             |
| `--use-static-ip`                   | 使用静态出站 IP。否则由服务器选择其默认值。           |
| `-y, --yes`                         | 在不提示的情况下接受启动和本地任务上传。                         |
| `--dry-run`                         | 校验而不创建作业。                                               |

## 列出作业 {#listing-jobs}

使用命令 `harbor hub job list` 可以打印出 Hub 上对你的用户可见的全部作业列表。

| 标志         | 值                     | 效果                                                                  |
| ------------ | ------------------------- | ----------------------------------------------------------------------- |
| `--scope`    | `my` \| `shared` \| `all` | 可见性范围。默认为 `my`，即你的用户拥有的作业             |
| `--search`   | `TEXT`                    | 仅名称包含该子字符串的作业                             |
| `--agent`    | `NAME`                    | 按 Agent 名称过滤。可重复，多个值匹配其中任意一个 |
| `--provider` | `NAME`                    | 按模型提供商过滤。可重复                                    |
| `--model`    | `NAME`                    | 按模型过滤。可重复                                             |

## 作业概览 {#job-overview}

使用命令 `harbor hub job show JOB_ID JOB_ID_2 ...` 打印与 Hub 上类似的概览。

概览报告试次、错误和重试的数量，各项
指标的平均回报，以美元计的成本，以及 token 用量。

## 按任务的作业分解 {#per-task-job-breakdown}

使用命令 `harbor hub job tasks JOB_ID` 查看作业的按任务分解。

| 标志                               | 值  | 效果                                       |
| ---------------------------------- | ------ | -------------------------------------------- |
| `--search`                         | `TEXT` | 仅名称包含该子字符串的任务 |
| `--agent`、`--provider`、`--model` | `NAME` | 与 [`job list`](#listing-jobs) 相同           |

## 试次概览 {#trials-overview}

使用命令 `harbor hub job trials JOB_ID JOB_ID_2 ...` 列出一个或多个作业中的试次。
在交互式终端中，可以翻页审计全部试次，而无需运行第二条命令。

| 标志                               | 值                                                 | 效果                                               |
| ---------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| `--search`                         | `TEXT`                                                | 仅名称包含该子字符串的试次        |
| `--agent`、`--provider`、`--model` | `NAME`                                                | 与 [`job list`](#listing-jobs) 相同                   |
| `--limit`                          | `N`                                                   | 页大小。此处默认为 100                      |
| `--failed-only`                    | —                                                     | 仅出错或失败的试次                   |
| `--include-retries`                | —                                                     | 包含重试历史，而不仅是最新执行 |
| `--sort-by`                        | `started_at` \| `task_name` \| `name` \| `error_type` | 排序列                                          |
| `--sort-order`                     | `asc` \| `desc`                                       | 排序方向                                       |

## 比较两个或更多作业 {#comparing-2-or-more-jobs}

使用命令 `harbor hub job compare JOB_ID JOB_ID_2 ...` 获取任务表现的并排网格

## 作业可见性 {#job-visibility}

使用命令 `harbor hub job shares JOB_ID` 查看作业与谁共享。返回组织和用户

## 重命名作业 {#renaming-jobs}

使用 `harbor hub job rename JOB_ID "NEW NAME"` 更改 Hub 上显示的名称。
这不会更改作业 ID、产物身份或已提交的
配置。添加 `--json` 以打印重命名 RPC 响应。

## 转移作业所有权 {#transferring-job-ownership}

使用 `harbor hub job transfer JOB_ID ORGANIZATION` 将已完成的作业
及其全部试次转移到你拥有的另一个组织。作业和试次 ID 不会
更改。目标组织必须已经能够访问该作业使用的每一项执行依赖。

该命令会提示确认；在脚本中传入 `--yes` / `-y`。默认情况下，源组织保留共享读取权限，作业专用
密钥会被永久移除。使用 `--drop-source-access` 移除
源授权，或使用 `--keep-job-credentials` 保留并重新授权你
最初提供的密钥。

## 删除作业 {#deleting-jobs}

使用命令 `harbor hub job delete JOB_ID JOB_ID_2 ...` 从 Hub 永久删除你拥有的作业，包括其全部试次和共享。

该命令在删除任何内容前会提示确认；传入 `--yes` / `-y` 以跳过提示（脚本或管道时必需）。

只有作业的所有者可以删除作业。链接到排行榜提交的作业以及仍在运行的托管作业无法删除。

## 托管作业状态 {#hosted-job-status}

使用命令 `harbor hub job status JOB_ID` 获取作业状态。返回待处理、运行中、失败和已完成试次的计数。

## 显示试次 {#trial-show}

使用命令 `harbor hub trial show TRIAL_ID` 显示单个试次的元数据

## 下载试次 {#downloading-a-trial}

使用命令 `harbor hub trial download TRIAL_ID` 下载特定试次

| 标志                 | 值  | 效果                                                                        |
| -------------------- | ------ | ----------------------------------------------------------------------------- |
| `--output-dir`、`-o` | `PATH` | 将试次下载到的目录。默认为 `./trials`               |
| `--overwrite`        | —      | 替换已有的试次目录                                           |
| `--trajectory`       | —      | 仅下载 `trajectory.json`。如果该试次没有已存储的轨迹则报错 |

## 重试托管试次 {#retrying-a-hosted-trial}

对于远程启动的作业中的试次，可以使用命令 `harbor hub trial retry TRIAL_ID` 重试这些试次。

这些标志是累积过滤器。`harbor hub trial retry --job JOB_ID --failed-only`
先选择该作业中的每一个试次，再缩小到失败的那些。

| 标志            | 值    | 选择                                  |
| --------------- | -------- | ---------------------------------------- |
| `--job`         | `JOB_ID` | 该作业中的每一个试次                  |
| `--search`      | `TEXT`   | 名称包含该子字符串的试次 |
| `--agent`       | `TEXT`   | 使用该 Agent 运行的试次               |
| `--provider`    | `TEXT`   | 使用该提供商运行的试次            |
| `--model`       | `TEXT`   | 使用该模型运行的试次               |
| `--task`        | `TEXT`   | 针对该任务运行的试次             |
| `--exception`   | `TEXT`   | 以该异常失败的试次   |
| `--failed-only` | —        | 仅失败的试次                  |
| `--yes`         | —        | 跳过确认                        |

## 取消托管试次 {#canceling-a-hosted-trial}

要取消托管试次，使用命令 `harbor hub trial cancel TRIAL_ID`

| 标志       | 值    | 效果                                                                |
| ---------- | -------- | --------------------------------------------------------------------- |
| `--job`    | `JOB_ID` | 取消该作业中的每一个试次。等同于 `harbor hub job cancel JOB_ID` |
| `--all`    | —        | 取消当前正在运行的每一个试次                                  |
| `--reason` | `TEXT`   | 记录取消原因                                  |
| `--yes`    | —        | 跳过确认                                                     |

[`trial retry`](#retrying-a-hosted-trial) 中的选择过滤器在此处同样适用。

## 添加密钥 {#adding-secrets}

使用命令 `harbor hub secrets add NAME` 将密钥上传到 Hub。

| 标志          | 值    | 效果                                                              |
| ------------- | -------- | ------------------------------------------------------------------- |
| `--org`       | `ORG_ID` | 存储该密钥的组织。默认为你的个人组织  |
| `--job`       | `JOB_ID` | 将密钥限定到单个作业，而不是账户范围            |
| `--from-env`  | —        | 从同名的本地环境变量读取值 |
| `--yes`、`-y` | —        | 在不提示的情况下替换已有密钥                      |

## 列出密钥 {#listing-secrets}

使用命令 `harbor hub secrets list` 列出已上传密钥的名称和元数据。

| 标志                | 值    | 效果                                 |
| ------------------- | -------- | -------------------------------------- |
| `--org`             | `ORG_ID` | 要列出密钥的组织       |
| `--job`             | `JOB_ID` | 列出限定到该作业的密钥        |
| `--include-revoked` | —        | 包含已被吊销的密钥 |

## 删除密钥 {#deleting-secrets}

使用命令 `harbor hub secrets delete` 吊销密钥。

| 标志      | 值    | 效果                                                                             |
| --------- | -------- | ---------------------------------------------------------------------------------- |
| `--org`   | `ORG_ID` | 吊销该组织中的密钥                                               |
| `--job`   | `JOB_ID` | 吊销限定到该作业的密钥                                                 |
| `--purge` | —        | 彻底删除记录，使其不再出现在 `list --include-revoked` 下 |

## 添加镜像注册表密钥 {#adding-an-image-registry-secret}

使用命令 `harbor hub secrets registry add` 添加镜像注册表密钥。也支持 `secrets registry list` 和 `secrets registry delete`。

| 标志          | 值  | 效果                                                              |
| ------------- | ------ | ------------------------------------------------------------------- |
| `--name`      | `TEXT` | 之后用于选择该凭据的显示名称                    |
| `--from-file` | `PATH` | 从文件读取凭据，例如 GAR 服务账号 JSON |
| `--yes`、`-y` | —      | 在不提示的情况下替换已有凭据                  |

## 共用标志 {#shared-flags}

上方的列出命令也接受这些：

| 标志            | 值 | 效果                                                 |
| --------------- | ----- | ------------------------------------------------------ |
| `--quiet`、`-q` | —     | 仅打印 ID，便于管道到 `xargs`                |
| `--no-trunc`    | —     | 显示完整单元格内容，换行而不截断 |
| `--no-headers`  | —     | 省略表头行                                    |
| `--page`        | `N`   | 获取特定的一页，禁用交互式分页  |
| `--json`        | —     | 以 JSON 返回原始 API 响应                    |
