# 更新日志 {#changelog}

> Harbor 的发行说明与产品更新。

## v0.23.0 2026 年 9 月 12 日 {#v0-23-0-september-12-2026}

* **Agent 选项：** 使用 `harbor agent schema <name>` 发现受支持的设置。
    内置 Agent 会在启动沙箱前校验选项。
* **作业配置：** 组合配置文件，并用
    `harbor run --dry-run` 在下载任务或启动环境之前校验运行。
* **新集成：** 新增 Muse Code、Strands 和 FX dev-channel Agent，
    以及 Podman、Runta 和 Kata 沙箱。
* **轨迹：** ATIF v1.8 支持音频内容。Agent 结果现在按模型记录
    token 用量。
* **RewardKit：** Judge 可以接收轨迹中的图像和音频。新增 FX Agent
    judge 以及带符号的加权聚合。
* **多步骤任务：** 为已完成的多步骤试次新增 Hermes 会话恢复和重新评分。
* **托管工作流：** 新增 Hub 作业重命名、所有权转移以及 Agent
    目录发现。

## v0.22.0 2026 年 8 月 22 日 {#v0-22-0-august-22-2026}

* **模拟用户：** 运行多轮评估，由用户 Agent 与主 Agent 通过 ACP 通信。
* **轨迹加载：** 任务可在 Agent 第一轮之前通过
    `trajectory.json` 提供先前的 ATIF 上下文。
* **新 Agent：** 新增 MCode、Junie 和 FX 集成。
* **新沙箱：** 新增 Hyperbrowser 和 Vercel Sandbox 集成。
* **托管工作流：** 新增托管自定义 Agent、可恢复的试次上传，
    以及任务与数据集分享命令。
* **RewardKit：** 新增嵌套维度组，并简化了 Agent judge。

## v0.21.0 2026 年 8 月 10 日 {#v0-21-0-august-10-2026}

* **试次交接：** 在本地恢复已完成的 Claude Code 会话，向 Agent
    询问其运行情况。
* **重新评分：** 使用 `harbor job regrade` 或 `harbor trial regrade`，对已记录的试次运行新验证器，无需重跑 Agent。
* **轨迹加载：** Claude Code 和 Codex 可在运行时加载原生或 ATIF
    轨迹。
* **软件包版本：** 任务和数据集软件包现在会记录版本，并在所选版本已被撤回（yank）时发出警告。
* **新 Agent：** 新增 Cortex Code、Kimi Code 和 Google Antigravity。
* **新沙箱：** 新增 Hugging Face Sandbox。

  > **注意** **破坏性安全变更：** GKE 沙箱不再挂载 Kubernetes
  >     service-account 凭据。需要集群访问权限的工作负载必须显式提供凭据。

> **说明** 本更新日志突出面向用户的稳定版本，并非详尽的提交历史。更早的发行说明见[仓库更新日志](https://github.com/harbor-framework/harbor/blob/main/CHANGELOG.md)、
>   [GitHub releases](https://github.com/harbor-framework/harbor/releases) 或
>   [PyPI 历史](https://pypi.org/project/harbor/#history)。
