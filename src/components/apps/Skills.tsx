"use client";

import { useState } from "react";
import { skills } from "@/content/skills";
import { systemInfo } from "@/content/site";
import { resolveUsedIn } from "@/lib/content";
import { useOs } from "@/os/store";
import { cn } from "@/lib/cn";

export default function Skills() {
  const [selectedId, setSelectedId] = useState<string>(skills[0]?.id ?? "");
  const group = skills.find((g) => g.id === selectedId) ?? skills[0];
  const open = useOs((s) => s.open);

  const handleUsedIn = (id: string) => {
    const r = resolveUsedIn(id);
    if (r.kind === "project") {
      open("caseStudy", { payload: { slug: r.slug } });
    } else if (r.kind === "role") {
      open("files", { payload: { location: "experience" } });
    }
    // portfolio / unknown: no-op
  };

  return (
    <div className="flex h-full w-full" style={{ background: "var(--color-surface)" }}>
      {/* Sidebar */}
      <aside
        className="flex w-[200px] shrink-0 flex-col gap-[2px] p-3"
        style={{
          background: "var(--color-surface-2)",
          borderRight: "1px solid var(--color-hairline)",
        }}
      >
        <div className="px-2 pt-1 pb-2 text-[11px] font-semibold tracking-[0.06em] text-[color:var(--color-ink-3)] uppercase">
          Categories
        </div>
        {skills.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setSelectedId(g.id)}
            aria-current={selectedId === g.id ? "true" : undefined}
            className={cn(
              "flex w-full items-center rounded-[8px] px-2 py-[6px] text-left text-[13px]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40",
              selectedId === g.id
                ? "bg-[color:var(--color-accent-soft)] font-semibold text-[color:var(--color-accent)]"
                : "text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-3)]",
            )}
          >
            {g.label}
          </button>
        ))}
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* "About this machine" summary */}
        <div
          className="m-5 flex flex-col gap-2 rounded-[12px] p-4"
          style={{
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-hairline)",
          }}
        >
          <div className="text-[11px] font-semibold tracking-[0.06em] text-[color:var(--color-ink-3)] uppercase">
            System Information
          </div>
          <dl className="grid gap-x-6 gap-y-1" style={{ gridTemplateColumns: "140px 1fr" }}>
            {systemInfo.map((row) => (
              <div key={row.k} className="contents">
                <dt className="text-[12px] font-medium text-[color:var(--color-ink-2)]">{row.k}</dt>
                <dd className="text-[13px] text-[color:var(--color-ink)]">{row.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {group && (
          <section className="px-5 pb-6">
            <h2 className="mb-3 text-[15px] font-semibold text-[color:var(--color-ink)]">{group.label}</h2>
            <div
              className="overflow-hidden rounded-[10px]"
              style={{ border: "1px solid var(--color-hairline)" }}
            >
              <table className="w-full border-collapse text-left text-[13px]">
                <thead style={{ background: "var(--color-surface-2)" }}>
                  <tr className="text-[11px] font-semibold tracking-[0.04em] text-[color:var(--color-ink-3)] uppercase">
                    <th className="px-3 py-2">Skill</th>
                    <th className="px-3 py-2">Used</th>
                    <th className="px-3 py-2">In</th>
                  </tr>
                </thead>
                <tbody>
                  {group.skills.map((s) => (
                    <tr key={s.name} className="h-[40px] border-t border-[color:var(--color-hairline)]">
                      <td className="px-3 font-medium text-[color:var(--color-ink)]">{s.name}</td>
                      <td className="px-3">
                        <UsedDots count={s.usedIn.length} />
                      </td>
                      <td className="px-3 text-[color:var(--color-ink-2)]">
                        <UsedInList ids={s.usedIn} onPick={handleUsedIn} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function UsedDots({ count }: { count: number }) {
  const level = Math.min(3, count);
  return (
    <span className="inline-flex items-center gap-[3px]" aria-label={`Used in ${count}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block h-[6px] w-[6px] rounded-full"
          style={{
            background:
              i < level ? "var(--color-accent)" : "var(--color-surface-3)",
          }}
        />
      ))}
    </span>
  );
}

function UsedInList({ ids, onPick }: { ids: string[]; onPick: (id: string) => void }) {
  if (ids.length === 0) {
    return <span className="text-[color:var(--color-ink-3)]">—</span>;
  }
  return (
    <span className="flex flex-wrap gap-x-2 gap-y-1">
      {ids.map((id, i) => {
        const r = resolveUsedIn(id);
        if (r.kind === "portfolio") {
          return (
            <span key={id} className="text-[color:var(--color-ink-3)]">
              this site{i < ids.length - 1 ? "," : ""}
            </span>
          );
        }
        if (r.kind === "project" || r.kind === "role") {
          const label = r.kind === "project" ? r.name : r.label;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onPick(id)}
              className="text-[color:var(--color-accent)] hover:underline focus:outline-none focus-visible:underline"
            >
              {label}
              {i < ids.length - 1 ? "," : ""}
            </button>
          );
        }
        return (
          <span key={id} className="text-[color:var(--color-ink-3)]">
            {id}
            {i < ids.length - 1 ? "," : ""}
          </span>
        );
      })}
    </span>
  );
}
