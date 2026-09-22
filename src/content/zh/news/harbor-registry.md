# Harbor registry 即将升级 {#the-harbor-registry-is-getting-an-upgrade}

> 推出打包和分发 Harbor 任务与数据集的新方式。

[← 全部新闻](/docs/news)

<p className="text-sm text-gray-500 dark:text-gray-400">2026 年 3 月 27 日 · Harbor 团队</p>

Harbor 的核心原则之一是：环境应可移植，并能在各方之间顺畅流转。我们设计了 Harbor 任务格式，并发布了开源软件包，让用户能够轻松创建环境并运行 rollout。我们创建 Harbor registry，是为了简化 Harbor 任务与数据集的分发。

今天我们宣布这一旅程的下一步：自助式 Harbor registry。

Harbor registry 让分发 Harbor 任务与数据集变得简单。通过 Harbor CLI，你现在可以发布数据并与任何人分享。与 Harbor 的其他功能一样，任务是 registry 的原子单位。数据集是特定版本任务的集合。已注册的数据可以是私有或公开的。

发布任务或数据集只需简单三步：

完整演练见[发布数据集](/docs/core-concepts/harbor-hub/publish)。

## 创建任务或数据集 {#create-a-task-or-dataset}

要创建任务，运行：

```bash
harbor init --task hello/task
```

然后可以编辑任务文件以实现你的任务。

接着可以在同一目录中初始化数据集，运行：

```bash
harbor init --dataset hello/dataset
```

这会创建 `dataset.toml` 清单，并自动将该目录中的任务加入清单。

可以从 registry 或本地添加其他任务，运行：

```bash
harbor dataset add org/task --to "<path/to/dataset>" # or harbor dataset add "<path/to/task>"
```

## 发布到 registry {#publish-to-the-registry}

首先，登录或创建账户：

```bash
harbor auth login
```

然后发布任务：

```bash
harbor publish "<path>" # optionally add --public to make it public
```

Harbor 会自动发布该路径下的任务和数据集。

## 运行任务或数据集 {#run-the-task-or-dataset}

任务发布后，你所在组织中的任何人（若为公开，则任何 Harbor 用户）都可以运行：

```bash
harbor run -d hello/dataset
```

或

```bash
harbor run -t hello/world
```

以运行该数据集或任务。

我们鼓励 Harbor 用户通过 Harbor registry 分发基准和数据集。

我们并不预期任务开发本身发生在 registry 中，而是在现有版本控制平台上进行，然后发布到 registry，类似于 Docker 或 PyPI 的工作方式。

每个已发布的任务或数据集都通过 digest、修订号以及可选标签进行版本化。这最大程度保证可复现性，并强调已注册数据是用于分发的快照或任务与数据集，而不是开发平台。

欢迎对 registry 提出反馈，我们将继续开发工具，以最大化环境的可用性、可移植性与创建效率。
