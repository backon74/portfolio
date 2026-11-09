"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Code2 } from "lucide-react";
import type { AppPayload } from "@/os/apps";
import { useOs } from "@/os/store";
import { adjacentProjects, findProject } from "@/lib/content";
import { isTodo } from "@/content/types";
import type { Project } from "@/content/types";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Button, Chip, ProofBadge, MaybeText, MetricTile } from "@/components/ui/atoms";
import { cn } from "@/lib/cn";

export default function CaseStudy({ payload }: { payload?: AppPayload }) {
  const slug = (payload?.slug as string | undefined) ?? "";
  const project = findProject(slug);

  if (!project) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6 text-center">
        <p className="text-[13px] text-[color:var(--color-ink-2)]">
          Project not found: <code className="font-mono">{slug}</code>
        </p>
      </div>
    );
  }
  return <CaseStudyBody project={project} />;
}

function CaseStudyBody({ project }: { project: Project }) {
  const { prev, next } = adjacentProjects(project.slug);
  const open = useOs((s) => s.open);

  const github = resolveLink(project.github);
  const demo = resolveLink(project.demo);

  return (
    <div className="flex h-full w-full flex-col overflow-auto" data-case-study={project.slug}>
      <div className="mx-auto flex w-full max-w-[820px] flex-col gap-7 p-6">
        {/* Header */}
        <header className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span
              className="mono-stroke"
              style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--color-accent)" }}
            >
              · CASE STUDY · {project.categories.join(" · ").toUpperCase()}
            </span>
            {project.proof && <ProofBadge icon={project.proof.icon} text={project.proof.text} />}
            <span
              className="mono-stroke ml-auto text-[10px] tabular-nums"
              style={{ letterSpacing: "0.2em", color: "var(--color-ink-3)" }}
            >
              <MaybeText value={project.year} />
            </span>
          </div>
          <h1
            className="text-[40px] leading-[1.02] font-bold text-[color:var(--color-ink)]"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, var(--color-ink) 0%, var(--color-accent) 70%, var(--color-accent-hot) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {project.name}
          </h1>
          <p className="text-[17px] leading-[1.5] text-[color:var(--color-ink-2)]">{project.pitch}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {github && (
              <Button href={github} target="_blank" variant="secondary">
                <Code2 size={14} />
                GitHub
              </Button>
            )}
            {demo && (
              <Button href={demo} target="_blank" variant="secondary">
                <ExternalLink size={14} />
                Live demo
              </Button>
            )}
          </div>
        </header>

        {/* Media carousel */}
        {project.media.length > 0 && <MediaCarousel project={project} />}

        {/* Metric tiles */}
        {project.metrics.length > 0 && (
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${Math.min(3, project.metrics.length)}, 1fr)` }}
          >
            {project.metrics.map((m) => (
              <MetricTile key={m.label} value={m.value} label={m.label} />
            ))}
          </div>
        )}

        {/* Problem → What I built → Impact */}
        <section className="flex flex-col gap-5">
          <Section title="Problem">
            <p className="text-[14px] leading-6 text-[color:var(--color-ink)]">{project.problem}</p>
          </Section>
          {project.built.length > 0 && (
            <Section title="What I built">
              <ul className="flex list-disc flex-col gap-2 pl-5 text-[14px] leading-6 text-[color:var(--color-ink)]">
                {project.built.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </Section>
          )}
          {project.impact.length > 0 && (
            <Section title="Impact">
              <ul className="flex list-disc flex-col gap-2 pl-5 text-[14px] leading-6 text-[color:var(--color-ink)]">
                {project.impact.map((i, idx) => (
                  <li key={idx}>
                    <MaybeText value={i} />
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </section>

        {/* Facts panel */}
        <section
          className="grid gap-3 rounded-[12px] p-4"
          style={{
            background: "var(--color-surface-2)",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
          aria-label="Facts"
        >
          <Fact k="Role" v={<MaybeText value={project.role} />} />
          <Fact k="Team" v={<MaybeText value={project.team} />} />
          <Fact k="Timeline" v={<MaybeText value={project.timeline} />} />
          <Fact k="Context" v={project.context} />
          <div className="col-span-full">
            <div className="mb-1 text-[11px] font-semibold tracking-[0.04em] text-[color:var(--color-ink-3)] uppercase">
              Stack
            </div>
            <div className="flex flex-wrap gap-1">
              {project.stack
                .map((s) => (isTodo(s) ? null : s))
                .filter((x): x is string => !!x)
                .map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
            </div>
          </div>
        </section>

        {/* Footer prev/next */}
        <footer className="mt-4 flex items-center justify-between border-t border-[color:var(--color-hairline)] pt-4">
          <PrevNextButton
            dir="prev"
            project={prev}
            onOpen={(p) => open("caseStudy", { payload: { slug: p.slug } })}
          />
          <PrevNextButton
            dir="next"
            project={next}
            onOpen={(p) => open("caseStudy", { payload: { slug: p.slug } })}
          />
        </footer>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 text-[20px] leading-6 font-[650] tracking-[-0.01em] text-[color:var(--color-ink)]">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Fact({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div>
      <div className="mb-0.5 text-[11px] font-semibold tracking-[0.04em] text-[color:var(--color-ink-3)] uppercase">
        {k}
      </div>
      <div className="text-[13px] leading-5 text-[color:var(--color-ink)]">{v}</div>
    </div>
  );
}

function MediaCarousel({ project }: { project: Project }) {
  const [i, setI] = useState(0);
  const items = project.media;
  const count = items.length;
  const go = useCallback(
    (delta: number) => setI((prev) => (prev + delta + count) % count),
    [count],
  );
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Only respond when focus is within the window containing the carousel
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    const el = document.querySelector(`[data-case-study="${project.slug}"]`);
    el?.addEventListener("keydown", onKey as EventListener);
    return () => el?.removeEventListener("keydown", onKey as EventListener);
  }, [go, project.slug]);

  const current = items[i];
  return (
    <section aria-label="Media" className="flex flex-col gap-2">
      <ImageSlot slot={current} aspect="16 / 10" rounded={12} />
      {current.caption && (
        <p className="text-center text-[12px] text-[color:var(--color-ink-2)]">{current.caption}</p>
      )}
      {count > 1 && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => go(-1)}
            className="rounded-md p-1 text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-3)]"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-1" role="tablist" aria-label="Media pagination">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={idx === i}
                aria-label={`Show image ${idx + 1}`}
                onClick={() => setI(idx)}
                className={cn(
                  "h-[6px] rounded-full transition-all",
                  idx === i ? "w-[18px] bg-[color:var(--color-ink)]" : "w-[6px] bg-[color:var(--color-ink-3)]/50",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(1)}
            className="rounded-md p-1 text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-3)]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
}

function PrevNextButton({
  dir,
  project,
  onOpen,
}: {
  dir: "prev" | "next";
  project?: Project;
  onOpen: (p: Project) => void;
}) {
  if (!project) return <span />;
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className="flex max-w-[45%] flex-col gap-0.5 rounded-[8px] px-3 py-2 text-left text-[13px] hover:bg-[color:var(--color-surface-3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40"
    >
      <span className="text-[11px] font-medium tracking-[0.02em] text-[color:var(--color-ink-3)]">
        {dir === "prev" ? "‹ Previous project" : "Next project ›"}
      </span>
      <span className="truncate font-semibold text-[color:var(--color-ink)]">{project.name}</span>
    </button>
  );
}

function resolveLink(v: Project["github"]): string | null {
  if (v === null || v === undefined) return null;
  if (isTodo(v)) return null;
  return v;
}
