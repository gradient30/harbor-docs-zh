export type ChangeKind = "added" | "updated" | "removed" | "site";

export type UpdateChange = {
  kind: ChangeKind;
  slug: string;
  title: string;
  webPath: string;
  officialUrl?: string;
  detail: string;
};

export type UpdateLog = {
  id: string;
  date: string;
  title: string;
  summary: string;
  sourceHint: string;
  changes: UpdateChange[];
};

export const UPDATE_LOGS: UpdateLog[] = [
  {
    "id": "2026-09-30-3164fa",
    "date": "2026-09-30",
    "title": "官网对照：4 处变动",
    "summary": "更新 /docs/core-concepts/jobs/stream；更新 /docs/core-concepts/rewardkit/judge-criteria；更新 /docs/core-concepts/rewardkit/quick-start；更新 /docs/core-concepts/sandboxes/pre-integrated-sandboxes",
    "sourceHint": "https://docs.harborframework.com/llms.txt · https://api.github.com/repos/harbor-framework/harbor/git/trees/main?recursive=1",
    "changes": [
      {
        "kind": "updated",
        "slug": "core-concepts/jobs/stream",
        "title": "core-concepts/jobs/stream",
        "webPath": "/docs/core-concepts/jobs/stream",
        "officialUrl": "https://docs.harborframework.com/core-concepts/jobs/stream",
        "detail": "GitHub blob bde668c → f2d66f5。中文站：/docs/core-concepts/jobs/stream。"
      },
      {
        "kind": "updated",
        "slug": "core-concepts/rewardkit/judge-criteria",
        "title": "core-concepts/rewardkit/judge-criteria",
        "webPath": "/docs/core-concepts/rewardkit/judge-criteria",
        "officialUrl": "https://docs.harborframework.com/core-concepts/rewardkit/judge-criteria",
        "detail": "GitHub blob 2e3e72a → 1d44efd。中文站：/docs/core-concepts/rewardkit/judge-criteria。"
      },
      {
        "kind": "updated",
        "slug": "core-concepts/rewardkit/quick-start",
        "title": "core-concepts/rewardkit/quick-start",
        "webPath": "/docs/core-concepts/rewardkit/quick-start",
        "officialUrl": "https://docs.harborframework.com/core-concepts/rewardkit/quick-start",
        "detail": "GitHub blob 9e342b8 → 705bef0。中文站：/docs/core-concepts/rewardkit/quick-start。"
      },
      {
        "kind": "updated",
        "slug": "core-concepts/sandboxes/pre-integrated-sandboxes",
        "title": "core-concepts/sandboxes/pre-integrated-sandboxes",
        "webPath": "/docs/core-concepts/sandboxes/pre-integrated-sandboxes",
        "officialUrl": "https://docs.harborframework.com/core-concepts/sandboxes/pre-integrated-sandboxes",
        "detail": "GitHub blob 4bca2f3 → ea3d3cd。中文站：/docs/core-concepts/sandboxes/pre-integrated-sandboxes。"
      }
    ]
  },
  {
    id: "2026-09-28-9e4ef4",
    date: "2026-09-28",
    title: "官网对照：6 页已补译",
    summary:
      "预集成沙箱与网络策略加入 prime / mosaic；模拟用户的 ACP 桥接扩到 codex、opencode；Pi 写入 ATIF 与 MCP 能力表。",
    sourceHint: "harbor-framework/harbor docs-mintlify · main",
    changes: [
      {
        kind: "updated",
        slug: "core-concepts/sandboxes/pre-integrated-sandboxes",
        title: "预集成沙箱",
        webPath: "/docs/core-concepts/sandboxes/pre-integrated-sandboxes",
        officialUrl: "https://docs.harborframework.com/core-concepts/sandboxes/pre-integrated-sandboxes",
        detail:
          "新增 prime、mosaic。Compose / GPU / 网络 / CPU 能力表已补；SSH 流式传输加上 modal、tensorlake。Prime GPU 仅单容器。",
      },
      {
        kind: "updated",
        slug: "core-concepts/tasks/network-policies",
        title: "网络策略",
        webPath: "/docs/core-concepts/tasks/network-policies",
        officialUrl: "https://docs.harborframework.com/core-concepts/tasks/network-policies",
        detail:
          "no-network、allowlist、阶段覆盖和功能对照表加入 prime。prime 的运行时策略只作用于新连接，已有连接保持打开。",
      },
      {
        kind: "updated",
        slug: "core-concepts/tasks/resources",
        title: "资源",
        webPath: "/docs/core-concepts/tasks/resources",
        officialUrl: "https://docs.harborframework.com/core-concepts/tasks/resources",
        detail: "CPU / 内存上限、存储规格、GPU 分配加入 prime；存储规格同时补上 runta。",
      },
      {
        kind: "updated",
        slug: "core-concepts/agents/pre-integrated-agents",
        title: "预集成 Agent",
        webPath: "/docs/core-concepts/agents/pre-integrated-agents",
        officialUrl: "https://docs.harborframework.com/core-concepts/agents/pre-integrated-agents",
        detail: "ATIF 与 MCP 能力名单加入 pi。Pi 会把当前会话分支转换成 ATIF。",
      },
      {
        kind: "updated",
        slug: "core-concepts/jobs/simulate-a-user",
        title: "模拟用户",
        webPath: "/docs/core-concepts/jobs/simulate-a-user",
        officialUrl: "https://docs.harborframework.com/core-concepts/jobs/simulate-a-user",
        detail: "ACP 桥接的目标 Agent 从 claude-code、gemini-cli 扩到 codex、opencode。",
      },
      {
        kind: "updated",
        slug: "core-concepts/jobs/stream",
        title: "实时流",
        webPath: "/docs/core-concepts/jobs/stream",
        officialUrl: "https://docs.harborframework.com/core-concepts/jobs/stream",
        detail: "`--no-delete` 现在写明也可用于调试，运行后仍须自行删除沙箱。",
      },
    ],
  },
  {
    "id": "2026-09-27-b33eaf",
    "date": "2026-09-27",
    "title": "官网对照：1 处变动",
    "summary": "更新 /docs/core-concepts/sandboxes/pre-integrated-sandboxes",
    "sourceHint": "https://docs.harborframework.com/llms.txt · https://api.github.com/repos/harbor-framework/harbor/git/trees/main?recursive=1",
    "changes": [
      {
        "kind": "updated",
        "slug": "core-concepts/sandboxes/pre-integrated-sandboxes",
        "title": "core-concepts/sandboxes/pre-integrated-sandboxes",
        "webPath": "/docs/core-concepts/sandboxes/pre-integrated-sandboxes",
        "officialUrl": "https://docs.harborframework.com/core-concepts/sandboxes/pre-integrated-sandboxes",
        "detail": "GitHub blob 3121063 → e974e58。中文站：/docs/core-concepts/sandboxes/pre-integrated-sandboxes。"
      }
    ]
  },
  {
    "id": "2026-09-26-40a46e",
    "date": "2026-09-26",
    "title": "官网对照：3 处变动",
    "summary": "更新 /docs/core-concepts/sandboxes/pre-integrated-sandboxes；更新 /docs/core-concepts/tasks/network-policies；更新 /docs/core-concepts/tasks/resources",
    "sourceHint": "https://docs.harborframework.com/llms.txt · https://api.github.com/repos/harbor-framework/harbor/git/trees/main?recursive=1",
    "changes": [
      {
        "kind": "updated",
        "slug": "core-concepts/sandboxes/pre-integrated-sandboxes",
        "title": "core-concepts/sandboxes/pre-integrated-sandboxes",
        "webPath": "/docs/core-concepts/sandboxes/pre-integrated-sandboxes",
        "officialUrl": "https://docs.harborframework.com/core-concepts/sandboxes/pre-integrated-sandboxes",
        "detail": "GitHub blob 3121063 → 97a14fb。中文站：/docs/core-concepts/sandboxes/pre-integrated-sandboxes。"
      },
      {
        "kind": "updated",
        "slug": "core-concepts/tasks/network-policies",
        "title": "core-concepts/tasks/network-policies",
        "webPath": "/docs/core-concepts/tasks/network-policies",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/network-policies",
        "detail": "GitHub blob 493319e → 8ab7d73。中文站：/docs/core-concepts/tasks/network-policies。"
      },
      {
        "kind": "updated",
        "slug": "core-concepts/tasks/resources",
        "title": "core-concepts/tasks/resources",
        "webPath": "/docs/core-concepts/tasks/resources",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/resources",
        "detail": "GitHub blob 5b25ba8 → c0b7dee。中文站：/docs/core-concepts/tasks/resources。"
      }
    ]
  },
  {
    "id": "2026-09-25-c6d954",
    "date": "2026-09-25",
    "title": "官网对照：1 处变动",
    "summary": "更新 /docs/core-concepts/tasks/resources",
    "sourceHint": "https://docs.harborframework.com/llms.txt · https://api.github.com/repos/harbor-framework/harbor/git/trees/main?recursive=1",
    "changes": [
      {
        "kind": "updated",
        "slug": "core-concepts/tasks/resources",
        "title": "core-concepts/tasks/resources",
        "webPath": "/docs/core-concepts/tasks/resources",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/resources",
        "detail": "GitHub blob 5b25ba8 → a85085b。中文站：/docs/core-concepts/tasks/resources。"
      }
    ]
  },
  {
    "id": "2026-09-23-597628",
    "date": "2026-09-23",
    "title": "官网对照：4 处变动",
    "summary": "更新 /docs/core-concepts/agents/pre-integrated-agents；更新 /docs/core-concepts/jobs/simulate-a-user；更新 /docs/core-concepts/jobs/stream；更新 /docs/core-concepts/sandboxes/pre-integrated-sandboxes",
    "sourceHint": "https://docs.harborframework.com/llms.txt · https://api.github.com/repos/harbor-framework/harbor/git/trees/main?recursive=1",
    "changes": [
      {
        "kind": "updated",
        "slug": "core-concepts/agents/pre-integrated-agents",
        "title": "core-concepts/agents/pre-integrated-agents",
        "webPath": "/docs/core-concepts/agents/pre-integrated-agents",
        "officialUrl": "https://docs.harborframework.com/core-concepts/agents/pre-integrated-agents",
        "detail": "GitHub blob 1fd2495 → 64331fe。中文站：/docs/core-concepts/agents/pre-integrated-agents。"
      },
      {
        "kind": "updated",
        "slug": "core-concepts/jobs/simulate-a-user",
        "title": "core-concepts/jobs/simulate-a-user",
        "webPath": "/docs/core-concepts/jobs/simulate-a-user",
        "officialUrl": "https://docs.harborframework.com/core-concepts/jobs/simulate-a-user",
        "detail": "GitHub blob 1d47bc3 → b274b1f。中文站：/docs/core-concepts/jobs/simulate-a-user。"
      },
      {
        "kind": "updated",
        "slug": "core-concepts/jobs/stream",
        "title": "core-concepts/jobs/stream",
        "webPath": "/docs/core-concepts/jobs/stream",
        "officialUrl": "https://docs.harborframework.com/core-concepts/jobs/stream",
        "detail": "GitHub blob 7eed59c → bde668c。中文站：/docs/core-concepts/jobs/stream。"
      },
      {
        "kind": "updated",
        "slug": "core-concepts/sandboxes/pre-integrated-sandboxes",
        "title": "core-concepts/sandboxes/pre-integrated-sandboxes",
        "webPath": "/docs/core-concepts/sandboxes/pre-integrated-sandboxes",
        "officialUrl": "https://docs.harborframework.com/core-concepts/sandboxes/pre-integrated-sandboxes",
        "detail": "GitHub blob 3121063 → b1c2189。中文站：/docs/core-concepts/sandboxes/pre-integrated-sandboxes。"
      }
    ]
  },
  {
    id: "2026-09-22-initial",
    date: "2026-09-22",
    title: "首版全站汉化上线",
    summary:
      "对照 docs.harborframework.com 与 GitHub docs-mintlify（80 篇官网正文 + 首页），完成 1:1 中文手册，并建立同步日志与对照表。",
    sourceHint: "https://docs.harborframework.com/llms.txt · Harbor v0.23.0 文档面",
    changes: [
      {
        kind: "site",
        slug: "index",
        title: "统一阅读器",
        webPath: "/",
        officialUrl: "https://docs.harborframework.com/",
        detail: "明 / 暗 / 彩三套风格、目录搜索、页内大纲、上一篇 / 下一篇。",
      },
      {
        kind: "added",
        slug: "getting-started/quick-start",
        title: "快速开始等 80 篇官网正文",
        webPath: "/docs/getting-started/quick-start",
        officialUrl: "https://docs.harborframework.com/getting-started/quick-start",
        detail: "从入门、任务、作业、Agent、沙箱、Hub、RewardKit 到新闻与 changelog，路径与官网对齐。含 5 篇官网占位页。",
      },
      {
        kind: "added",
        slug: "updates",
        title: "同步日志模块",
        webPath: "/docs/updates",
        detail: "以后官网每有变动，这里单独记一笔：改了什么、中文站在哪一页。",
      },
      {
        kind: "added",
        slug: "sitemap",
        title: "对照表",
        webPath: "/docs/sitemap",
        detail: "每页内容指纹。官网 SHA 一变，对应中文路径会标成待更新。",
      },
      {
        kind: "added",
        slug: "architecture",
        title: "本站架构",
        webPath: "/docs/architecture",
        detail: "阅读器如何拼起来，以及每日同步如何驱动永久汉化。",
      },
    ],
  },
];

export const LATEST_UPDATE = UPDATE_LOGS[0]!;

export function logById(id: string): UpdateLog | undefined {
  return UPDATE_LOGS.find((l) => l.id === id);
}

export function kindLabel(kind: ChangeKind): string {
  if (kind === "added") return "新增";
  if (kind === "updated") return "更新";
  if (kind === "removed") return "移除";
  return "本站";
}
