# 模拟用户 {#simulate-a-user}

> 通过与模拟用户的多轮对话评估 Agent。

模拟用户试次将用户 Agent 与被测目标 Agent 配对。
用户 Agent 接收任务指令。目标 Agent 一开始没有该指令，
通过对话了解任务。Harbor 随后运行验证器。

<Frame caption="模拟用户架构图">
  <img src="https://mintcdn.com/harborframework/l9c_ohETpnOqpDv2/images/acp-simulated-user.png?fit=max&auto=format&n=l9c_ohETpnOqpDv2&q=85&s=8fb08316424c12dbc718b398db9b6189" alt="示意图：用户 Agent 通过 acpx 向目标 Agent 发送提示，两者共享任务工作区" width="2400" height="1440" data-path="images/acp-simulated-user.png" />
</Frame>

## 示例 {#examples}

### Hello world {#hello-world}

```bash
harbor run \
  -t hello-world/hello-world \
  --agent claude-code --model anthropic/claude-sonnet-5 \
  --user-agent claude-code --user-model anthropic/claude-sonnet-5 \
  --bridge acp
```

### 来自 [SWE-Interact](https://arxiv.org/pdf/2606.30573) 的一个示例 {#one-example-from-swe-interact-https-arxiv-org-pdf-2606-30573}

```bash
harbor run \
  -p examples/tasks/deepswe_tomlkit-toml-table-converters \
  --agent claude-code --model anthropic/claude-sonnet-5 \
  --user-agent claude-code --user-model anthropic/claude-sonnet-5 \
  --user-persona-path examples/tasks/deepswe_tomlkit-toml-table-converters/persona.md \
  --bridge acp
```

> **说明** 模拟用户试次可能运行很长时间。此示例大约需要 50
>   分钟。

<Frame caption="查看器中的模拟用户">
  <video controls preload="metadata" className="w-full rounded-xl" src="https://mintcdn.com/harborframework/l9c_ohETpnOqpDv2/videos/simulated-user-demo.mp4?fit=max&auto=format&n=l9c_ohETpnOqpDv2&q=85&s=c611f3c66405ec66cd5d01755718cd5a" data-path="videos/simulated-user-demo.mp4">
    您的浏览器不支持嵌入式视频。
  </video>
</Frame>

## 桥接 {#bridge}

`--bridge acp` 会在任务环境中安装 [acpx](https://github.com/openclaw/acpx)，
并将用户 Agent 连接到目标。用户通过 `acpx prompt` 发送每条
消息。

ACP 桥接支持将 `claude-code` 和 `gemini-cli` 作为**目标 Agent**。其余
[ACP 注册表 Agent](https://agentclientprotocol.com/get-started/registry)
尚未接入 Harbor。**用户 Agent** 可以是**任意** Harbor Agent。

## 用户提示 {#user-prompt}

Harbor 按此
[顺序](https://github.com/harbor-framework/harbor/blob/main/src/harbor/trial/simulated_user.py#L19-L24)构建用户 Agent 的提示：

| 部分                | 默认                                                                                                            | 覆盖               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| 人设             | [默认人设](https://github.com/harbor-framework/harbor/blob/main/src/harbor/trial/simulated_user.py#L14-L17) | `--user-persona-path`  |
| 桥接指令 | [默认 ACP 指令](https://github.com/harbor-framework/harbor/blob/main/src/harbor/bridges/acp.py#L26-L38) | `--bridge-prompt-path` |
| 任务指令    | `instruction.md`                                                                                                   | —                      |

`--user-prompt-template-path` 用 Jinja2 模板替换此布局。
模板必须包含 `{{ bridge_instructions }}` 和 `{{ instruction }}`；
`{{ persona }}` 可选。
