#!/usr/bin/env node
/**
 * Compare harbor-framework/harbor docs-mintlify/*.mdx blob SHAs against
 * official-map.json. On drift:
 *   - update lastSeenSha / size
 *   - prepend an entry to update-logs.ts (what changed + Chinese webPath)
 *   - write a zh stub for newly added pages
 *
 * Live sitemap uses the same git blob SHAs, so fingerprints stay aligned.
 * Does not rewrite translations. Stale rows stay stale until
 * `--mark-translated <slug,slug>`.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MAP_PATH = join(ROOT, "src/lib/docs/official-map.json");
const LOG_PATH = join(ROOT, "src/lib/docs/update-logs.ts");
const ZH_ROOT = join(ROOT, "src/content/zh");
const TREE_URL = "https://api.github.com/repos/harbor-framework/harbor/git/trees/main?recursive=1";
const INDEX = "https://docs.harborframework.com/llms.txt";
const PREFIX = "docs-mintlify/";

type Doc = {
  slug: string;
  section: string;
  kind: "official" | "additive";
  officialPath: string | null;
  size: number | null;
  lastSeenSha: string | null;
  translatedAtSha: string | null;
  contentSha?: string | null;
  webPath?: string;
  officialUrl?: string;
};

type Snapshot = {
  capturedAt: string;
  officialRef: string;
  docsTreeSha: string;
  source: string;
  docs: Doc[];
  releases: unknown[];
};

type Blob = { path: string; sha: string; size: number };

function sha16(buf: Buffer | string): string {
  return createHash("sha256").update(buf).digest("hex").slice(0, 16);
}

function pathToSlug(relPath: string): string {
  const trimmed = relPath.replace(/^\/+/, "").replace(/^docs-mintlify\//, "");
  const noExt = trimmed.replace(/\.mdx$/i, "").replace(/\.md$/i, "");
  return noExt === "index" ? "index" : noExt;
}

function webPath(slug: string): string {
  return slug === "index" ? "/" : `/docs/${slug}`;
}

function officialUrl(slug: string): string {
  return slug === "index" ? "https://docs.harborframework.com/" : `https://docs.harborframework.com/${slug}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function sectionOf(slug: string): string {
  if (slug.startsWith("getting-started/") || slug === "index" || slug === "core-concepts/index") return "start";
  if (slug.startsWith("core-concepts/tasks/")) return "tasks";
  if (slug.startsWith("core-concepts/datasets/")) return "datasets";
  if (slug.startsWith("core-concepts/jobs/")) return "jobs";
  if (slug.startsWith("core-concepts/agents/")) return "agents";
  if (slug.startsWith("core-concepts/sandboxes/")) return "sandboxes";
  if (slug.startsWith("core-concepts/plugins/")) return "plugins";
  if (slug.startsWith("core-concepts/results/")) return "results";
  if (slug.startsWith("core-concepts/harbor-hub/")) return "hub";
  if (slug.startsWith("core-concepts/hosted-harbor/")) return "hosted";
  if (slug.startsWith("core-concepts/rewardkit/")) return "rewardkit";
  if (slug.startsWith("tutorials/")) return "tutorials";
  if (slug.startsWith("contributing/")) return "contrib";
  if (slug.startsWith("telemetry/")) return "privacy";
  if (slug === "news" || slug.startsWith("news/")) return "news";
  if (slug === "changelog") return "other";
  return "other";
}

function keepBlob(path: string): boolean {
  if (!path.startsWith(PREFIX) || !path.endsWith(".mdx")) return false;
  const rel = path.slice(PREFIX.length);
  if (rel.startsWith(".mintlify/") || rel === "README.mdx" || rel === "ai-agents.mdx") return false;
  if (rel.startsWith("api-sdk-reference/") || rel.startsWith("cli-reference/")) return false;
  return true;
}

function markTranslated(snap: Snapshot, slugs: string[]) {
  const set = new Set(slugs);
  for (const doc of snap.docs) {
    if (!set.has(doc.slug)) continue;
    if (doc.lastSeenSha) doc.translatedAtSha = doc.lastSeenSha;
  }
}

function prependLog(entry: {
  id: string;
  date: string;
  title: string;
  summary: string;
  sourceHint: string;
  changes: Array<{
    kind: "added" | "updated" | "removed" | "site";
    slug: string;
    title: string;
    webPath: string;
    officialUrl?: string;
    detail: string;
  }>;
}) {
  const src = readFileSync(LOG_PATH, "utf8");
  const marker = "export const UPDATE_LOGS: UpdateLog[] = [";
  const i = src.indexOf(marker);
  if (i < 0) throw new Error("cannot find UPDATE_LOGS array");
  const insertAt = i + marker.length;
  const block =
    "\n  " +
    JSON.stringify(entry, null, 2)
      .split("\n")
      .map((l, n) => (n === 0 ? l : "  " + l))
      .join("\n") +
    ",";
  writeFileSync(LOG_PATH, src.slice(0, insertAt) + block + src.slice(insertAt));
}

function writeZhStub(slug: string, title: string) {
  const file = join(ZH_ROOT, slug === "index" ? "index.md" : `${slug}.md`);
  if (existsSync(file)) return false;
  mkdirSync(dirname(file), { recursive: true });
  const id = slug.split("/").pop() ?? slug;
  const body = `# ${title} {#${id}}

> 官网新增页面，中文正文待补。

> 本页由每日同步自动建档。中文站位置：${webPath(slug)}。对照表见 [/docs/sitemap](/docs/sitemap)，完成后用 \`npm run sync:docs -- --mark-translated ${slug}\` 对齐指纹。
`;
  writeFileSync(file, body);
  return true;
}

const args = process.argv.slice(2);
const markIdx = args.indexOf("--mark-translated");
const markSlugs = markIdx >= 0 ? (args[markIdx + 1] ?? "").split(",").filter(Boolean) : [];

const snap = JSON.parse(readFileSync(MAP_PATH, "utf8")) as Snapshot;

if (markSlugs.length) {
  markTranslated(snap, markSlugs);
  snap.capturedAt = today();
  writeFileSync(MAP_PATH, JSON.stringify(snap, null, 2) + "\n");
  console.log("marked translated:", markSlugs.join(", "));
  process.exit(0);
}

const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "HarborZhDocs/1.0",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const treeRes = await fetch(TREE_URL, { headers });
if (!treeRes.ok) throw new Error(`github tree ${treeRes.status}`);
const treeData = (await treeRes.json()) as {
  sha?: string;
  tree?: Array<{ path: string; type: string; sha: string; size?: number }>;
};

const live = new Map<string, Blob>();
for (const item of treeData.tree ?? []) {
  if (item.type !== "blob") continue;
  if (!keepBlob(item.path)) continue;
  const rel = item.path.slice(PREFIX.length);
  live.set(pathToSlug(rel), { path: rel, sha: item.sha, size: item.size ?? 0 });
}

const changes: Array<{
  kind: "added" | "updated" | "removed";
  slug: string;
  title: string;
  webPath: string;
  officialUrl: string;
  detail: string;
}> = [];

const bySlug = new Map(snap.docs.map((d) => [d.slug, d]));

for (const [slug, info] of live) {
  const existing = bySlug.get(slug);
  if (!existing) {
    const title = slug.split("/").pop() ?? slug;
    snap.docs.push({
      slug,
      section: sectionOf(slug),
      kind: "official",
      officialPath: `${PREFIX}${info.path}`,
      size: info.size,
      lastSeenSha: info.sha,
      translatedAtSha: null,
      contentSha: null,
      webPath: webPath(slug),
      officialUrl: officialUrl(slug),
    });
    const stub = writeZhStub(slug, title);
    changes.push({
      kind: "added",
      slug,
      title,
      webPath: webPath(slug),
      officialUrl: officialUrl(slug),
      detail: `官网新增页面（GitHub SHA ${info.sha.slice(0, 7)}）。中文站位置：${webPath(slug)}${stub ? "，已自动建档待补译" : ""}。`,
    });
    continue;
  }
  if (existing.kind !== "official") continue;
  if (existing.lastSeenSha !== info.sha) {
    const was = existing.translatedAtSha;
    existing.lastSeenSha = info.sha;
    existing.size = info.size;
    existing.officialPath = `${PREFIX}${info.path}`;
    if (was && was !== info.sha) {
      changes.push({
        kind: "updated",
        slug,
        title: slug,
        webPath: existing.webPath ?? webPath(slug),
        officialUrl: existing.officialUrl ?? officialUrl(slug),
        detail: `GitHub blob ${was.slice(0, 7)} → ${info.sha.slice(0, 7)}。中文站：${existing.webPath ?? webPath(slug)}。`,
      });
    } else if (!was) {
      existing.lastSeenSha = info.sha;
    }
  }
}

for (const doc of snap.docs) {
  if (doc.kind !== "official") continue;
  if (!live.has(doc.slug)) {
    changes.push({
      kind: "removed",
      slug: doc.slug,
      title: doc.slug,
      webPath: doc.webPath ?? webPath(doc.slug),
      officialUrl: doc.officialUrl ?? officialUrl(doc.slug),
      detail: `GitHub docs-mintlify 已不再包含该页。中文站仍保留在 ${doc.webPath ?? webPath(doc.slug)}，请确认是否下线。`,
    });
  }
}

const prevTree = snap.docsTreeSha;
const nextTree = treeData.sha ?? sha16([...live.values()].map((v) => v.sha).join("|"));
const treeMoved = Boolean(nextTree && nextTree !== prevTree);

if (changes.length === 0 && !treeMoved && snap.source === TREE_URL) {
  console.log("no official drift", live.size, "pages");
  process.exit(0);
}

snap.capturedAt = today();
snap.officialRef = "main";
snap.docsTreeSha = nextTree;
snap.source = TREE_URL;
writeFileSync(MAP_PATH, JSON.stringify(snap, null, 2) + "\n");

if (changes.length === 0) {
  console.log("tree sha updated, no page drift", live.size, "pages");
  process.exit(0);
}

const date = today();
const id = `${date}-${sha16(changes.map((c) => c.slug).join(",")).slice(0, 6)}`;
prependLog({
  id,
  date,
  title: `官网对照：${changes.length} 处变动`,
  summary: changes
    .slice(0, 8)
    .map((c) => `${c.kind === "added" ? "新增" : c.kind === "removed" ? "移除" : "更新"} ${c.webPath}`)
    .join("；"),
  sourceHint: `${INDEX} · ${TREE_URL}`,
  changes: changes.map((c) => ({
    kind: c.kind,
    slug: c.slug,
    title: c.title,
    webPath: c.webPath,
    officialUrl: c.officialUrl,
    detail: c.detail,
  })),
});

console.log("wrote update log", id, "changes", changes.length);
for (const c of changes) console.log(`  ${c.kind} ${c.webPath}`);
