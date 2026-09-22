# 不必再打包作业结果 {#stop-zipping-your-job-results}

> 在 Harbor Hub 上上传并分享 Harbor 作业结果，无需再手动打包发送。

[← 全部新闻](/docs/news)

<p className="text-sm text-gray-500 dark:text-gray-400">2026 年 5 月 27 日 · Harbor 团队</p>

不必再打包作业结果。Harbor Hub 现已支持作业结果分享——这是与团队成员或客户分享一次运行结果的最快方式。

上传现有作业目录：

```bash
harbor upload jobs/my-job
```

或者在运行进行期间流式上传结果：

```bash
harbor run -d "my-org/my-dataset@latest" -a "<agent>" -m "<model>" --upload
```

作业结果默认私有，但可以与其他用户或组织共享，或设为公开：

```bash
harbor upload jobs/my-job --public
harbor upload jobs/my-job --share my-org --share-user alice
```

例如，我们使用 Harbor Hub 作业上传构建了 [Terminal-Bench 2.1 排行榜](https://www.tbench.ai/leaderboard/terminal-bench/2.1)。

更多信息见[作业分享文档](/docs/core-concepts/harbor-hub/sharing)。
