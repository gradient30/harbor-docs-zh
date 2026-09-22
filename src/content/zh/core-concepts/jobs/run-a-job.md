# 运行作业 {#run-a-job}

> 在 Harbor 中运行作业。

作业是试次的集合。试次是 Agent 完成任务的一次尝试。要在 Harbor 中运行作业，使用 `harbor run` 命令。

**本地数据集**

```bash
    harbor run -p "<path/to/dataset>" -a "<agent>" -m "<model>"
    ```

**本地任务**

```bash
    harbor run -p "<path/to/task>" -a "<agent>" -m "<model>"
    ```

**Hub 数据集**

```bash
    harbor run -d "<org/dataset>@<ref>" -a "<agent>" -m "<model>"
    ```

**Hub 任务**

```bash
    harbor run -t "<org/task>@<ref>" -a "<agent>" -m "<model>"
    ```

**自定义注册表**

```bash
    harbor run -d "<dataset>@<version>" \
      --registry-path "<path/to/registry.json>" \
      -a "<agent>" -m "<model>"
    ```

    ```bash
    harbor run -d "<dataset>@<version>" \
      --registry-url "<url/to/registry.json>" \
      -a "<agent>" -m "<model>"
    ```

    请参阅[注册表](/docs/core-concepts/datasets/registries)。

**Git 仓库**

```bash
    harbor run --repo "<org/repo-name>" -p "<path/to/tasks>" \
      -a "<agent>" -m "<model>"
    ```

    请参阅 [Git 仓库](/docs/core-concepts/datasets/git-repos)。

## 配置作业 {#configuring-a-job}

Harbor 通过 CLI 标志配置作业。

**输出**

```bash
    harbor run -p "<path>" -a "<agent>" -m "<model>" \
      -o "<jobs-dir>" --job-name "<job-name>"
    ```

**并发与重试**

```bash
    harbor run -p "<path>" -a "<agent>" -m "<model>" \
      -n "<concurrent>" -k "<attempts>" -r "<retries>"
    ```

**任务过滤**

```bash
    harbor run -p "<path>" -a "<agent>" -m "<model>" \
      -l "<max-tasks>" -i "<some-*-glob-pattern>" -x "<some-name>"
    ```

**沙箱**

```bash
    harbor run -p "<path>" -a "<agent>" -m "<model>" \
      -e "<sandbox>" --allow-agent-host "<host>" --override-memory-mb "<memory-mb>"
    ```

    请参阅[预集成沙箱](/docs/core-concepts/sandboxes/pre-integrated-sandboxes)、[资源](/docs/core-concepts/tasks/resources)和[网络策略](/docs/core-concepts/tasks/network-policies)。

**模拟用户**

```bash
    harbor run -p "<path>" -a "<agent>" -m "<model>" \
      --user-agent "<user-agent>" --user-model "<user-model>"
    ```

    请参阅[模拟用户](/docs/core-concepts/jobs/simulate-a-user)。

运行 `harbor run --help` 可查看全部可用标志。

## Agent {#agents}

Harbor 提供预集成 Agent，并支持自定义 Agent。

运行 `harbor run --help` 可查看可用 Agent。

可以使用 `--ak` 标志配置 Agent。也可以使用 `--model/-m` 标志配置模型。

```bash
harbor run -a "<agent>" -m "<model>" --ak reasoning_effort=high
```

了解更多，请参阅[预集成 Agent](/docs/core-concepts/agents/pre-integrated-agents)或[自定义 Agent](/docs/core-concepts/agents/custom-agents)。

## 配置文件 {#config-files}

在底层，用 CLI 标志配置作业会构建一个 `JobConfig` 对象并传递给运行器。

运行带 `--print-config` 标志的 `harbor run` 可以查看配置，也可以在运行 `harbor run` 后检查 `<job/path>/config.json` 文件。还可以使用 `harbor job init` 创建并保存配置，而不实际运行作业。

对于常用设置，建议创建配置并将其纳入版本控制。

> **说明** 可以将配置与 CLI 标志搭配使用，以覆盖原配置中的值。

示例如下。

```json
{
  "n_attempts": 5,
  "n_concurrent_trials": 100,
  "retry": {
    "max_retries": 3
  },
  "agents": [
    {
      "name": "<agent>",
      "model_name": "<model>"
    }
  ],
  "datasets": [
    {
      "path": "<path>"
    }
  ]
}
```

完整作业配置模式请参阅[配置](/docs/core-concepts/jobs/configs)。

## 在 Harbor Hub 上运行 {#run-on-harbor-hub}

加上 `--launch` 标志即可在 Harbor Hub 上运行作业。

Harbor Hub

* 在云端编排试次
* 强制执行各提供方的并发限制
* 在级联失败时暂停（例如用量限制）
* 在遇到速率限制时退避
* 可通过 UI 或 CLI 访问，用于调试、触发重试、共享结果或监控进度

首先，登录。

```bash
harbor auth login
```

然后，带上 `--launch` 标志运行作业。

```bash
harbor run -d "<org/name>" -a "<agent>" -m "<model>" \
  -n "<concurrent>" --one-off-secret "<name>=<value>" --launch
```

关于评估自定义 Agent 以及基于 Git 的任务和数据集，请参阅[托管作业](/docs/core-concepts/harbor-hub/hosted-jobs)。
