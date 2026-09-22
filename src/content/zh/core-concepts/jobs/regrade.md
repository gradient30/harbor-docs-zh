# 重新评分 {#regrade}

> 针对已记录的输出运行更新后的验证器，无需重新运行 Agent。

> **说明** 当仅验证器发生变化且任务使用
>   独立验证器时，建议使用重新评分。Agent 阶段不会重新运行。

## 重新评分作业 {#regrade-a-job}

```bash
harbor job regrade "jobs/<job>" -p path/to/updated-task -e modal
```

`-p` 接受任务目录或任务目录的父目录。Harbor 按任务名称将任务匹配到
源试次。重复使用 `-p` 可提供多个位置。

## 重新评分试次 {#regrade-a-trial}

```bash
harbor trial regrade "jobs/<job>/<trial>" -p path/to/updated-task -e modal
```

更新后的任务必须与源试次的任务同名。

## 从 Harbor Hub 重新评分 {#regrade-from-harbor-hub}

使用 Hub 作业或试次 UUID，而不是本地路径。

```bash
harbor job regrade deeac1d1-9588-422f-8d8a-d504ec9fae14 -p path/to/updated-task
harbor trial regrade 8f3c2a9e-1b4d-4c6f-9e2a-7d5b8c1f0a3e -p path/to/updated-task
```

## 要求 {#requirements}

* 源是已完成的试次，且 `result.json` 与
  `artifacts/manifest.json` 文件可读。
* 更新后的任务使用[独立验证器](/docs/core-concepts/tasks/separate-verifier)。
* 更新后的验证器所需的每个产物都已由源
  试次收集，并且仍然存在。

源任务使用独立验证器是一种良好实践，因为它
已经基于已记录产物评分。这不是硬性要求：如果共享验证器
源记录了更新后验证器所需的全部输入，也可以使用。
多步骤试次会逐步重新评分，并且必须与
更新后的任务保持相同步骤。

## 工作原理 {#how-it-works}

对每个源试次，Harbor：

1. 将已记录的输出复制到新试次。
2. 构建更新后的验证器环境。
3. 运行验证并写入新结果。

不会启动 Agent 环境，因此重新评分不需要 Agent 凭据，
也不会产生新的 Agent 费用。

## 选项 {#options}

| 标志                   | 说明                                          |
| ---------------------- | ---------------------------------------------------- |
| `-p, --task-path`      | 本地验证器任务。作业可重复指定。            |
| `-t, --task`           | 作业的注册表验证器任务。可重复指定。         |
| `-d, --dataset`        | 作业的验证器任务数据集。可重复指定。      |
| `-e, --env`            | 验证器环境提供方。默认为 `docker`。 |
| `--ve, --verifier-env` | 验证器环境变量。可重复指定。           |
| `--verifier`           | 自定义验证器导入路径。                         |
| `--verifier-kwarg`     | 自定义验证器参数。可重复指定。                |
| `-o`                   | 输出父目录。                             |

作业重新评分还支持 `-n, --n-concurrent` 和 `--job-name`。试次重新评分
支持 `--trial-name`。
