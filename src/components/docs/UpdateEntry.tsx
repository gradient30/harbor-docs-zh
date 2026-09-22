import { Link } from "@tanstack/react-router";
import { ScrollText } from "lucide-react";
import { LATEST_UPDATE } from "@/lib/docs/update-logs";

export function UpdateEntry() {
  return (
    <Link
      to="/docs/$"
      params={{ _splat: "updates" }}
      aria-label={`同步日志 ${LATEST_UPDATE.date}，查看本次官网对照更新`}
      className="flex h-11 items-center gap-1.5 rounded-md border border-border bg-bg-elevated px-2.5 text-xs text-fg-subtle hover:border-border-strong hover:text-fg"
      data-latest-update={LATEST_UPDATE.id}
    >
      <ScrollText className="size-3.5 shrink-0" aria-hidden />
      <span className="hidden md:inline">同步</span>
      <span className="font-mono text-accent">{LATEST_UPDATE.date.slice(5)}</span>
    </Link>
  );
}
