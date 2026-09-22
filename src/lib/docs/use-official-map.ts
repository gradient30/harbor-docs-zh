import { useEffect, useMemo, useState } from "react";
import {
  MAP_SNAPSHOT,
  compareDocs,
  type DocRow,
  type OfficialBlob,
} from "./official-map";

const CACHE_KEY = "harbor-handbook-official-map-v1";
const CACHE_MS = 6 * 60 * 60 * 1000;

type CacheShape = {
  at: number;
  blobs: OfficialBlob[];
};

type State = {
  docs: DocRow[];
  source: "baked" | "cache" | "live";
  loading: boolean;
  error: string | null;
  syncedAt: string | null;
};

function readCache(): CacheShape | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheShape;
    if (!parsed?.at || !Array.isArray(parsed.blobs)) return null;
    if (Date.now() - parsed.at > CACHE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(blobs: OfficialBlob[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), blobs } satisfies CacheShape));
  } catch {
    /* ignore */
  }
}

async function fetchLiveBlobs(): Promise<OfficialBlob[]> {
  const res = await fetch(
    "https://api.github.com/repos/harbor-framework/harbor/git/trees/main?recursive=1",
    { headers: { Accept: "application/vnd.github+json" } },
  );
  if (!res.ok) throw new Error(`github ${res.status}`);
  const data = (await res.json()) as {
    tree?: Array<{ path: string; type: string; sha: string; size?: number }>;
  };
  const out: OfficialBlob[] = [];
  for (const item of data.tree ?? []) {
    if (item.type !== "blob") continue;
    if (!item.path.startsWith("docs-mintlify/")) continue;
    if (!item.path.endsWith(".mdx")) continue;
    const rel = item.path.slice("docs-mintlify/".length);
    if (rel.startsWith(".mintlify/") || rel === "README.mdx" || rel === "ai-agents.mdx") continue;
    if (rel.startsWith("api-sdk-reference/") || rel.startsWith("cli-reference/")) continue;
    out.push({ path: rel, sha: item.sha, size: item.size ?? 0 });
  }
  return out;
}

let inflight: Promise<OfficialBlob[]> | null = null;
const listeners = new Set<(blobs: OfficialBlob[] | null, err: string | null) => void>();

export function refreshOfficialMap() {
  inflight = fetchLiveBlobs()
    .then((blobs) => {
      writeCache(blobs);
      for (const fn of listeners) fn(blobs, null);
      return blobs;
    })
    .catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : "对照失败";
      for (const fn of listeners) fn(null, msg);
      throw err;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useOfficialMap(): State {
  const baked = useMemo(() => compareDocs(MAP_SNAPSHOT, null), []);
  const [live, setLive] = useState<OfficialBlob[] | null>(null);
  const [source, setSource] = useState<"baked" | "cache" | "live">("baked");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setLive(cached.blobs);
      setSource("cache");
      setSyncedAt(new Date(cached.at).toISOString());
      setLoading(false);
    }

    const on = (blobs: OfficialBlob[] | null, err: string | null) => {
      if (blobs) {
        setLive(blobs);
        setSource("live");
        setSyncedAt(new Date().toISOString());
        setError(null);
      }
      if (err) setError(err);
      setLoading(false);
    };
    listeners.add(on);
    if (!inflight) {
      void refreshOfficialMap().catch(() => undefined);
    }
    return () => {
      listeners.delete(on);
    };
  }, []);

  const docs = useMemo(() => compareDocs(MAP_SNAPSHOT, live), [live]);
  return { docs: live ? docs : baked, source, loading, error, syncedAt };
}
