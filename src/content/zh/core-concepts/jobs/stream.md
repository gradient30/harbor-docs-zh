# 流式查看 {#stream}

> 在作业运行期间跟踪 Agent 操作并浏览沙箱文件。

在作业运行期间查看 Agent 正在做什么，并检查其工作：

1. **流式查看 Agent 日志。** 在**轨迹**选项卡中跟踪 Agent 操作、命令和结果，
   新步骤会随到达而显示。
2. **监视 Agent 目录。** 打开**流式**选项卡，实时浏览沙箱
   文件和生成的产物。沙箱就绪后会自动连接。

<Frame>
  <video controls preload="metadata" className="w-full rounded-xl" src="https://mintcdn.com/harborframework/W_p3l7T0HwYv0Zsi/videos/stream-demo.mp4?fit=max&auto=format&n=W_p3l7T0HwYv0Zsi&q=85&s=27dce4e804f7d1850e39343583434a6d" aria-label="流式选项卡中的沙箱文件，以及轨迹选项卡中实时的 Agent 步骤" data-path="videos/stream-demo.mp4">
    您的浏览器不支持嵌入式视频。
  </video>
</Frame>

在运行中加上 `--stream`。目前支持在 Daytona、Modal、Tensorlake 或本地 Docker 上使用 Claude Code 和 Codex：

```bash
harbor run -t terminal-bench/build-cython-ext \
  -a claude-code -m anthropic/claude-sonnet-5 -e docker --stream
```

在另一个终端中：

```bash
harbor view jobs
```

浏览器和查看器需在同一台机器上运行。
对于 Daytona，请让 Harbor **和查看器**都能使用凭据。

加上 `--no-delete` 可在运行结束后保留沙箱。别忘了之后删除。
