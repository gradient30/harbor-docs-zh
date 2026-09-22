import raw from "./official-map.json" with { type: "json" };

export const OFFICIAL_OWNER = "harbor-framework";
export const OFFICIAL_REPO = "harbor";
export const OFFICIAL_DOCS_PREFIX = "docs-mintlify";
export const OFFICIAL_DOCS_SITE = "https://docs.harborframework.com";
export const OFFICIAL_BLOB_BASE = "https://github.com/harbor-framework/harbor/blob/main";
export const LLMS_TXT = "https://docs.harborframework.com/llms.txt";

export type DocKind = "official" | "additive";

export type DocFingerprint = {
  slug: string;
  section: string;
  kind: DocKind;
  officialPath: string | null;
  size: number | null;
  lastSeenSha: string | null;
  translatedAtSha: string | null;
  contentSha?: string | null;
  webPath?: string;
  officialUrl?: string;
};

export type MapSnapshot = {
  capturedAt: string;
  officialRef: string;
  docsTreeSha: string;
  source: string;
  docs: DocFingerprint[];
  releases: unknown[];
};

export const MAP_SNAPSHOT = raw as MapSnapshot;

export const SECTION_META: { id: string; title: string }[] = [
  { id: "additive", title: "本站加页" },
  { id: "start", title: "开始" },
  { id: "tasks", title: "任务" },
  { id: "datasets", title: "数据集" },
  { id: "jobs", title: "作业" },
  { id: "agents", title: "Agent" },
  { id: "sandboxes", title: "沙箱" },
  { id: "plugins", title: "插件" },
  { id: "results", title: "结果" },
  { id: "hub", title: "Harbor Hub" },
  { id: "hosted", title: "托管 Harbor" },
  { id: "rewardkit", title: "RewardKit" },
  { id: "tutorials", title: "教程" },
  { id: "contrib", title: "贡献" },
  { id: "privacy", title: "用量" },
  { id: "news", title: "新闻" },
  { id: "other", title: "未分区" },
];

export type OfficialBlob = { path: string; sha: string; size: number };

export type DocStatus = "match" | "stale" | "added" | "removed" | "additive";

export type DocRow = {
  slug: string;
  section: string;
  kind: DocKind;
  officialPath: string | null;
  liveSha: string | null;
  lastSeenSha: string | null;
  translatedAtSha: string | null;
  size: number | null;
  status: DocStatus;
  webPath: string;
  officialUrl: string | null;
};

export function pathToSlug(relPath: string): string {
  const trimmed = relPath.replace(/^\/+/, "").replace(/^docs-mintlify\//, "");
  const noExt = trimmed.replace(/\.mdx$/i, "").replace(/\.md$/i, "");
  return noExt === "index" ? "index" : noExt;
}

export function officialHref(slug: string): string {
  return slug === "index" ? `${OFFICIAL_DOCS_SITE}/` : `${OFFICIAL_DOCS_SITE}/${slug}`;
}

export function handbookHref(slug: string): string {
  return slug === "index" ? "/" : `/docs/${slug}`;
}

export function blobHref(officialPath: string): string {
  return `${OFFICIAL_BLOB_BASE}/${officialPath}`;
}

export function shortSha(sha: string | null | undefined): string {
  if (!sha) return "—";
  return sha.slice(0, 7);
}

export function compareDocs(snapshot: MapSnapshot, liveBlobs: OfficialBlob[] | null): DocRow[] {
  const liveBySlug = new Map<string, OfficialBlob>();
  if (liveBlobs) {
    for (const blob of liveBlobs) liveBySlug.set(pathToSlug(blob.path), blob);
  }
  const rows: DocRow[] = [];
  const seen = new Set<string>();

  for (const doc of snapshot.docs) {
    seen.add(doc.slug);
    if (doc.kind === "additive") {
      rows.push({
        slug: doc.slug,
        section: doc.section,
        kind: "additive",
        officialPath: null,
        liveSha: null,
        lastSeenSha: null,
        translatedAtSha: null,
        size: null,
        status: "additive",
        webPath: doc.webPath ?? handbookHref(doc.slug),
        officialUrl: null,
      });
      continue;
    }
    const live = liveBlobs ? liveBySlug.get(doc.slug) : undefined;
    const compareSha = live?.sha ?? doc.lastSeenSha;
    let status: DocStatus;
    if (liveBlobs && !live) status = "removed";
    else if (!doc.translatedAtSha) status = "stale";
    else if (compareSha && compareSha !== doc.translatedAtSha) status = "stale";
    else status = "match";
    rows.push({
      slug: doc.slug,
      section: doc.section,
      kind: "official",
      officialPath: doc.officialPath,
      liveSha: live?.sha ?? null,
      lastSeenSha: doc.lastSeenSha,
      translatedAtSha: doc.translatedAtSha,
      size: live?.size ?? doc.size,
      status,
      webPath: doc.webPath ?? handbookHref(doc.slug),
      officialUrl: doc.officialUrl ?? officialHref(doc.slug),
    });
  }

  if (liveBlobs) {
    for (const blob of liveBlobs) {
      const slug = pathToSlug(blob.path);
      if (seen.has(slug)) continue;
      if (!slug || slug.includes(".mintlify") || slug.endsWith("README") || slug === "ai-agents") continue;
      rows.push({
        slug,
        section: "other",
        kind: "official",
        officialPath: `${OFFICIAL_DOCS_PREFIX}/${blob.path}`,
        liveSha: blob.sha,
        lastSeenSha: null,
        translatedAtSha: null,
        size: blob.size,
        status: "added",
        webPath: handbookHref(slug),
        officialUrl: officialHref(slug),
      });
    }
  }

  return sortDocRows(rows);
}

export function sortDocRows(rows: DocRow[]): DocRow[] {
  const sectionRank = new Map(SECTION_META.map((s, i) => [s.id, i]));
  return [...rows].sort((a, b) => {
    const sa = sectionRank.get(a.section) ?? 99;
    const sb = sectionRank.get(b.section) ?? 99;
    if (sa !== sb) return sa - sb;
    return a.slug.localeCompare(b.slug);
  });
}

export function docsSummary(rows: DocRow[]) {
  return {
    official: rows.filter((r) => r.kind === "official").length,
    match: rows.filter((r) => r.status === "match").length,
    stale: rows.filter((r) => r.status === "stale").length,
    added: rows.filter((r) => r.status === "added").length,
    removed: rows.filter((r) => r.status === "removed").length,
    additive: rows.filter((r) => r.status === "additive").length,
  };
}

export function formatDriftList(docs: DocRow[]): string {
  const stale = docs.filter((d) => d.status === "stale" || d.status === "added" || d.status === "removed");
  if (stale.length === 0) return "对照表：手册均无待办。";
  const lines = ["手册待办："];
  for (const row of stale) {
    const from = shortSha(row.translatedAtSha);
    const to = shortSha(row.liveSha ?? row.lastSeenSha);
    const loc = row.webPath;
    lines.push(
      `- ${row.status === "added" ? "新页" : row.status === "removed" ? "已删" : "待更新"} ${row.slug}  中文站 ${loc}  ${from} → ${to}`,
    );
  }
  return lines.join("\n");
}

export function bakedDocsAsBlobs(snapshot: MapSnapshot): OfficialBlob[] {
  return snapshot.docs
    .filter((d) => d.kind === "official" && d.lastSeenSha)
    .map((d) => ({
      path: d.officialPath?.replace(`${OFFICIAL_DOCS_PREFIX}/`, "") ?? `${d.slug}.mdx`,
      sha: d.lastSeenSha as string,
      size: d.size ?? 0,
    }));
}
