# 下载 {#download}

> 下载数据集、任务、作业、试次和轨迹。

Harbor Hub 是数据集、任务、作业、试次和轨迹的共享存储层。

用户可以使用以下命令将数据上传到 Hub。

```bash
harbor run ... --upload
harbor upload "<job>"
harbor publish "<dataset>"
```

从 Hub 下载数据集和任务使用 `harbor download` 命令。

```bash
harbor download "<dataset>"
harbor download "<task>"
```

用户也可以使用以下命令从 Hub 下载作业、试次和轨迹。

```bash
harbor job download "<job-id>"
harbor trial download "<trial-id>"
harbor trial download "<trial-id>" --trajectory
```

如果希望下载中包含重试的试次，请加上 `--include-retries` 标志。
