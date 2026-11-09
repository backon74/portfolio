"use client";

import { useEffect, useState } from "react";
import { WidgetFrame } from "./WidgetFrame";
import type { GitHubWidgetData } from "@/lib/github";
import { links } from "@/content/site";

export const GITHUB_WIDGET_SIZE = { w: 340, h: 170 } as const;

const WEEKS = 20;
const DAYS = 7;
const CELL = 11;
const GAP = 3;

type State = "loading" | "ok" | "empty";

function levelClass(level: number): string {
  if (level >= 4) return "bg-[color:var(--color-gh-4)]";
  if (level === 3) return "bg-[color:var(--color-gh-3)]";
  if (level === 2) return "bg-[color:var(--color-gh-2)]";
  if (level === 1) return "bg-[color:var(--color-gh-1)]";
  return "bg-[color:var(--color-gh-0)]";
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso + "T00:00:00Z");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  } catch {
    return iso;
  }
}

export function GitHubWidget() {
  const [data, setData] = useState<GitHubWidgetData | null>(null);
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/github", { cache: "no-store" });
        if (!res.ok) throw new Error("bad status");
        const json = (await res.json()) as GitHubWidgetData;
        if (cancelled) return;
        setData(json);
        setState(json.weeks.length > 0 ? "ok" : "empty");
      } catch {
        if (!cancelled) setState("empty");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const href = links.github;

  return (
    <WidgetFrame width={GITHUB_WIDGET_SIZE.w} height={GITHUB_WIDGET_SIZE.h} label="GitHub activity" code="GH-A74">
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="flex h-full flex-col gap-[8px] p-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      >
        <div className="flex items-baseline justify-between">
          <div className="text-[13px] font-semibold text-[color:var(--color-ink)]">GitHub</div>
          <div className="text-[11px] text-[color:var(--color-ink-3)]">@{links.githubUser}</div>
        </div>
        <div className="flex items-end" style={{ height: DAYS * CELL + (DAYS - 1) * GAP }}>
          {state === "loading" ? (
            <div
              className="animate-pulse rounded-[4px] bg-[color:var(--color-surface-3)]"
              style={{ width: WEEKS * CELL + (WEEKS - 1) * GAP, height: DAYS * CELL + (DAYS - 1) * GAP }}
              aria-hidden
            />
          ) : state === "ok" && data ? (
            <div className="flex" style={{ gap: GAP }} aria-label="Contribution calendar">
              {data.weeks.slice(-WEEKS).map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                  {Array.from({ length: DAYS }).map((_, di) => {
                    const day = week[di];
                    if (!day) {
                      return (
                        <div
                          key={di}
                          className="rounded-[2px] bg-transparent"
                          style={{ width: CELL, height: CELL }}
                        />
                      );
                    }
                    const label = `${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`;
                    return (
                      <div
                        key={di}
                        title={label}
                        aria-label={label}
                        className={`rounded-[2px] ${levelClass(day.level)}`}
                        style={{ width: CELL, height: CELL }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[12px] text-[color:var(--color-ink-3)]">
              View my GitHub →
            </div>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between text-[11px] text-[color:var(--color-ink-3)]">
          <span>
            {state === "ok" && data?.total != null
              ? `${data.total.toLocaleString()} contributions in the last year`
              : state === "loading"
                ? "Loading…"
                : "Recent activity unavailable"}
          </span>
          <span className="text-[color:var(--color-accent)]">Open ↗</span>
        </div>
      </a>
    </WidgetFrame>
  );
}
