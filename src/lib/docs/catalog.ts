export type DocLink = {
  slug: string;
  title: string;
  description: string;
  href: string;
};

export type NavNode =
  | { kind: "label"; title: string }
  | { kind: "link"; slug: string; title: string; href: string }
  | { kind: "folder"; title: string; children: DocLink[] };

export const PAGES: DocLink[] = [
  { slug: "quick-guide", title: "快速手册", description: "日常最高频：安装、跑作业、看结果、写任务。", href: "/docs/quick-guide" },
  { slug: "updates", title: "同步日志", description: "官网每次变动后，这里单独记一笔：改了什么、中文站在哪一页。", href: "/docs/updates" },
  { slug: "architecture", title: "本站架构", description: "手册怎么拼起来，以及每日同步如何驱动汉化。", href: "/docs/architecture" },
  { slug: "sitemap", title: "对照表", description: "官网每一页的指纹；SHA 一变就能定位中文站要改哪一页。", href: "/docs/sitemap" },
  { slug: "changelog", title: "官方更新日志", description: "Harbor 稳定版发行说明。", href: "/docs/changelog" },
  { slug: "index", title: "Harbor 是什么", description: "任意 Agent、任意模型、任意任务、任意沙箱，并行运行。", href: "/" },
  { slug: "getting-started/quick-start", title: "快速开始", description: "安装 Harbor 并跑通第一次作业。", href: "/docs/getting-started/quick-start" },
  { slug: "getting-started/installation", title: "安装", description: "用 uv 或 pip 安装 Harbor，并配置沙箱。", href: "/docs/getting-started/installation" },
  { slug: "core-concepts/index", title: "核心概念", description: "任务、数据集、Agent、沙箱、验证器、试次、作业与轨迹。", href: "/docs/core-concepts/index" },
  { slug: "core-concepts/tasks/overview", title: "任务概览", description: "一条指令、一套环境、一份测试脚本。", href: "/docs/core-concepts/tasks/overview" },
  { slug: "core-concepts/tasks/instruction", title: "指令", description: "向 Agent 说明任务目标。", href: "/docs/core-concepts/tasks/instruction" },
  { slug: "core-concepts/tasks/configuration", title: "任务配置", description: "task.toml 的元数据与完整字段。", href: "/docs/core-concepts/tasks/configuration" },
  { slug: "core-concepts/tasks/environment", title: "环境", description: "任务运行的沙箱环境。", href: "/docs/core-concepts/tasks/environment" },
  { slug: "core-concepts/tasks/skills", title: "任务 Skills", description: "把可复用的 Agent 指令打进任务。", href: "/docs/core-concepts/tasks/skills" },
  { slug: "core-concepts/tasks/solution", title: "题解", description: "可选的 Oracle 解法。", href: "/docs/core-concepts/tasks/solution" },
  { slug: "core-concepts/tasks/verifier", title: "验证器", description: "给 Agent 的工作打分并写出奖励。", href: "/docs/core-concepts/tasks/verifier" },
  { slug: "core-concepts/tasks/artifacts", title: "产物", description: "声明要保留并交给验证器的输出。", href: "/docs/core-concepts/tasks/artifacts" },
  { slug: "core-concepts/tasks/resources", title: "资源", description: "CPU、内存、GPU 等资源声明。", href: "/docs/core-concepts/tasks/resources" },
  { slug: "core-concepts/tasks/multi-container", title: "多容器", description: "用 Compose 定义 sidecar 服务。", href: "/docs/core-concepts/tasks/multi-container" },
  { slug: "core-concepts/tasks/network-policies", title: "网络策略", description: "限制 Agent 与验证器的网络访问。", href: "/docs/core-concepts/tasks/network-policies" },
  { slug: "core-concepts/tasks/multi-step", title: "多步骤任务", description: "按里程碑拆分指令与验证。", href: "/docs/core-concepts/tasks/multi-step" },
  { slug: "core-concepts/tasks/separate-verifier", title: "独立验证器", description: "在单独沙箱中跑验证。", href: "/docs/core-concepts/tasks/separate-verifier" },
  { slug: "core-concepts/tasks/windows-tasks", title: "Windows 任务", description: "在 Harbor 中运行 Windows 任务（官网占位页）。", href: "/docs/core-concepts/tasks/windows-tasks" },
  { slug: "core-concepts/datasets/datasets", title: "数据集", description: "用于评测与训练的任务集合。", href: "/docs/core-concepts/datasets/datasets" },
  { slug: "core-concepts/datasets/create-a-dataset", title: "创建数据集", description: "把 Harbor 任务打成数据集。", href: "/docs/core-concepts/datasets/create-a-dataset" },
  { slug: "core-concepts/datasets/git-repos", title: "Git 仓库", description: "从 Git 仓库跑数据集。", href: "/docs/core-concepts/datasets/git-repos" },
  { slug: "core-concepts/datasets/registries", title: "注册表", description: "自定义数据集注册表。", href: "/docs/core-concepts/datasets/registries" },
  { slug: "core-concepts/datasets/metrics", title: "指标", description: "自定义数据集指标。", href: "/docs/core-concepts/datasets/metrics" },
  { slug: "core-concepts/jobs/run-a-job", title: "运行作业", description: "在 Harbor 中启动一次作业。", href: "/docs/core-concepts/jobs/run-a-job" },
  { slug: "core-concepts/jobs/configs", title: "作业配置", description: "作业配置的完整 schema。", href: "/docs/core-concepts/jobs/configs" },
  { slug: "core-concepts/jobs/environment-variables", title: "环境变量", description: "控制哪些变量进入 Harbor、沙箱、Agent 和验证器。", href: "/docs/core-concepts/jobs/environment-variables" },
  { slug: "core-concepts/jobs/skills", title: "作业 Skills", description: "从本地目录或 Git 注入可复用指令。", href: "/docs/core-concepts/jobs/skills" },
  { slug: "core-concepts/jobs/loading-trajectories", title: "加载轨迹", description: "把历史轨迹载入 Agent 会话。", href: "/docs/core-concepts/jobs/loading-trajectories" },
  { slug: "core-concepts/jobs/handoff", title: "作业交接", description: "在本地 Agent CLI 中接续已完成的试次。", href: "/docs/core-concepts/jobs/handoff" },
  { slug: "core-concepts/jobs/regrade", title: "重新评分", description: "用新验证器重跑已记录的输出。", href: "/docs/core-concepts/jobs/regrade" },
  { slug: "core-concepts/jobs/simulate-a-user", title: "模拟用户", description: "用模拟用户做多轮对话评测。", href: "/docs/core-concepts/jobs/simulate-a-user" },
  { slug: "core-concepts/jobs/custom-verifiers", title: "自定义验证器", description: "自定义作业验证流程。", href: "/docs/core-concepts/jobs/custom-verifiers" },
  { slug: "core-concepts/jobs/artifact-collection", title: "产物收集", description: "保留试次中产生的文件。", href: "/docs/core-concepts/jobs/artifact-collection" },
  { slug: "core-concepts/jobs/stream", title: "实时流", description: "作业进行中跟踪 Agent 动作并浏览沙箱文件。", href: "/docs/core-concepts/jobs/stream" },
  { slug: "core-concepts/agents/pre-integrated-agents", title: "预集成 Agent", description: "Harbor 开箱支持的 Agent。", href: "/docs/core-concepts/agents/pre-integrated-agents" },
  { slug: "core-concepts/agents/acp", title: "ACP", description: "从 Agent Client Protocol 注册表运行 Agent。", href: "/docs/core-concepts/agents/acp" },
  { slug: "core-concepts/agents/custom-agents", title: "自定义 Agent", description: "把你自己的 Agent 接入 Harbor。", href: "/docs/core-concepts/agents/custom-agents" },
  { slug: "core-concepts/agents/atif", title: "ATIF", description: "用标准 JSON 记录和交换轨迹。", href: "/docs/core-concepts/agents/atif" },
  { slug: "core-concepts/sandboxes/pre-integrated-sandboxes", title: "预集成沙箱", description: "本地或远程环境。", href: "/docs/core-concepts/sandboxes/pre-integrated-sandboxes" },
  { slug: "core-concepts/sandboxes/asp", title: "ASP", description: "通过 SSH 在远程沙箱中跑 Agent 工具。", href: "/docs/core-concepts/sandboxes/asp" },
  { slug: "core-concepts/sandboxes/custom-sandboxes", title: "自定义沙箱", description: "接入你自己的沙箱实现。", href: "/docs/core-concepts/sandboxes/custom-sandboxes" },
  { slug: "core-concepts/plugins/existing-plugins", title: "现有插件", description: "把作业接到可观测平台。", href: "/docs/core-concepts/plugins/existing-plugins" },
  { slug: "core-concepts/plugins/custom-plugins", title: "自定义插件", description: "在作业和试次生命周期上跑自定义逻辑。", href: "/docs/core-concepts/plugins/custom-plugins" },
  { slug: "core-concepts/results/view-job-results", title: "查看作业结果", description: "本地浏览作业、检查试次、对比结果。", href: "/docs/core-concepts/results/view-job-results" },
  { slug: "core-concepts/results/handoff", title: "结果交接", description: "试次结束后访谈 Agent。", href: "/docs/core-concepts/results/handoff" },
  { slug: "core-concepts/harbor-hub/publish", title: "发布", description: "把数据集和任务发布到 Hub。", href: "/docs/core-concepts/harbor-hub/publish" },
  { slug: "core-concepts/harbor-hub/upload", title: "上传", description: "把作业结果上传到 Hub。", href: "/docs/core-concepts/harbor-hub/upload" },
  { slug: "core-concepts/harbor-hub/download", title: "下载", description: "下载数据集、任务、作业、试次和轨迹。", href: "/docs/core-concepts/harbor-hub/download" },
  { slug: "core-concepts/harbor-hub/hosted-jobs", title: "托管作业", description: "提交托管作业并查看状态。", href: "/docs/core-concepts/harbor-hub/hosted-jobs" },
  { slug: "core-concepts/harbor-hub/leaderboards", title: "排行榜", description: "在 Harbor Hub 上创建、排名和分享评测。", href: "/docs/core-concepts/harbor-hub/leaderboards" },
  { slug: "core-concepts/harbor-hub/sharing", title: "分享", description: "分享任务、数据集和作业。", href: "/docs/core-concepts/harbor-hub/sharing" },
  { slug: "core-concepts/hosted-harbor/index", title: "托管 Harbor", description: "在 Hub 上启动作业。", href: "/docs/core-concepts/hosted-harbor/index" },
  { slug: "core-concepts/hosted-harbor/api-key", title: "Harbor Hub API 密钥", description: "创建 API 密钥。", href: "/docs/core-concepts/hosted-harbor/api-key" },
  { slug: "core-concepts/hosted-harbor/web-ui", title: "Web UI", description: "在 Hub 上添加密钥并启动远程 rollout。", href: "/docs/core-concepts/hosted-harbor/web-ui" },
  { slug: "core-concepts/hosted-harbor/cli", title: "托管 CLI", description: "用 harbor CLI 启动远程 rollout、浏览作业和密钥。", href: "/docs/core-concepts/hosted-harbor/cli" },
  { slug: "core-concepts/hosted-harbor/api", title: "API 概览", description: "远程 rollout API 的基址、鉴权和错误形态。", href: "/docs/core-concepts/hosted-harbor/api" },
  { slug: "core-concepts/hosted-harbor/submitting-jobs", title: "提交作业", description: "用 POST /job-submit 启动远程 rollout。", href: "/docs/core-concepts/hosted-harbor/submitting-jobs" },
  { slug: "core-concepts/hosted-harbor/custom-agents", title: "托管自定义 Agent", description: "从 GitHub 仓库运行 ACP Agent。", href: "/docs/core-concepts/hosted-harbor/custom-agents" },
  { slug: "core-concepts/hosted-harbor/secrets", title: "管理密钥", description: "存储、列出、撤销并预检托管密钥。", href: "/docs/core-concepts/hosted-harbor/secrets" },
  { slug: "core-concepts/hosted-harbor/registry-credentials", title: "镜像仓库凭证", description: "拉取私有任务镜像的凭证。", href: "/docs/core-concepts/hosted-harbor/registry-credentials" },
  { slug: "core-concepts/rewardkit/quick-start", title: "RewardKit 快速开始", description: "定义并运行产出奖励分数的验证器。", href: "/docs/core-concepts/rewardkit/quick-start" },
  { slug: "core-concepts/rewardkit/judge-criteria", title: "评判标准", description: "用 TOML 配置 LLM 或 Agent 评判。", href: "/docs/core-concepts/rewardkit/judge-criteria" },
  { slug: "core-concepts/rewardkit/built-in-criteria", title: "内置标准", description: "全部内置评判函数参考。", href: "/docs/core-concepts/rewardkit/built-in-criteria" },
  { slug: "core-concepts/rewardkit/motivation-and-design", title: "动机与设计", description: "RewardKit 为何存在，以及设计原则。", href: "/docs/core-concepts/rewardkit/motivation-and-design" },
  { slug: "tutorials/create-a-task", title: "创建任务", description: "从零写一个 Harbor 任务。", href: "/docs/tutorials/create-a-task" },
  { slug: "tutorials/create-a-verifier-with-rewardkit", title: "用 RewardKit 创建验证器", description: "程序标准、权重与可选 LLM 评判。", href: "/docs/tutorials/create-a-verifier-with-rewardkit" },
  { slug: "tutorials/create-a-multi-container-task", title: "创建多容器任务", description: "编写多容器任务（官网占位页）。", href: "/docs/tutorials/create-a-multi-container-task" },
  { slug: "tutorials/run-a-job", title: "教程：运行作业", description: "运行作业教程（官网占位页）。", href: "/docs/tutorials/run-a-job" },
  { slug: "tutorials/simulating-users", title: "模拟用户教程", description: "模拟用户教程（官网占位页）。", href: "/docs/tutorials/simulating-users" },
  { slug: "tutorials/trajectory-analysis", title: "轨迹分析", description: "分析 Agent 轨迹（官网占位页）。", href: "/docs/tutorials/trajectory-analysis" },
  { slug: "contributing/contributing", title: "贡献指南", description: "如何给 Harbor 做贡献。", href: "/docs/contributing/contributing" },
  { slug: "contributing/release-policy", title: "发布策略", description: "稳定版与每日构建。", href: "/docs/contributing/release-policy" },
  { slug: "telemetry/telemetry", title: "用量统计", description: "Harbor 收集什么、如何退出。", href: "/docs/telemetry/telemetry" },
  { slug: "news/job-result-sharing", title: "别再打包作业结果", description: "把作业结果上传到 Harbor Hub 分享。", href: "/docs/news/job-result-sharing" },
  { slug: "news/separate-verifier-sandboxes", title: "独立沙箱验证", description: "在与 Agent 分离的沙箱中跑验证。", href: "/docs/news/separate-verifier-sandboxes" },
  { slug: "news/multi-step-tasks", title: "多步骤任务上线", description: "任务格式的第一次重大扩展。", href: "/docs/news/multi-step-tasks" },
  { slug: "news/harbor-cookbook", title: "Harbor Cookbook", description: "构建任务与优化循环的配方。", href: "/docs/news/harbor-cookbook" },
  { slug: "news/harbor-registry", title: "注册表升级", description: "打包和分发任务、数据集的新方式。", href: "/docs/news/harbor-registry" },
  { slug: "news", title: "新闻", description: "Harbor 产品动态。", href: "/docs/news" },
];

