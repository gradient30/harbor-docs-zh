# 新闻 {#news}

## 2026 年 9 月 16 日 {#september-16-2026}

## 全新 Harbor 文档 {#new-harbor-docs}

  Harbor 文档现已覆盖此前未记录的功能，例如模拟用户、流式传输和重新评分，并向编码 Agent 暴露 MCP。
  [阅读更多。](https://x.com/alexgshaw/status/2100296774955237438)

## 2026 年 9 月 14 日 {#september-14-2026}

## 实时观察 Agent 运行 {#watch-agents-as-they-run}

  试次进行期间，Harbor 会流式传输 Agent 的轨迹和沙箱文件。
  [阅读更多。](https://x.com/kobe0938/status/2099537332462596436)

## 2026 年 8 月 29 日 {#august-29-2026}

## Terminal-Bench 4.0 {#terminal-bench-4-0}

  Terminal-Bench 4.0 校准任务资源、应用任务修复，并在 Harbor Hub 上移除已饱和的任务。
  [阅读更多。](https://x.com/ryan_marten/status/2093523335972036657)

## 2026 年 8 月 27 日 {#august-27-2026}

## Terminal-Bench-Science {#terminal-bench-science}

  由斯坦福主导的 Harbor 科学研究工作流基准：70 项任务，覆盖生命、物理、数学、地球与工程科学，Opus 5 约 30%。
  [阅读更多。](https://x.com/StevenDillmann/status/2093041660615852448)

## 2026 年 8 月 25 日 {#august-25-2026}

## 模拟用户 {#simulated-users}

  用户 Agent 可以扮演人类，通过 ACP 以多轮对话驱动目标 Agent。
  [阅读更多。](https://x.com/kobe0938/status/2092298110391472430)

## 2026 年 8 月 13 日 {#august-13-2026}

## 无需重跑 Agent 即可重新评分 {#regrade-without-rerunning-the-agent}

  `harbor regrade` 对已记录的试次运行新的评分器，便于迭代验证器而无需再支付一次 Agent 会话的费用。
  [阅读更多。](https://x.com/kobe0938/status/2087941751470170411)

## 2026 年 8 月 11 日 {#august-11-2026}

## 将先前轨迹加载到新评估中 {#load-a-previous-trajectory-into-a-new-eval}

  `--load-trajectory` 用先前的 Claude Code、Codex 或 ATIF 会话为 Harbor 运行提供种子，使上下文进入下一次试次。
  [阅读更多。](https://x.com/kobe0938/status/2087273674818920768)

## 2026 年 8 月 10 日 {#august-10-2026}

## 评估结束后访谈 Agent {#interview-an-agent-after-the-eval}

  `harbor trial handoff` 将已完成的试次拉入本地 Claude Code，便于检查工作并追问。
  [阅读更多。](https://x.com/kobe0938/status/2086905724295422008)

## 2026 年 7 月 23 日 {#july-23-2026}

## Terminal-Bench 3.0（原 Frontier-Bench） {#terminal-bench-3-0-formerly-frontier-bench}

  来自 Harbor 团队的 74 项持续演进基准，最佳 Agent 得分约 34%，可通过 Harbor CLI 和 Hub 运行。
  [阅读更多。](https://x.com/ryan_marten/status/2080322620248281252)

  ## 持续基准

  基准不是静态产物。它们是软件，我们应该像维护软件一样维护它们。
  [阅读更多。](https://x.com/ryan_marten/status/2080321791361527843)

## 2026 年 7 月 9 日 {#july-9-2026}

## Harbor Hub 上的托管排行榜 {#hosted-leaderboards-on-harbor-hub}

  在 Harbor Hub 上发布数据集排行榜，包括 Terminal-Bench 2.1 上的奖励黑客（reward hacking）检测。
  [阅读更多。](https://x.com/alexgshaw/status/2075273684424790516)

## 2026 年 7 月 8 日 {#july-8-2026}

## Harbor-Index {#harbor-index}

  将最难的 Harbor 任务组合成 82 项元基准，发布时没有任何 Agent 超过 30%。
  [阅读更多。](https://x.com/LinShi592021/status/2074722423568736717)

## 2026 年 7 月 3 日 {#july-3-2026}

## 推出 harbor exec {#introducing-harbor-exec}

  在沙箱上运行 Agent 式 map-reduce，用于分析轨迹、挖掘会话，以及在已完成作业中搜索。
  [阅读更多。](https://x.com/alexgshaw/status/2073086868565196946)

## 2026 年 6 月 18 日 {#june-18-2026}

## Sidecar 环境 {#sidecar-environments}

  从 sidecar 收集产物、在 sidecar 中运行验证，以及在任意服务中执行预验证命令。
  [阅读更多。](https://x.com/harborframework/status/2067656083825373652)

## 2026 年 6 月 17 日 {#june-17-2026}

## 原生评估 ACP Agent {#evaluate-acp-agents-natively}

  Harbor 可通过 `harbor run --agent acp:junie` 运行 ACP registry 中的 Agent，目前新增 36 个 Agent，未来每个进入 registry 的 ACP Agent 也可立即使用。
  [阅读更多。](https://x.com/harborframework/status/2067314067803701255)

## 2026 年 5 月 27 日 {#may-27-2026}

## 不必再打包作业结果 {#stop-zipping-your-job-results}

  在 Harbor Hub 上上传并分享 Harbor 作业结果，无需再手动打包发送。
  [阅读更多。](/docs/news/job-result-sharing)

## 2026 年 5 月 15 日 {#may-15-2026}

## 在独立沙箱中验证 Harbor 任务 {#verify-harbor-tasks-in-a-separate-sandbox}

  在与 Agent 分离的沙箱中运行任务验证，并在两个环境之间显式交接产物。
  [阅读更多。](/docs/news/separate-verifier-sandboxes)

## 2026 年 4 月 23 日 {#april-23-2026}

## 多步骤任务 {#multi-step-tasks}

  Harbor 任务格式的首次重大扩展：任务拆分为顺序步骤，每步有自己的指令和验证器。
  [阅读更多。](/docs/news/multi-step-tasks)

## 2026 年 3 月 27 日 {#march-27-2026}

## 探索 Harbor cookbook {#explore-the-harbor-cookbook}

  用于构建 Harbor 任务和优化循环的配方。
  [阅读更多。](/docs/news/harbor-cookbook)

  ## Harbor registry 即将升级

  打包和分发 Harbor 任务与数据集的新方式。
  [阅读更多。](/docs/news/harbor-registry)
