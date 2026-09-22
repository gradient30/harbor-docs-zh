import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/cn";
import { UPDATE_LOGS, kindLabel, type UpdateChange, type UpdateLog } from "@/lib/docs/update-logs";

function KindPill({ kind }: { kind: UpdateChange["kind"] }) {
  const tone =
    kind === "added"
      ? "border-accent bg-accent/10 text-accent"
      : kind === "updated"
        ? "border-accent text-accent"
        : kind === "removed"
          ? "border-destructive text-destructive"
          : "border-border text-fg-muted";
  return (
    <span className={cn("inline-flex rounded-sm border px-1.5 py-0.5 font-mono text-[11px] leading-4", tone)}>
      {kindLabel(kind)}
    </span>
  );
}

function ChangeRow({ change }: { change: UpdateChange }) {
  const inner = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <KindPill kind={change.kind} />
        <span className="text-sm text-fg">{change.title}</span>
      </div>
      <div className="mt-1 font-mono text-[11px] text-accent">{change.webPath}</div>
      <p className="mt-1 text-sm leading-6 text-fg-muted">{change.detail}</p>
    </>
  );
  if (change.slug === "index") {
    return (
      <Link to="/" className="block rounded-md border border-border bg-bg-elevated px-4 py-3 hover:border-border-strong">
        {inner}
      </Link>
    );
  }
  return (
    <Link
      to="/docs/$"
      params={{ _splat: change.slug }}
      className="block rounded-md border border-border bg-bg-elevated px-4 py-3 hover:border-border-strong"
    >
      {inner}
    </Link>
  );
}

function LogCard({ log }: { log: UpdateLog }) {
  return (
    <article id={log.id} className="scroll-mt-24 border-b border-border py-8 last:border-b-0">
      <div className="flex flex-wrap items-baseline gap-3">
        <h2 className="font-display text-xl font-semibold tracking-tight text-fg">{log.title}</h2>
        <span className="font-mono text-xs text-fg-subtle">{log.date}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-fg-muted">{log.summary}</p>
      <p className="mt-1 text-xs text-fg-subtle">{log.sourceHint}</p>
      <div className="mt-4 grid gap-2">
        {log.changes.map((c, i) => (
          <ChangeRow key={`${log.id}-${i}`} change={c} />
        ))}
      </div>
    </article>
  );
}

export function UpdateLogBoard() {
  return (
    <div className="mt-4 max-w-3xl" data-update-log-board>
      {UPDATE_LOGS.map((log) => (
        <LogCard key={log.id} log={log} />
      ))}
    </div>
  );
}