function kids(prefix: string): DocLink[] {
  return PAGES.filter((p) => p.slug.startsWith(prefix));
}

export const NAV: NavNode[] = [
  { kind: "label", title: "本站" },
  { kind: "link", slug: "quick-guide", title: "快速手册", href: "/docs/quick-guide" },
  { kind: "link", slug: "updates", title: "同步日志", href: "/docs/updates" },
  { kind: "link", slug: "architecture", title: "本站架构", href: "/docs/architecture" },
  { kind: "link", slug: "sitemap", title: "对照表", href: "/docs/sitemap" },
  { kind: "link", slug: "changelog", title: "官方更新日志", href: "/docs/changelog" },
  { kind: "label", title: "开始" },
  { kind: "link", slug: "index", title: "Harbor 是什么", href: "/" },
  { kind: "link", slug: "getting-started/quick-start", title: "快速开始", href: "/docs/getting-started/quick-start" },
  { kind: "link", slug: "getting-started/installation", title: "安装", href: "/docs/getting-started/installation" },
  { kind: "link", slug: "core-concepts/index", title: "核心概念", href: "/docs/core-concepts/index" },
  { kind: "folder", title: "任务", children: kids("core-concepts/tasks/") },
  { kind: "folder", title: "数据集", children: kids("core-concepts/datasets/") },
  { kind: "folder", title: "作业", children: kids("core-concepts/jobs/") },
  { kind: "folder", title: "Agent", children: kids("core-concepts/agents/") },
  { kind: "folder", title: "沙箱", children: kids("core-concepts/sandboxes/") },
  { kind: "folder", title: "插件", children: kids("core-concepts/plugins/") },
  { kind: "folder", title: "结果", children: kids("core-concepts/results/") },
  { kind: "folder", title: "Harbor Hub", children: kids("core-concepts/harbor-hub/") },
  { kind: "folder", title: "托管 Harbor", children: kids("core-concepts/hosted-harbor/") },
  { kind: "folder", title: "RewardKit", children: kids("core-concepts/rewardkit/") },
  { kind: "folder", title: "教程", children: kids("tutorials/") },
  { kind: "label", title: "贡献与动态" },
  { kind: "link", slug: "contributing/contributing", title: "贡献指南", href: "/docs/contributing/contributing" },
  { kind: "link", slug: "contributing/release-policy", title: "发布策略", href: "/docs/contributing/release-policy" },
  { kind: "link", slug: "telemetry/telemetry", title: "用量统计", href: "/docs/telemetry/telemetry" },
  { kind: "link", slug: "news", title: "新闻", href: "/docs/news" },
  { kind: "folder", title: "新闻稿", children: kids("news/") },
];

export function pageBySlug(slug: string): DocLink | undefined {
  const key = slug === "" || slug === "docs" ? "index" : slug.replace(/\/$/, "");
  return PAGES.find((p) => p.slug === key);
}

export function neighbors(slug: string): { prev?: DocLink; next?: DocLink } {
  const i = PAGES.findIndex((p) => p.slug === slug);
  if (i < 0) return {};
  return { prev: PAGES[i - 1], next: PAGES[i + 1] };
}

