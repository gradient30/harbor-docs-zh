# ASP {#asp}

> Agent Sandbox Protocol：通过 SSH 在远程沙箱中运行任意 Agent harness 的工具。

> **注意** 本页为 RFC 草稿。欢迎在 [PR #3023](https://github.com/harbor-framework/harbor/pull/3023) 上发表评论。

<img src="https://mintcdn.com/harborframework/WYOkng7EqHA2lqCH/images/asp-managed-agents-edge.png?fit=max&auto=format&n=WYOkng7EqHA2lqCH&q=85&s=118e9dcca3c66ff02173672a412433b7" alt="ASP 是 managed-agents 架构中 harness 到沙箱的边界" width="1080" height="1080" data-path="images/asp-managed-agents-edge.png" />

最初由 [@alexgshaw](https://github.com/alexgshaw) 提出并共同设计

## 要点 {#tl-dr}

* ASP 让任意 Agent harness 通过 .asp.json 在远程沙箱中执行其工具；**SSH** 是第一种传输方式，因为它已经提供了命令执行、文件传输和认证，而每个沙箱都可以暴露这些能力。
* 实现了 ASP 的 Agent **不会意识到**自己在远程机器上操作：它的所有工具都在沙箱中执行，因此沙箱是它能观察到的唯一环境。
* Agent 工具有两层：面向模型的策略层（模式、截断、分页），以及执行原始 I/O 的机制层；ASP 只将机制从本地 I/O 替换为通过网络进行的 I/O，策略层保持不变。
* 要支持 ASP，现有 Agent 只需两处改动：检测 `.asp.json`，以及将其工具的原始 I/O（read、write、exec）通过已配置的传输方式路由，而不是走本机。
  <img src="https://mintcdn.com/harborframework/WYOkng7EqHA2lqCH/images/asp-architecture-terse-labels.svg?fit=max&auto=format&n=WYOkng7EqHA2lqCH&q=85&s=90433785e97b1853a3a68b3d8ae229e0" alt="alt text" width="680" height="542" data-path="images/asp-architecture-terse-labels.svg" />

## 目标 {#goal}

*让大脑与双手解耦！* 标准化 Agent harness（**大脑**：Agent 循环、LLM 调用、凭据）与其工具执行所在沙箱（**双手**：文件系统、shell）之间的接口。任何 harness 都应通过一份声明式配置文件和一种标准传输方式驱动任意沙箱，且 harness 中无需包含提供商 SDK。

## 背景 {#background}

编码 Agent 已无处不在，非编码 Agent 也越来越依赖执行环境。然而，大多数 Agent 都在**同一环境**中运行并执行代码。在低信任或云场景下，两者最好**分离**，正如 [Vercel 关于 agentic 架构中安全边界的文章](https://vercel.com/blog/security-boundaries-in-agentic-architectures) 所论证的：凭据和宿主机信息远离 Agent 可及范围，Agent 无法 OOM 或杀死自己的运行时，基础设施也可以按侧分别调优，例如在沙箱中禁用互联网，同时让运行时保持连通。

<img src="https://mintcdn.com/harborframework/WYOkng7EqHA2lqCH/images/asp-current.png?fit=max&auto=format&n=WYOkng7EqHA2lqCH&q=85&s=ceb5c8c977ca0fb704573ae5c519725c" alt="现状" width="1278" height="418" data-path="images/asp-current.png" />

今天，只有 Agent 自己的开发者才能完成这种拆分，方法是重写其执行工具以路由到沙箱。所有在现有 Agent（Claude Code、Codex、pi）之上构建的人都会继承其工具，无法解耦。共享环境会损害可复现性，而沙箱的互联网访问是奖励破解的主要渠道；但只要 Agent 运行在沙箱内部，切断互联网就不可能，于是开发者只能退回到脆弱的模型端点允许列表。

[Anthropic 的 managed agents](https://www.anthropic.com/engineering/managed-agents) 将 Agent 系统分解为会话、编排、harness、沙箱、资源和工具，并通过在沙箱内安装环境 worker 来实现拆分，这会将沙箱与该 harness 耦合。提供商 SDK 集成则相反，会将 harness 与单一提供商耦合。

另一方面，[SSH](https://en.wikipedia.org/wiki/Secure_Shell) 已经实现了缺失接口所需的原语。它可以运行命令、通过 SFTP 传输文件，并处理认证与主机校验。许多沙箱提供商已经可以通过 SSH 访问，或可以配置为这种方式。所缺的是一套共享约定：告诉 harness 将其工具远程运行，并描述如何连接。**ASP 提供了这套约定。**

## 范围 {#scope}

以 managed-agents 组件表衡量，ASP **有意保持狭小**。它只标准化 harness 到沙箱这一边界，并且在该组件接口中只覆盖 `execute(name, input) -> String`。

`provision({resources})` 这一半被明确排除在**范围之外**，供给是编排器的职责（例如 [harbor](https://github.com/harbor-framework/harbor)），在 Agent 启动之前由 [daytona\_setup.py](https://github.com/kobe0938/harbor/blob/asp/asp/daytona_setup.py) 和 [docker\_setup.py](https://github.com/kobe0938/harbor/blob/asp/asp/docker_setup.py) 等工具完成，Agent 不得在运行时自行供给。会话、编排、资源和工具定义仍由 harness 既有逻辑负责。

<img src="https://mintcdn.com/harborframework/WYOkng7EqHA2lqCH/images/asp-managed-agents-interface.png?fit=max&auto=format&n=WYOkng7EqHA2lqCH&q=85&s=032809bbdd45ba7d0c10cc909b544fe8" alt="在沙箱接口中，ASP 采用 execute 并排除 provision" width="1640" height="1596" data-path="images/asp-managed-agents-interface.png" />

*ASP 采用 execute，并有意排除 provision。*

## 契约：.asp.json {#the-contract-asp-json}

完整定义见 [asp.schema.json](https://github.com/kobe0938/harbor/blob/asp/asp/asp.schema.json)。示例：[daytona](https://github.com/kobe0938/harbor/blob/asp/asp/examples/daytona/.asp.json) 和 [docker](https://github.com/kobe0938/harbor/blob/asp/asp/examples/docker/.asp.json)。

| 字段                                | 含义                                                                               |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| `version`                           | `"0"`                                                                              |
| `transport`                         | `"ssh"`（第一种受支持的传输方式；该字段存在是为了日后可添加更多方式）              |
| `connection.host`、`.port`、`.user` | SSH 端点；提供商可以将访问令牌编码为用户名                                         |
| `connection.identity`               | 客户端私钥，按环境变量名或文件路径指定；在令牌认证已足够时可省略                   |
| `connection.host_key`               | 固定的服务器公钥；省略则表示首次使用时信任                                         |
| `workspace`                         | 相对工具路径所解析到的绝对沙箱路径                                                 |

找到 `.asp.json`（工作目录，然后是父目录）的 harness 会将其工具 I/O 绑定到沙箱。工具调用是**无状态**的，每条命令使用全新的 shell，文件系统持久。

Agent **不会感知**这一切。它不会被告知传输方式，即便知道也无法据此行动：它的所有工具都在远程执行，因此没有能够触及 harness 所在机器的动词，也无法检查 harness 运行的环境。它能观察到的唯一环境就是沙箱本身。该边界由能力强制执行，而非由策略或提示词约束。

### 架构 {#architecture}

Agent 的工具分为两层。

策略层面向模型：工具模式（path、offset、limit）、截断限制、分页。

机制层是其下少量原始 I/O 函数的接缝（read、write、exec）。

ASP 只替换机制，本地 I/O 变为通过传输方式进行的相同 I/O；策略层仍在 harness 中不变地运行，因此模型看到的工具行为完全相同，现有提示词和评测可以沿用。

<img src="https://mintcdn.com/harborframework/WYOkng7EqHA2lqCH/images/asp-diagram.png?fit=max&auto=format&n=WYOkng7EqHA2lqCH&q=85&s=ba8b77de56c7340491b13185e2a317a8" alt="ASP 示意图" width="2734" height="722" data-path="images/asp-diagram.png" />

## 两个 Agent 的 ASP 示例 {#two-agent-asp-examples}

* [一个普通的 Python Agent](https://github.com/kobe0938/harbor/blob/asp/asp/agent.py)，使用 asyncssh SDK
* [一个扩展](https://github.com/kobe0938/harbor/blob/asp/asp/pi-asp.ts)，面向名为 [pi](https://github.com/earendil-works/pi) 的最小 harness

<img src="https://mintcdn.com/harborframework/WYOkng7EqHA2lqCH/images/asp-agent-run.png?fit=max&auto=format&n=WYOkng7EqHA2lqCH&q=85&s=971f97ae172c23b57e113b0cc639d2fb" alt="最小 Python Agent 通过 ASP 在 Daytona 沙箱中运行任务" width="2164" height="473" data-path="images/asp-agent-run.png" />

*该普通 Agent 通过 ASP 在 Daytona 中运行*

## 互联网可配置性 {#internet-configurability}

ASP 可以干净地与关闭互联网的沙箱组合。SSH 是入站：有状态防火墙允许 harness 发起的连接上的应答，同时丢弃沙箱启动的每一条连接，因此即便所有出站都已切断，工具仍能正常工作（已在 Daytona 和 Docker 上验证）。

## 后续步骤 {#future-steps}

很快，我们计划加入 terminus-slim，这是 [Terminus](https://github.com/harbor-framework/terminal-bench-1/blob/main/terminal_bench/agents/terminus_1.py) 的 ASP 版本。ASP v0 从 SSH 开始，但该格式日后可以支持 stdio 和 HTTP 等传输方式。未来，一个意见更明确的版本可以定义与传输无关的操作和类型，用于**生成 SDK**。

这是 v0 草稿，因此这里的一切（包括模式）在 v0.1 或 v1 中都**可能变更**。**欢迎评论！**

## 支持矩阵附录 {#appendix-for-support-matrix}

SSH SDK

| 语言       | 库                                                 | 说明                                                                                                             | 本 MVP 中已验证                                                      |
| ---------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Python     | [asyncssh](https://github.com/ronf/asyncssh)       | 异步，SFTP 支持干净                                                                                              | [是](https://github.com/kobe0938/harbor/blob/asp/asp/agent.py)       |
| Python     | [paramiko](https://github.com/paramiko/paramiko)   | 同步，成熟                                                                                                       | 否                                                                   |
| TypeScript | [ssh2](https://github.com/mscdex/ssh2)             | 标准 Node 库；[ssh2-sftp-client](https://github.com/theophilusx/ssh2-sftp-client) 提供基于 Promise 的 SFTP       | 否                                                                   |
| TypeScript | [node-ssh](https://github.com/steelbrain/node-ssh) | ssh2 的 Promise 封装                                                                                             | 否                                                                   |
| Go         | [ssh](https://pkg.go.dev/golang.org/x/crypto/ssh)  | 官方扩展标准库                                                                                                   | 否                                                                   |
| Rust       | [russh](https://github.com/Eugeny/russh)           | 异步（tokio），包含 SFTP                                                                                         | 否                                                                   |
| 任意       | [OpenSSH client](https://www.openssh.com/)         | 无依赖；ControlMaster 多路复用                                                                                   | [是](https://github.com/kobe0938/harbor/blob/asp/asp/pi-asp.ts)      |

沙箱提供商

| 提供商          | 说明                                                            | 本 MVP 中已验证                                                                                                   |
| --------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Docker          | 容器中运行 sshd，发布端口                                       | [是](https://github.com/kobe0938/harbor/blob/asp/asp/examples/docker/.asp.json)，含出站阻断                        |
| Apple Container | 容器中运行 sshd，可路由的 VM IP                                 | 是                                                                                                                |
| Daytona         | 托管网关，令牌作为用户名                                        | [是](https://github.com/kobe0938/harbor/blob/asp/asp/examples/daytona/.asp.json)，含 SFTP 和 `network_block_all` |
| E2B             | 已文档化，通过 websocat ProxyCommand 经 WSS，自定义模板         | 否；需要 `proxyCommand` 字段                                                                                      |
| Modal           | 无原生 SSH 端点；sshd 加上 Modal tunnel 应当可用                | 否                                                                                                                |
| GKE             | 无原生 SSH 端点；pod 中运行 sshd 并加上 port-forward            | 否                                                                                                                |

## 参考文献 {#references}

* [https://www.daytona.io/docs/en/guides/claude/claude-managed-agents/](https://www.daytona.io/docs/en/guides/claude/claude-managed-agents/)
* [https://www.daytona.io/docs/en/guides/pi/pi-extension/](https://www.daytona.io/docs/en/guides/pi/pi-extension/)
* [https://www.anthropic.com/engineering/managed-agents](https://www.anthropic.com/engineering/managed-agents)
* [https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes#how-it-differs-from-cloud-environments](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes#how-it-differs-from-cloud-environments)
* [https://agentclientprotocol.com/protocol/v1/terminals#checking-support](https://agentclientprotocol.com/protocol/v1/terminals#checking-support)
* [https://modelcontextprotocol.io/examples](https://modelcontextprotocol.io/examples)
* [https://github.com/daytona/integrations/blob/main/packages/pi-extension/src/ops.ts](https://github.com/daytona/integrations/blob/main/packages/pi-extension/src/ops.ts)
* [https://opencode.ai/docs/tools/](https://opencode.ai/docs/tools/)
* [https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/ssh.ts](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/ssh.ts)
* [https://vercel.com/blog/security-boundaries-in-agentic-architectures](https://vercel.com/blog/security-boundaries-in-agentic-architectures)
