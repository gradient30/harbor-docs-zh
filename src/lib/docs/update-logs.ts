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
    "id": "2026-10-04-3972c8",
    "date": "2026-10-04",
    "title": "官网对照：129 处变动",
    "summary": "新增 /docs/agents/acp；新增 /docs/agents/atif；新增 /docs/agents/custom-agents；新增 /docs/agents/pre-integrated-agents；更新 /docs/core-concepts/index；新增 /docs/datasets/create-a-dataset；新增 /docs/datasets/datasets；新增 /docs/datasets/git-repos",
    "sourceHint": "https://docs.harborframework.com/llms.txt · https://api.github.com/repos/harbor-framework/harbor/git/trees/main?recursive=1",
    "changes": [
      {
        "kind": "added",
        "slug": "agents/acp",
        "title": "acp",
        "webPath": "/docs/agents/acp",
        "officialUrl": "https://docs.harborframework.com/agents/acp",
        "detail": "官网新增页面（GitHub SHA 73a9503）。中文站位置：/docs/agents/acp，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "agents/atif",
        "title": "atif",
        "webPath": "/docs/agents/atif",
        "officialUrl": "https://docs.harborframework.com/agents/atif",
        "detail": "官网新增页面（GitHub SHA 72e9511）。中文站位置：/docs/agents/atif，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "agents/custom-agents",
        "title": "custom-agents",
        "webPath": "/docs/agents/custom-agents",
        "officialUrl": "https://docs.harborframework.com/agents/custom-agents",
        "detail": "官网新增页面（GitHub SHA 0f60539）。中文站位置：/docs/agents/custom-agents，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "agents/pre-integrated-agents",
        "title": "pre-integrated-agents",
        "webPath": "/docs/agents/pre-integrated-agents",
        "officialUrl": "https://docs.harborframework.com/agents/pre-integrated-agents",
        "detail": "官网新增页面（GitHub SHA 7d18e21）。中文站位置：/docs/agents/pre-integrated-agents，已自动建档待补译。"
      },
      {
        "kind": "updated",
        "slug": "core-concepts/index",
        "title": "core-concepts/index",
        "webPath": "/docs/core-concepts/index",
        "officialUrl": "https://docs.harborframework.com/core-concepts/index",
        "detail": "GitHub blob c0b5e91 → 414c199。中文站：/docs/core-concepts/index。"
      },
      {
        "kind": "added",
        "slug": "datasets/create-a-dataset",
        "title": "create-a-dataset",
        "webPath": "/docs/datasets/create-a-dataset",
        "officialUrl": "https://docs.harborframework.com/datasets/create-a-dataset",
        "detail": "官网新增页面（GitHub SHA a9667bc）。中文站位置：/docs/datasets/create-a-dataset，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "datasets/datasets",
        "title": "datasets",
        "webPath": "/docs/datasets/datasets",
        "officialUrl": "https://docs.harborframework.com/datasets/datasets",
        "detail": "官网新增页面（GitHub SHA 7aa574f）。中文站位置：/docs/datasets/datasets，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "datasets/git-repos",
        "title": "git-repos",
        "webPath": "/docs/datasets/git-repos",
        "officialUrl": "https://docs.harborframework.com/datasets/git-repos",
        "detail": "官网新增页面（GitHub SHA 6c0813c）。中文站位置：/docs/datasets/git-repos，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "datasets/metrics",
        "title": "metrics",
        "webPath": "/docs/datasets/metrics",
        "officialUrl": "https://docs.harborframework.com/datasets/metrics",
        "detail": "官网新增页面（GitHub SHA 2f03674）。中文站位置：/docs/datasets/metrics，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "datasets/registries",
        "title": "registries",
        "webPath": "/docs/datasets/registries",
        "officialUrl": "https://docs.harborframework.com/datasets/registries",
        "detail": "官网新增页面（GitHub SHA a79730b）。中文站位置：/docs/datasets/registries，已自动建档待补译。"
      },
      {
        "kind": "updated",
        "slug": "getting-started/installation",
        "title": "getting-started/installation",
        "webPath": "/docs/getting-started/installation",
        "officialUrl": "https://docs.harborframework.com/getting-started/installation",
        "detail": "GitHub blob bbb4e4c → b5c3e8d。中文站：/docs/getting-started/installation。"
      },
      {
        "kind": "updated",
        "slug": "getting-started/quick-start",
        "title": "getting-started/quick-start",
        "webPath": "/docs/getting-started/quick-start",
        "officialUrl": "https://docs.harborframework.com/getting-started/quick-start",
        "detail": "GitHub blob f4e20aa → 3099904。中文站：/docs/getting-started/quick-start。"
      },
      {
        "kind": "added",
        "slug": "harbor-hub/download",
        "title": "download",
        "webPath": "/docs/harbor-hub/download",
        "officialUrl": "https://docs.harborframework.com/harbor-hub/download",
        "detail": "官网新增页面（GitHub SHA 4d099f2）。中文站位置：/docs/harbor-hub/download，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "harbor-hub/hosted-jobs",
        "title": "hosted-jobs",
        "webPath": "/docs/harbor-hub/hosted-jobs",
        "officialUrl": "https://docs.harborframework.com/harbor-hub/hosted-jobs",
        "detail": "官网新增页面（GitHub SHA d4c163e）。中文站位置：/docs/harbor-hub/hosted-jobs，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "harbor-hub/leaderboards",
        "title": "leaderboards",
        "webPath": "/docs/harbor-hub/leaderboards",
        "officialUrl": "https://docs.harborframework.com/harbor-hub/leaderboards",
        "detail": "官网新增页面（GitHub SHA 0f586a9）。中文站位置：/docs/harbor-hub/leaderboards，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "harbor-hub/publish",
        "title": "publish",
        "webPath": "/docs/harbor-hub/publish",
        "officialUrl": "https://docs.harborframework.com/harbor-hub/publish",
        "detail": "官网新增页面（GitHub SHA e5aca61）。中文站位置：/docs/harbor-hub/publish，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "harbor-hub/sharing",
        "title": "sharing",
        "webPath": "/docs/harbor-hub/sharing",
        "officialUrl": "https://docs.harborframework.com/harbor-hub/sharing",
        "detail": "官网新增页面（GitHub SHA f73c50e）。中文站位置：/docs/harbor-hub/sharing，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "harbor-hub/upload",
        "title": "upload",
        "webPath": "/docs/harbor-hub/upload",
        "officialUrl": "https://docs.harborframework.com/harbor-hub/upload",
        "detail": "官网新增页面（GitHub SHA c332b04）。中文站位置：/docs/harbor-hub/upload，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "hosted-harbor/api-key",
        "title": "api-key",
        "webPath": "/docs/hosted-harbor/api-key",
        "officialUrl": "https://docs.harborframework.com/hosted-harbor/api-key",
        "detail": "官网新增页面（GitHub SHA 301aca6）。中文站位置：/docs/hosted-harbor/api-key，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "hosted-harbor/api",
        "title": "api",
        "webPath": "/docs/hosted-harbor/api",
        "officialUrl": "https://docs.harborframework.com/hosted-harbor/api",
        "detail": "官网新增页面（GitHub SHA e03c193）。中文站位置：/docs/hosted-harbor/api，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "hosted-harbor/cli",
        "title": "cli",
        "webPath": "/docs/hosted-harbor/cli",
        "officialUrl": "https://docs.harborframework.com/hosted-harbor/cli",
        "detail": "官网新增页面（GitHub SHA 11d277e）。中文站位置：/docs/hosted-harbor/cli，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "hosted-harbor/custom-agents",
        "title": "custom-agents",
        "webPath": "/docs/hosted-harbor/custom-agents",
        "officialUrl": "https://docs.harborframework.com/hosted-harbor/custom-agents",
        "detail": "官网新增页面（GitHub SHA 3d218d7）。中文站位置：/docs/hosted-harbor/custom-agents，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "hosted-harbor/index",
        "title": "index",
        "webPath": "/docs/hosted-harbor/index",
        "officialUrl": "https://docs.harborframework.com/hosted-harbor/index",
        "detail": "官网新增页面（GitHub SHA a241fe5）。中文站位置：/docs/hosted-harbor/index，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "hosted-harbor/registry-credentials",
        "title": "registry-credentials",
        "webPath": "/docs/hosted-harbor/registry-credentials",
        "officialUrl": "https://docs.harborframework.com/hosted-harbor/registry-credentials",
        "detail": "官网新增页面（GitHub SHA 477f84c）。中文站位置：/docs/hosted-harbor/registry-credentials，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "hosted-harbor/secrets",
        "title": "secrets",
        "webPath": "/docs/hosted-harbor/secrets",
        "officialUrl": "https://docs.harborframework.com/hosted-harbor/secrets",
        "detail": "官网新增页面（GitHub SHA 9b8c31f）。中文站位置：/docs/hosted-harbor/secrets，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "hosted-harbor/submitting-jobs",
        "title": "submitting-jobs",
        "webPath": "/docs/hosted-harbor/submitting-jobs",
        "officialUrl": "https://docs.harborframework.com/hosted-harbor/submitting-jobs",
        "detail": "官网新增页面（GitHub SHA 9fa45b0）。中文站位置：/docs/hosted-harbor/submitting-jobs，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "hosted-harbor/web-ui",
        "title": "web-ui",
        "webPath": "/docs/hosted-harbor/web-ui",
        "officialUrl": "https://docs.harborframework.com/hosted-harbor/web-ui",
        "detail": "官网新增页面（GitHub SHA 4a06e9b）。中文站位置：/docs/hosted-harbor/web-ui，已自动建档待补译。"
      },
      {
        "kind": "updated",
        "slug": "index",
        "title": "index",
        "webPath": "/",
        "officialUrl": "https://docs.harborframework.com/",
        "detail": "GitHub blob 8f481eb → 47774aa。中文站：/。"
      },
      {
        "kind": "added",
        "slug": "jobs/artifact-collection",
        "title": "artifact-collection",
        "webPath": "/docs/jobs/artifact-collection",
        "officialUrl": "https://docs.harborframework.com/jobs/artifact-collection",
        "detail": "官网新增页面（GitHub SHA 9b2ffe2）。中文站位置：/docs/jobs/artifact-collection，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "jobs/configs",
        "title": "configs",
        "webPath": "/docs/jobs/configs",
        "officialUrl": "https://docs.harborframework.com/jobs/configs",
        "detail": "官网新增页面（GitHub SHA 5b41884）。中文站位置：/docs/jobs/configs，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "jobs/custom-verifiers",
        "title": "custom-verifiers",
        "webPath": "/docs/jobs/custom-verifiers",
        "officialUrl": "https://docs.harborframework.com/jobs/custom-verifiers",
        "detail": "官网新增页面（GitHub SHA bfbdf77）。中文站位置：/docs/jobs/custom-verifiers，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "jobs/environment-variables",
        "title": "environment-variables",
        "webPath": "/docs/jobs/environment-variables",
        "officialUrl": "https://docs.harborframework.com/jobs/environment-variables",
        "detail": "官网新增页面（GitHub SHA 84742ab）。中文站位置：/docs/jobs/environment-variables，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "jobs/handoff",
        "title": "handoff",
        "webPath": "/docs/jobs/handoff",
        "officialUrl": "https://docs.harborframework.com/jobs/handoff",
        "detail": "官网新增页面（GitHub SHA c58f210）。中文站位置：/docs/jobs/handoff，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "jobs/loading-trajectories",
        "title": "loading-trajectories",
        "webPath": "/docs/jobs/loading-trajectories",
        "officialUrl": "https://docs.harborframework.com/jobs/loading-trajectories",
        "detail": "官网新增页面（GitHub SHA 30162b1）。中文站位置：/docs/jobs/loading-trajectories，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "jobs/regrade",
        "title": "regrade",
        "webPath": "/docs/jobs/regrade",
        "officialUrl": "https://docs.harborframework.com/jobs/regrade",
        "detail": "官网新增页面（GitHub SHA bee11e7）。中文站位置：/docs/jobs/regrade，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "jobs/run-a-job",
        "title": "run-a-job",
        "webPath": "/docs/jobs/run-a-job",
        "officialUrl": "https://docs.harborframework.com/jobs/run-a-job",
        "detail": "官网新增页面（GitHub SHA 1816ad1）。中文站位置：/docs/jobs/run-a-job，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "jobs/simulate-a-user",
        "title": "simulate-a-user",
        "webPath": "/docs/jobs/simulate-a-user",
        "officialUrl": "https://docs.harborframework.com/jobs/simulate-a-user",
        "detail": "官网新增页面（GitHub SHA b274b1f）。中文站位置：/docs/jobs/simulate-a-user，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "jobs/skills",
        "title": "skills",
        "webPath": "/docs/jobs/skills",
        "officialUrl": "https://docs.harborframework.com/jobs/skills",
        "detail": "官网新增页面（GitHub SHA 628fb03）。中文站位置：/docs/jobs/skills，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "jobs/stream",
        "title": "stream",
        "webPath": "/docs/jobs/stream",
        "officialUrl": "https://docs.harborframework.com/jobs/stream",
        "detail": "官网新增页面（GitHub SHA f2d66f5）。中文站位置：/docs/jobs/stream，已自动建档待补译。"
      },
      {
        "kind": "updated",
        "slug": "news/harbor-registry",
        "title": "news/harbor-registry",
        "webPath": "/docs/news/harbor-registry",
        "officialUrl": "https://docs.harborframework.com/news/harbor-registry",
        "detail": "GitHub blob 3ba9cfd → ba0000d。中文站：/docs/news/harbor-registry。"
      },
      {
        "kind": "updated",
        "slug": "news/job-result-sharing",
        "title": "news/job-result-sharing",
        "webPath": "/docs/news/job-result-sharing",
        "officialUrl": "https://docs.harborframework.com/news/job-result-sharing",
        "detail": "GitHub blob f932dd8 → a28178b。中文站：/docs/news/job-result-sharing。"
      },
      {
        "kind": "updated",
        "slug": "news/multi-step-tasks",
        "title": "news/multi-step-tasks",
        "webPath": "/docs/news/multi-step-tasks",
        "officialUrl": "https://docs.harborframework.com/news/multi-step-tasks",
        "detail": "GitHub blob c1a76d5 → e4dc46c。中文站：/docs/news/multi-step-tasks。"
      },
      {
        "kind": "added",
        "slug": "plugins/custom-plugins",
        "title": "custom-plugins",
        "webPath": "/docs/plugins/custom-plugins",
        "officialUrl": "https://docs.harborframework.com/plugins/custom-plugins",
        "detail": "官网新增页面（GitHub SHA 42646ab）。中文站位置：/docs/plugins/custom-plugins，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "plugins/existing-plugins",
        "title": "existing-plugins",
        "webPath": "/docs/plugins/existing-plugins",
        "officialUrl": "https://docs.harborframework.com/plugins/existing-plugins",
        "detail": "官网新增页面（GitHub SHA 92e3ddc）。中文站位置：/docs/plugins/existing-plugins，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "results/handoff",
        "title": "handoff",
        "webPath": "/docs/results/handoff",
        "officialUrl": "https://docs.harborframework.com/results/handoff",
        "detail": "官网新增页面（GitHub SHA 74e4e9e）。中文站位置：/docs/results/handoff，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "results/view-job-results",
        "title": "view-job-results",
        "webPath": "/docs/results/view-job-results",
        "officialUrl": "https://docs.harborframework.com/results/view-job-results",
        "detail": "官网新增页面（GitHub SHA b428a97）。中文站位置：/docs/results/view-job-results，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "rewardkit/built-in-criteria",
        "title": "built-in-criteria",
        "webPath": "/docs/rewardkit/built-in-criteria",
        "officialUrl": "https://docs.harborframework.com/rewardkit/built-in-criteria",
        "detail": "官网新增页面（GitHub SHA 3a9c306）。中文站位置：/docs/rewardkit/built-in-criteria，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "rewardkit/judge-criteria",
        "title": "judge-criteria",
        "webPath": "/docs/rewardkit/judge-criteria",
        "officialUrl": "https://docs.harborframework.com/rewardkit/judge-criteria",
        "detail": "官网新增页面（GitHub SHA f1e42b8）。中文站位置：/docs/rewardkit/judge-criteria，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "rewardkit/motivation-and-design",
        "title": "motivation-and-design",
        "webPath": "/docs/rewardkit/motivation-and-design",
        "officialUrl": "https://docs.harborframework.com/rewardkit/motivation-and-design",
        "detail": "官网新增页面（GitHub SHA 78e6b5f）。中文站位置：/docs/rewardkit/motivation-and-design，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "rewardkit/quick-start",
        "title": "quick-start",
        "webPath": "/docs/rewardkit/quick-start",
        "officialUrl": "https://docs.harborframework.com/rewardkit/quick-start",
        "detail": "官网新增页面（GitHub SHA 6dfb0b8）。中文站位置：/docs/rewardkit/quick-start，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "sandboxes/asp",
        "title": "asp",
        "webPath": "/docs/sandboxes/asp",
        "officialUrl": "https://docs.harborframework.com/sandboxes/asp",
        "detail": "官网新增页面（GitHub SHA 0346b7a）。中文站位置：/docs/sandboxes/asp，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "sandboxes/custom-sandboxes",
        "title": "custom-sandboxes",
        "webPath": "/docs/sandboxes/custom-sandboxes",
        "officialUrl": "https://docs.harborframework.com/sandboxes/custom-sandboxes",
        "detail": "官网新增页面（GitHub SHA 02f2b5a）。中文站位置：/docs/sandboxes/custom-sandboxes，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "sandboxes/pre-integrated-sandboxes",
        "title": "pre-integrated-sandboxes",
        "webPath": "/docs/sandboxes/pre-integrated-sandboxes",
        "officialUrl": "https://docs.harborframework.com/sandboxes/pre-integrated-sandboxes",
        "detail": "官网新增页面（GitHub SHA 7c4baca）。中文站位置：/docs/sandboxes/pre-integrated-sandboxes，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "tasks/artifacts",
        "title": "artifacts",
        "webPath": "/docs/tasks/artifacts",
        "officialUrl": "https://docs.harborframework.com/tasks/artifacts",
        "detail": "官网新增页面（GitHub SHA 2ee86c4）。中文站位置：/docs/tasks/artifacts，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "tasks/configuration",
        "title": "configuration",
        "webPath": "/docs/tasks/configuration",
        "officialUrl": "https://docs.harborframework.com/tasks/configuration",
        "detail": "官网新增页面（GitHub SHA 66ba823）。中文站位置：/docs/tasks/configuration，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "tasks/environment",
        "title": "environment",
        "webPath": "/docs/tasks/environment",
        "officialUrl": "https://docs.harborframework.com/tasks/environment",
        "detail": "官网新增页面（GitHub SHA c8294bd）。中文站位置：/docs/tasks/environment，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "tasks/instruction",
        "title": "instruction",
        "webPath": "/docs/tasks/instruction",
        "officialUrl": "https://docs.harborframework.com/tasks/instruction",
        "detail": "官网新增页面（GitHub SHA cd2d662）。中文站位置：/docs/tasks/instruction，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "tasks/multi-container",
        "title": "multi-container",
        "webPath": "/docs/tasks/multi-container",
        "officialUrl": "https://docs.harborframework.com/tasks/multi-container",
        "detail": "官网新增页面（GitHub SHA a7e2f00）。中文站位置：/docs/tasks/multi-container，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "tasks/multi-step",
        "title": "multi-step",
        "webPath": "/docs/tasks/multi-step",
        "officialUrl": "https://docs.harborframework.com/tasks/multi-step",
        "detail": "官网新增页面（GitHub SHA 89241fe）。中文站位置：/docs/tasks/multi-step，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "tasks/network-policies",
        "title": "network-policies",
        "webPath": "/docs/tasks/network-policies",
        "officialUrl": "https://docs.harborframework.com/tasks/network-policies",
        "detail": "官网新增页面（GitHub SHA 12f4111）。中文站位置：/docs/tasks/network-policies，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "tasks/overview",
        "title": "overview",
        "webPath": "/docs/tasks/overview",
        "officialUrl": "https://docs.harborframework.com/tasks/overview",
        "detail": "官网新增页面（GitHub SHA 820aafa）。中文站位置：/docs/tasks/overview，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "tasks/resources",
        "title": "resources",
        "webPath": "/docs/tasks/resources",
        "officialUrl": "https://docs.harborframework.com/tasks/resources",
        "detail": "官网新增页面（GitHub SHA fe36f1b）。中文站位置：/docs/tasks/resources，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "tasks/separate-verifier",
        "title": "separate-verifier",
        "webPath": "/docs/tasks/separate-verifier",
        "officialUrl": "https://docs.harborframework.com/tasks/separate-verifier",
        "detail": "官网新增页面（GitHub SHA 8438f62）。中文站位置：/docs/tasks/separate-verifier，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "tasks/skills",
        "title": "skills",
        "webPath": "/docs/tasks/skills",
        "officialUrl": "https://docs.harborframework.com/tasks/skills",
        "detail": "官网新增页面（GitHub SHA 40c0dd4）。中文站位置：/docs/tasks/skills，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "tasks/solution",
        "title": "solution",
        "webPath": "/docs/tasks/solution",
        "officialUrl": "https://docs.harborframework.com/tasks/solution",
        "detail": "官网新增页面（GitHub SHA 2a5b2d4）。中文站位置：/docs/tasks/solution，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "tasks/verifier",
        "title": "verifier",
        "webPath": "/docs/tasks/verifier",
        "officialUrl": "https://docs.harborframework.com/tasks/verifier",
        "detail": "官网新增页面（GitHub SHA 6d295a1）。中文站位置：/docs/tasks/verifier，已自动建档待补译。"
      },
      {
        "kind": "added",
        "slug": "tasks/windows-tasks",
        "title": "windows-tasks",
        "webPath": "/docs/tasks/windows-tasks",
        "officialUrl": "https://docs.harborframework.com/tasks/windows-tasks",
        "detail": "官网新增页面（GitHub SHA 4f4ab62）。中文站位置：/docs/tasks/windows-tasks，已自动建档待补译。"
      },
      {
        "kind": "updated",
        "slug": "tutorials/create-a-task",
        "title": "tutorials/create-a-task",
        "webPath": "/docs/tutorials/create-a-task",
        "officialUrl": "https://docs.harborframework.com/tutorials/create-a-task",
        "detail": "GitHub blob a2684dc → 1a6c869。中文站：/docs/tutorials/create-a-task。"
      },
      {
        "kind": "updated",
        "slug": "tutorials/create-a-verifier-with-rewardkit",
        "title": "tutorials/create-a-verifier-with-rewardkit",
        "webPath": "/docs/tutorials/create-a-verifier-with-rewardkit",
        "officialUrl": "https://docs.harborframework.com/tutorials/create-a-verifier-with-rewardkit",
        "detail": "GitHub blob 8da52b1 → 9dc258f。中文站：/docs/tutorials/create-a-verifier-with-rewardkit。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/tasks/overview",
        "title": "core-concepts/tasks/overview",
        "webPath": "/docs/core-concepts/tasks/overview",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/overview",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/tasks/overview，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/tasks/instruction",
        "title": "core-concepts/tasks/instruction",
        "webPath": "/docs/core-concepts/tasks/instruction",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/instruction",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/tasks/instruction，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/tasks/configuration",
        "title": "core-concepts/tasks/configuration",
        "webPath": "/docs/core-concepts/tasks/configuration",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/configuration",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/tasks/configuration，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/tasks/environment",
        "title": "core-concepts/tasks/environment",
        "webPath": "/docs/core-concepts/tasks/environment",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/environment",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/tasks/environment，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/tasks/skills",
        "title": "core-concepts/tasks/skills",
        "webPath": "/docs/core-concepts/tasks/skills",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/skills",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/tasks/skills，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/tasks/solution",
        "title": "core-concepts/tasks/solution",
        "webPath": "/docs/core-concepts/tasks/solution",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/solution",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/tasks/solution，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/tasks/verifier",
        "title": "core-concepts/tasks/verifier",
        "webPath": "/docs/core-concepts/tasks/verifier",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/verifier",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/tasks/verifier，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/tasks/artifacts",
        "title": "core-concepts/tasks/artifacts",
        "webPath": "/docs/core-concepts/tasks/artifacts",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/artifacts",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/tasks/artifacts，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/tasks/resources",
        "title": "core-concepts/tasks/resources",
        "webPath": "/docs/core-concepts/tasks/resources",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/resources",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/tasks/resources，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/tasks/multi-container",
        "title": "core-concepts/tasks/multi-container",
        "webPath": "/docs/core-concepts/tasks/multi-container",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/multi-container",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/tasks/multi-container，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/tasks/network-policies",
        "title": "core-concepts/tasks/network-policies",
        "webPath": "/docs/core-concepts/tasks/network-policies",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/network-policies",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/tasks/network-policies，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/tasks/multi-step",
        "title": "core-concepts/tasks/multi-step",
        "webPath": "/docs/core-concepts/tasks/multi-step",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/multi-step",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/tasks/multi-step，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/tasks/separate-verifier",
        "title": "core-concepts/tasks/separate-verifier",
        "webPath": "/docs/core-concepts/tasks/separate-verifier",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/separate-verifier",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/tasks/separate-verifier，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/datasets/datasets",
        "title": "core-concepts/datasets/datasets",
        "webPath": "/docs/core-concepts/datasets/datasets",
        "officialUrl": "https://docs.harborframework.com/core-concepts/datasets/datasets",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/datasets/datasets，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/datasets/create-a-dataset",
        "title": "core-concepts/datasets/create-a-dataset",
        "webPath": "/docs/core-concepts/datasets/create-a-dataset",
        "officialUrl": "https://docs.harborframework.com/core-concepts/datasets/create-a-dataset",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/datasets/create-a-dataset，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/datasets/git-repos",
        "title": "core-concepts/datasets/git-repos",
        "webPath": "/docs/core-concepts/datasets/git-repos",
        "officialUrl": "https://docs.harborframework.com/core-concepts/datasets/git-repos",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/datasets/git-repos，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/datasets/registries",
        "title": "core-concepts/datasets/registries",
        "webPath": "/docs/core-concepts/datasets/registries",
        "officialUrl": "https://docs.harborframework.com/core-concepts/datasets/registries",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/datasets/registries，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/datasets/metrics",
        "title": "core-concepts/datasets/metrics",
        "webPath": "/docs/core-concepts/datasets/metrics",
        "officialUrl": "https://docs.harborframework.com/core-concepts/datasets/metrics",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/datasets/metrics，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/jobs/run-a-job",
        "title": "core-concepts/jobs/run-a-job",
        "webPath": "/docs/core-concepts/jobs/run-a-job",
        "officialUrl": "https://docs.harborframework.com/core-concepts/jobs/run-a-job",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/jobs/run-a-job，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/jobs/configs",
        "title": "core-concepts/jobs/configs",
        "webPath": "/docs/core-concepts/jobs/configs",
        "officialUrl": "https://docs.harborframework.com/core-concepts/jobs/configs",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/jobs/configs，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/jobs/environment-variables",
        "title": "core-concepts/jobs/environment-variables",
        "webPath": "/docs/core-concepts/jobs/environment-variables",
        "officialUrl": "https://docs.harborframework.com/core-concepts/jobs/environment-variables",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/jobs/environment-variables，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/jobs/skills",
        "title": "core-concepts/jobs/skills",
        "webPath": "/docs/core-concepts/jobs/skills",
        "officialUrl": "https://docs.harborframework.com/core-concepts/jobs/skills",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/jobs/skills，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/jobs/loading-trajectories",
        "title": "core-concepts/jobs/loading-trajectories",
        "webPath": "/docs/core-concepts/jobs/loading-trajectories",
        "officialUrl": "https://docs.harborframework.com/core-concepts/jobs/loading-trajectories",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/jobs/loading-trajectories，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/jobs/handoff",
        "title": "core-concepts/jobs/handoff",
        "webPath": "/docs/core-concepts/jobs/handoff",
        "officialUrl": "https://docs.harborframework.com/core-concepts/jobs/handoff",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/jobs/handoff，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/jobs/regrade",
        "title": "core-concepts/jobs/regrade",
        "webPath": "/docs/core-concepts/jobs/regrade",
        "officialUrl": "https://docs.harborframework.com/core-concepts/jobs/regrade",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/jobs/regrade，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/jobs/simulate-a-user",
        "title": "core-concepts/jobs/simulate-a-user",
        "webPath": "/docs/core-concepts/jobs/simulate-a-user",
        "officialUrl": "https://docs.harborframework.com/core-concepts/jobs/simulate-a-user",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/jobs/simulate-a-user，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/jobs/custom-verifiers",
        "title": "core-concepts/jobs/custom-verifiers",
        "webPath": "/docs/core-concepts/jobs/custom-verifiers",
        "officialUrl": "https://docs.harborframework.com/core-concepts/jobs/custom-verifiers",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/jobs/custom-verifiers，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/jobs/artifact-collection",
        "title": "core-concepts/jobs/artifact-collection",
        "webPath": "/docs/core-concepts/jobs/artifact-collection",
        "officialUrl": "https://docs.harborframework.com/core-concepts/jobs/artifact-collection",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/jobs/artifact-collection，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/jobs/stream",
        "title": "core-concepts/jobs/stream",
        "webPath": "/docs/core-concepts/jobs/stream",
        "officialUrl": "https://docs.harborframework.com/core-concepts/jobs/stream",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/jobs/stream，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/agents/pre-integrated-agents",
        "title": "core-concepts/agents/pre-integrated-agents",
        "webPath": "/docs/core-concepts/agents/pre-integrated-agents",
        "officialUrl": "https://docs.harborframework.com/core-concepts/agents/pre-integrated-agents",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/agents/pre-integrated-agents，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/agents/acp",
        "title": "core-concepts/agents/acp",
        "webPath": "/docs/core-concepts/agents/acp",
        "officialUrl": "https://docs.harborframework.com/core-concepts/agents/acp",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/agents/acp，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/agents/custom-agents",
        "title": "core-concepts/agents/custom-agents",
        "webPath": "/docs/core-concepts/agents/custom-agents",
        "officialUrl": "https://docs.harborframework.com/core-concepts/agents/custom-agents",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/agents/custom-agents，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/agents/atif",
        "title": "core-concepts/agents/atif",
        "webPath": "/docs/core-concepts/agents/atif",
        "officialUrl": "https://docs.harborframework.com/core-concepts/agents/atif",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/agents/atif，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/sandboxes/pre-integrated-sandboxes",
        "title": "core-concepts/sandboxes/pre-integrated-sandboxes",
        "webPath": "/docs/core-concepts/sandboxes/pre-integrated-sandboxes",
        "officialUrl": "https://docs.harborframework.com/core-concepts/sandboxes/pre-integrated-sandboxes",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/sandboxes/pre-integrated-sandboxes，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/sandboxes/asp",
        "title": "core-concepts/sandboxes/asp",
        "webPath": "/docs/core-concepts/sandboxes/asp",
        "officialUrl": "https://docs.harborframework.com/core-concepts/sandboxes/asp",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/sandboxes/asp，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/sandboxes/custom-sandboxes",
        "title": "core-concepts/sandboxes/custom-sandboxes",
        "webPath": "/docs/core-concepts/sandboxes/custom-sandboxes",
        "officialUrl": "https://docs.harborframework.com/core-concepts/sandboxes/custom-sandboxes",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/sandboxes/custom-sandboxes，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/plugins/existing-plugins",
        "title": "core-concepts/plugins/existing-plugins",
        "webPath": "/docs/core-concepts/plugins/existing-plugins",
        "officialUrl": "https://docs.harborframework.com/core-concepts/plugins/existing-plugins",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/plugins/existing-plugins，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/plugins/custom-plugins",
        "title": "core-concepts/plugins/custom-plugins",
        "webPath": "/docs/core-concepts/plugins/custom-plugins",
        "officialUrl": "https://docs.harborframework.com/core-concepts/plugins/custom-plugins",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/plugins/custom-plugins，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/results/view-job-results",
        "title": "core-concepts/results/view-job-results",
        "webPath": "/docs/core-concepts/results/view-job-results",
        "officialUrl": "https://docs.harborframework.com/core-concepts/results/view-job-results",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/results/view-job-results，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/results/handoff",
        "title": "core-concepts/results/handoff",
        "webPath": "/docs/core-concepts/results/handoff",
        "officialUrl": "https://docs.harborframework.com/core-concepts/results/handoff",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/results/handoff，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/harbor-hub/publish",
        "title": "core-concepts/harbor-hub/publish",
        "webPath": "/docs/core-concepts/harbor-hub/publish",
        "officialUrl": "https://docs.harborframework.com/core-concepts/harbor-hub/publish",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/harbor-hub/publish，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/harbor-hub/upload",
        "title": "core-concepts/harbor-hub/upload",
        "webPath": "/docs/core-concepts/harbor-hub/upload",
        "officialUrl": "https://docs.harborframework.com/core-concepts/harbor-hub/upload",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/harbor-hub/upload，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/harbor-hub/download",
        "title": "core-concepts/harbor-hub/download",
        "webPath": "/docs/core-concepts/harbor-hub/download",
        "officialUrl": "https://docs.harborframework.com/core-concepts/harbor-hub/download",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/harbor-hub/download，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/harbor-hub/hosted-jobs",
        "title": "core-concepts/harbor-hub/hosted-jobs",
        "webPath": "/docs/core-concepts/harbor-hub/hosted-jobs",
        "officialUrl": "https://docs.harborframework.com/core-concepts/harbor-hub/hosted-jobs",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/harbor-hub/hosted-jobs，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/harbor-hub/leaderboards",
        "title": "core-concepts/harbor-hub/leaderboards",
        "webPath": "/docs/core-concepts/harbor-hub/leaderboards",
        "officialUrl": "https://docs.harborframework.com/core-concepts/harbor-hub/leaderboards",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/harbor-hub/leaderboards，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/harbor-hub/sharing",
        "title": "core-concepts/harbor-hub/sharing",
        "webPath": "/docs/core-concepts/harbor-hub/sharing",
        "officialUrl": "https://docs.harborframework.com/core-concepts/harbor-hub/sharing",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/harbor-hub/sharing，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/hosted-harbor/index",
        "title": "core-concepts/hosted-harbor/index",
        "webPath": "/docs/core-concepts/hosted-harbor/index",
        "officialUrl": "https://docs.harborframework.com/core-concepts/hosted-harbor/index",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/hosted-harbor/index，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/hosted-harbor/api-key",
        "title": "core-concepts/hosted-harbor/api-key",
        "webPath": "/docs/core-concepts/hosted-harbor/api-key",
        "officialUrl": "https://docs.harborframework.com/core-concepts/hosted-harbor/api-key",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/hosted-harbor/api-key，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/hosted-harbor/web-ui",
        "title": "core-concepts/hosted-harbor/web-ui",
        "webPath": "/docs/core-concepts/hosted-harbor/web-ui",
        "officialUrl": "https://docs.harborframework.com/core-concepts/hosted-harbor/web-ui",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/hosted-harbor/web-ui，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/hosted-harbor/cli",
        "title": "core-concepts/hosted-harbor/cli",
        "webPath": "/docs/core-concepts/hosted-harbor/cli",
        "officialUrl": "https://docs.harborframework.com/core-concepts/hosted-harbor/cli",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/hosted-harbor/cli，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/hosted-harbor/api",
        "title": "core-concepts/hosted-harbor/api",
        "webPath": "/docs/core-concepts/hosted-harbor/api",
        "officialUrl": "https://docs.harborframework.com/core-concepts/hosted-harbor/api",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/hosted-harbor/api，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/hosted-harbor/submitting-jobs",
        "title": "core-concepts/hosted-harbor/submitting-jobs",
        "webPath": "/docs/core-concepts/hosted-harbor/submitting-jobs",
        "officialUrl": "https://docs.harborframework.com/core-concepts/hosted-harbor/submitting-jobs",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/hosted-harbor/submitting-jobs，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/hosted-harbor/custom-agents",
        "title": "core-concepts/hosted-harbor/custom-agents",
        "webPath": "/docs/core-concepts/hosted-harbor/custom-agents",
        "officialUrl": "https://docs.harborframework.com/core-concepts/hosted-harbor/custom-agents",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/hosted-harbor/custom-agents，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/hosted-harbor/secrets",
        "title": "core-concepts/hosted-harbor/secrets",
        "webPath": "/docs/core-concepts/hosted-harbor/secrets",
        "officialUrl": "https://docs.harborframework.com/core-concepts/hosted-harbor/secrets",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/hosted-harbor/secrets，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/hosted-harbor/registry-credentials",
        "title": "core-concepts/hosted-harbor/registry-credentials",
        "webPath": "/docs/core-concepts/hosted-harbor/registry-credentials",
        "officialUrl": "https://docs.harborframework.com/core-concepts/hosted-harbor/registry-credentials",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/hosted-harbor/registry-credentials，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/rewardkit/quick-start",
        "title": "core-concepts/rewardkit/quick-start",
        "webPath": "/docs/core-concepts/rewardkit/quick-start",
        "officialUrl": "https://docs.harborframework.com/core-concepts/rewardkit/quick-start",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/rewardkit/quick-start，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/rewardkit/judge-criteria",
        "title": "core-concepts/rewardkit/judge-criteria",
        "webPath": "/docs/core-concepts/rewardkit/judge-criteria",
        "officialUrl": "https://docs.harborframework.com/core-concepts/rewardkit/judge-criteria",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/rewardkit/judge-criteria，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/rewardkit/built-in-criteria",
        "title": "core-concepts/rewardkit/built-in-criteria",
        "webPath": "/docs/core-concepts/rewardkit/built-in-criteria",
        "officialUrl": "https://docs.harborframework.com/core-concepts/rewardkit/built-in-criteria",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/rewardkit/built-in-criteria，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/rewardkit/motivation-and-design",
        "title": "core-concepts/rewardkit/motivation-and-design",
        "webPath": "/docs/core-concepts/rewardkit/motivation-and-design",
        "officialUrl": "https://docs.harborframework.com/core-concepts/rewardkit/motivation-and-design",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/rewardkit/motivation-and-design，请确认是否下线。"
      },
      {
        "kind": "removed",
        "slug": "core-concepts/tasks/windows-tasks",
        "title": "core-concepts/tasks/windows-tasks",
        "webPath": "/docs/core-concepts/tasks/windows-tasks",
        "officialUrl": "https://docs.harborframework.com/core-concepts/tasks/windows-tasks",
        "detail": "GitHub docs-mintlify 已不再包含该页。中文站仍保留在 /docs/core-concepts/tasks/windows-tasks，请确认是否下线。"
      }
    ]
  },
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
