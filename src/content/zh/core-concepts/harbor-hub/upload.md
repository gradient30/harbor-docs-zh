# 上传 {#upload}

> 将作业结果上传到 Hub。

Harbor Hub 可用于存储、查看和共享作业结果，包括其中的试次和轨迹。

## 上传 {#uploading}

先登录，然后将本地作业目录上传：

```bash
harbor auth login
harbor upload "<job-path>"
```

该目录必须包含 `config.json` 和 `result.json`。

若要在运行过程中于试次完成时立即上传，添加 `--upload`：

```bash
harbor run ... --upload
```

如果上传中断或部分试次未能上传，重新运行 `harbor upload "<job-path>"`。已经上传的试次会被跳过。

## 可见性 {#visibility}

新上传默认私有。使用 `--public` 将作业设为公开，或使用 `--private` 将其设为私有：

```bash
harbor upload "<job-path>" --public
harbor upload "<job-path>" --private
harbor run ... --upload --public
```

对于已经上传的作业，这些标志会更新其可见性。省略这些标志则保留当前可见性。

## 所有权与共享 {#ownership-and-sharing}

作业默认归属于你的个人组织。对新上传使用 `--org` 选择所属组织：

```bash
harbor upload "<job-path>" --org "<org>"
```

重新上传无法更改作业的所有者。要将作业共享给其他组织，使用 `--share`：

```bash
harbor upload "<job-path>" --share "<org>"
harbor run ... --upload --share "<org>"
```

重复使用 `--share` 可共享给多个组织。与你不属于的组织共享时需要确认；在脚本中使用 `--yes` 进行确认。

上传后的访问管理请参见 [共享](/docs/core-concepts/harbor-hub/sharing)，检索结果请参见 [下载](/docs/core-concepts/harbor-hub/download)。
