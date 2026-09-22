# 贡献指南 {#contributing}

> 如何向 Harbor 贡献代码与文档。

Harbor 欢迎社区贡献。本指南说明 Harbor 如何管理 issue 和 PR，以及怎样贡献更容易被接受。

# 黄金法则 {#golden-rule}

我们采纳了 [Ghostty 的黄金法则](https://github.com/ghostty-org/ghostty/blob/main/CONTRIBUTING.md)：**你必须理解自己贡献的代码**。可以自由使用编码 Agent，但你有责任证明自己理解这些代码。

如何证明理解：

* 自己撰写 PR 描述
* 记录设计过程，包括方案与权衡
* 提出具有良好抽象的整洁代码（编码 Agent 在没有强力引导时做不到这一点）
* 披露使用了哪些 Agent 以及使用程度

随着模型进步，我们可能会放宽这一约束。在理想世界中，我们可以信任 Agent 而无需亲自理解代码。以我们的经验，目前还不是这样。

# 沟通 {#communication}

代码可以由 Agent 编写。文档、PR 描述、issue 和评论应由人在 AI 辅助下撰写。

书面沟通的一般原则：**你负责第一稿和最后一稿，中间可以使用 Agent**。

# Issues {#issues}

issues 区用于报告缺陷和请求功能。

与我们的沟通标准一致，请自己撰写 issue 描述的第一稿和最后一稿，中间可以使用 Agent。

你必须理解*问题*，但不需要提出解决方案。因为实现比以往更容易，issue 往往比 PR 更合适。

# PRs {#prs}

## Agent、沙箱与插件 {#agents-sandboxes-and-plugins}

我们对集成相当开放。我们只要求至少有一位*用户*提出过该集成需求，因此请提供相应证据（例如让他们留下评论）。

我们对插件稍严格一些，只计划维护需求较高的插件。

## 接口与核心逻辑 {#interfaces-and-core-logic}

未经设计讨论，我们不太可能更改接口或核心逻辑。对 Harbor 格式尤其如此。

要发起设计讨论，请提交包含 RFC 的 PR。RFC 应**简洁**，并由人在 AI 辅助下撰写。如果 RFC 是敷衍生成的内容，我们会关闭它。

RFC 应放在 `rfcs/` 目录中，并遵循现有命名约定。

# CHANGELOG.md {#changelog-md}

对于**重大功能**或**破坏性变更**，在 `CHANGELOG.md` 的 **Unreleased** 下添加一条简洁要点。否则请不要编辑它。
