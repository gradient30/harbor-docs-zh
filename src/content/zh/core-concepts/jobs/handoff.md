# 交接 {#handoff}

> 在本地 Agent CLI 中恢复已完成的试次。

`harbor trial handoff` 将已完成试次的原生会话复制到你的本地
Agent CLI，并在当前目录中恢复它。可用于继续
对话，或询问 Agent 关于其工作的问题。

```bash
# Local trial directory {#local-trial-directory}
harbor trial handoff "jobs/<job>/<trial>"

# Harbor Hub trial ID {#harbor-hub-trial-id}
harbor trial handoff 594025f3-7d65-4655-8576-4bee95002eae
```

<Frame caption="将试次交接给 Claude Code">
  <video controls className="w-full aspect-video rounded-xl" src="https://mintcdn.com/harborframework/l9c_ohETpnOqpDv2/videos/handoff-demo.mp4?fit=max&auto=format&n=l9c_ohETpnOqpDv2&q=85&s=d07645a30c2c0555004caa485aea86ad" data-path="videos/handoff-demo.mp4">
    您的浏览器不支持视频播放。
  </video>
</Frame>

对于 Hub 试次 ID，Harbor 会先下载该试次。对于 `claude-code`，交接
会将会话复制到本地 Claude Code 存储，并运行
`claude --resume <session-id>`。

## 要求 {#requirements}

* Agent 支持 `capabilities.handoff`。目前只有 `claude-code` 支持。
* Agent CLI 已在本地安装。对于 `claude-code`，`claude` 必须在 `PATH` 中。
* 试次只包含一个会话。不支持多会话试次。

## 会恢复什么 {#what-is-restored}

交接恢复的是原生会话历史，而不是试次沙箱中的文件。
若要为新的 Harbor 运行做初始输入，请参阅[加载轨迹](/docs/core-concepts/jobs/loading-trajectories)。
