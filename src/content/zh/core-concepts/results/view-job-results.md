# 查看作业结果 {#view-job-results}

> 在本地浏览作业、检查试次并比较结果。

Harbor 包含一个用于作业/试次结果的本地 Web 查看器。

## 启动查看器 {#start-the-viewer}

将其指向你的作业目录：

```bash
harbor view jobs
```

Harbor 会从 `8080` 到 `8089` 打开第一个可用端口，并打印查看器 URL。默认值为 `http://127.0.0.1:8080`。

需要时使用其他结果目录或端口：

```bash
harbor view /path/to/jobs --port 9000
```

> **说明** 查看器打开期间请保持该命令运行。

落地页为作业列表。

<Frame caption="浏览作业">
  <img src="https://mintcdn.com/harborframework/dDpeGWFOBtpL8lye/images/viewer-jobs.png?fit=max&auto=format&n=dDpeGWFOBtpL8lye&q=85&s=4074e55192ae1244150c8f534563a84d" alt="Harbor Viewer 作业列表，含搜索、筛选和结果列" width="3840" height="2020" data-path="images/viewer-jobs.png" />
</Frame>

你可以点击进入作业以查看其试次详情。

<Frame caption="检查试次的轨迹、奖励、成本和耗时">
  <img src="https://mintcdn.com/harborframework/dDpeGWFOBtpL8lye/images/viewer-trial-overview.png?fit=max&auto=format&n=dDpeGWFOBtpL8lye&q=85&s=01fd557bf7e1b00a6f3f4c0e872db59d" alt="试次视图，显示奖励、成本、token、耗时和轨迹" width="3840" height="4036" data-path="images/viewer-trial-overview.png" />
</Frame>

## 键盘快捷键 {#keyboard-shortcuts}

| 视图               | 按键                                                     |
| ------------------ | -------------------------------------------------------- |
| 作业和任务列表     | `j` / `k` 导航，`Enter` 打开，`Esc` 返回                 |
| 试次               | `←` / `→` 切换试次                                       |
| 试次               | `Shift` + `←` / `→` 切换作业                             |
| 试次               | `Alt`（macOS 上为 `Option`）+ `←` / `→` 切换选项卡       |

### 试次文件 {#trial-files}

Agent、验证器和产物收集所生成的文件可在试次查看器中使用。查看器显示文件树以及文本文件的预览。你可以下载任意文件。

**Agent**

<Frame caption="Agent 输出">
      <img src="https://mintcdn.com/harborframework/dDpeGWFOBtpL8lye/images/viewer-agent-files.png?fit=max&auto=format&n=dDpeGWFOBtpL8lye&q=85&s=5d5b2ad2a1d84037ae84cac9759f1d56" alt="试次查看器中的 Agent 文件和轨迹 JSON" width="3840" height="2020" data-path="images/viewer-agent-files.png" />
    </Frame>

**验证器**

<Frame caption="验证器输出">
      <img src="https://mintcdn.com/harborframework/dDpeGWFOBtpL8lye/images/viewer-verifier-files.png?fit=max&auto=format&n=dDpeGWFOBtpL8lye&q=85&s=5084051d9f6d5ebf760283ea531d443c" alt="试次查看器中的验证器文件和测试输出" width="3840" height="2020" data-path="images/viewer-verifier-files.png" />
    </Frame>

**产物**

<Frame caption="已收集的产物">
      <img src="https://mintcdn.com/harborframework/dDpeGWFOBtpL8lye/images/viewer-artifacts.png?fit=max&auto=format&n=dDpeGWFOBtpL8lye&q=85&s=fdd9c3412ccdbfe5909fa7b68c8a357b" alt="试次查看器中的产物文件和收集清单" width="3840" height="2020" data-path="images/viewer-artifacts.png" />
    </Frame>

**Config**

<Frame caption="试次配置">
      <img src="https://mintcdn.com/harborframework/dDpeGWFOBtpL8lye/images/viewer-trial-config.png?fit=max&auto=format&n=dDpeGWFOBtpL8lye&q=85&s=110605cd1639b23287925fa7d149db33" alt="试次查看器中已解析的试次配置" width="3840" height="2020" data-path="images/viewer-trial-config.png" />
    </Frame>

**Lock**

<Frame caption="试次锁">
      <img src="https://mintcdn.com/harborframework/dDpeGWFOBtpL8lye/images/viewer-trial-lock.png?fit=max&auto=format&n=dDpeGWFOBtpL8lye&q=85&s=b69b3c99aacdf249448c79289744b0eb" alt="试次查看器中可重放的试次锁" width="3840" height="2020" data-path="images/viewer-trial-lock.png" />
    </Frame>

## 从查看器运行 {#run-from-the-viewer}

点击左上角的 **New run** 来配置并启动作业，无需编写 CLI 命令。或直接访问 [http://127.0.0.1:8080/run](http://127.0.0.1:8080/run)。使用 `←`、`→` 加载上一个或下一个作业配置。

<Frame caption="配置新的运行">
  <img src="https://mintcdn.com/harborframework/dDpeGWFOBtpL8lye/images/viewer-new-run.png?fit=max&auto=format&n=dDpeGWFOBtpL8lye&q=85&s=9c446eda1c0bcb51e3d00b9adad53c51" alt="Harbor Viewer 用于配置和启动新运行的表单" width="3840" height="4462" data-path="images/viewer-new-run.png" />
</Frame>
