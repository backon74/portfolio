"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, LayoutGrid, List as ListIcon } from "lucide-react";
import type { AppPayload } from "@/os/apps";
import { useOs } from "@/os/store";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import type { Project, ProjectCategory, Role, School } from "@/content/types";
import { PROJECT_CATEGORIES, filterProjects, resolveMaybeToPlain } from "@/lib/content";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Chip, ProofBadge, MaybeText } from "@/components/ui/atoms";
import { cn } from "@/lib/cn";

type Location = "projects" | "experience" | "education";
type ViewMode = "grid" | "list";

type HistoryEntry = Location;

export default function Files({ payload }: { payload?: AppPayload }) {
  const initial = (payload?.location as Location) || "projects";
  const [history, setHistory] = useState<HistoryEntry[]>([initial]);
  const [cursor, setCursor] = useState(0);
  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | ProjectCategory>("All");

  const location = history[cursor];

  const goTo = (loc: Location) => {
    if (loc === location) return;
    const next = [...history.slice(0, cursor + 1), loc];
    setHistory(next);
    setCursor(next.length - 1);
  };

  const canBack = cursor > 0;
  const canForward = cursor < history.length - 1;

  const open = useOs((s) => s.open);

  const openResearch = () => open("research");
  const openResume = () => open("resume");

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <aside
        className="flex shrink-0 flex-col gap-[2px] p-3"
        style={{
          width: 210,
          background: "linear-gradient(180deg, rgba(220,232,255,.5), rgba(255,255,255,.1))",
          borderRight: "1px solid rgba(34,211,255,.15)",
        }}
      >
        <div className="mono-stroke px-2 pt-1 pb-2 text-[10px]" style={{ letterSpacing: "0.3em", color: "var(--color-accent)" }}>
          · LOCATIONS
        </div>
        <SidebarItem label="Projects" selected={location === "projects"} onClick={() => goTo("projects")} />
        <SidebarItem label="Experience" selected={location === "experience"} onClick={() => goTo("experience")} />
        <SidebarItem label="Education" selected={location === "education"} onClick={() => goTo("education")} />
        <div className="mono-stroke mt-3 px-2 pb-2 text-[10px]" style={{ letterSpacing: "0.3em", color: "var(--color-ink-3)" }}>
          · SHORTCUTS
        </div>
        <SidebarItem label="Research" onClick={openResearch} />
        <SidebarItem label="Résumé" onClick={openResume} />
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Toolbar */}
        <div
          className="flex shrink-0 items-center gap-2 px-3 py-2"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,.4), rgba(220,232,255,.15))",
            borderBottom: "1px solid rgba(34,211,255,.15)",
          }}
        >
          <button
            type="button"
            aria-label="Back"
            disabled={!canBack}
            onClick={() => setCursor((c) => Math.max(0, c - 1))}
            className="rounded-md p-1 text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-3)] disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Forward"
            disabled={!canForward}
            onClick={() => setCursor((c) => Math.min(history.length - 1, c + 1))}
            className="rounded-md p-1 text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-3)] disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
          <h2 className="ml-2 text-[14px] font-semibold tracking-[-0.005em] text-[color:var(--color-ink)]" data-files-title>
            {location === "projects" ? "Projects" : location === "experience" ? "Experience" : "Education"}
          </h2>

          <div className="ml-auto flex items-center gap-2">
            {location === "projects" && (
              <>
                <div
                  className="flex items-center gap-1 rounded-[8px] px-2"
                  style={{
                    height: 26,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-hairline)",
                  }}
                >
                  <Search size={12} className="text-[color:var(--color-ink-3)]" />
                  <input
                    type="search"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-[140px] bg-transparent text-[12px] placeholder:text-[color:var(--color-ink-3)] focus:outline-none"
                    aria-label="Search projects"
                  />
                </div>
                <div
                  className="flex items-center gap-[2px] rounded-[8px] p-[2px]"
                  style={{ background: "var(--color-surface-3)" }}
                  role="group"
                  aria-label="View mode"
                >
                  <button
                    type="button"
                    aria-pressed={view === "grid"}
                    onClick={() => setView("grid")}
                    className={cn(
                      "flex items-center justify-center rounded-[6px] p-[4px]",
                      view === "grid" ? "bg-white shadow-[var(--shadow-card)]" : "text-[color:var(--color-ink-2)]",
                    )}
                  >
                    <LayoutGrid size={12} />
                  </button>
                  <button
                    type="button"
                    aria-pressed={view === "list"}
                    onClick={() => setView("list")}
                    className={cn(
                      "flex items-center justify-center rounded-[6px] p-[4px]",
                      view === "list" ? "bg-white shadow-[var(--shadow-card)]" : "text-[color:var(--color-ink-2)]",
                    )}
                  >
                    <ListIcon size={12} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-auto">
          {location === "projects" && (
            <ProjectsPane
              view={view}
              query={query}
              category={category}
              setCategory={setCategory}
            />
          )}
          {location === "experience" && <ExperiencePane />}
          {location === "education" && <EducationPane />}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-[8px] px-2 py-[6px] text-left text-[13px]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40",
        selected
          ? "bg-[color:var(--color-accent-soft)] font-semibold text-[color:var(--color-accent)]"
          : "text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-3)]",
      )}
      data-sidebar-item={label}
    >
      {label}
    </button>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────

function ProjectsPane({
  view,
  query,
  category,
  setCategory,
}: {
  view: ViewMode;
  query: string;
  category: "All" | ProjectCategory;
  setCategory: (c: "All" | ProjectCategory) => void;
}) {
  const filtered = useMemo(() => filterProjects(category, query), [category, query]);
  const open = useOs((s) => s.open);

  const openProject = (p: Project) => {
    if (p.opensApp === "research") {
      open("research");
    } else {
      open("caseStudy", { payload: { slug: p.slug } });
    }
  };

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {PROJECT_CATEGORIES.map((c) => (
          <Chip key={c} selected={category === c} onClick={() => setCategory(c)}>
            {c}
          </Chip>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-10 text-center text-[13px] text-[color:var(--color-ink-3)]">
          No projects match that filter.
        </p>
      )}

      {view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
          {filtered.map((p) => (
            <ProjectTile key={p.slug} project={p} onOpen={() => openProject(p)} />
          ))}
        </div>
      ) : (
        <ProjectList projects={filtered} onOpen={openProject} />
      )}
    </div>
  );
}

function ProjectTile({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      data-project-tile={project.slug}
      className="group flex flex-col gap-3 rounded-[16px] p-3 text-left transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/60"
      style={{
        background: "rgba(255,255,255,.48)",
        boxShadow: "inset 0 0 0 1px rgba(10,30,60,.08), 0 2px 8px -4px rgba(10,30,60,.1)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="relative overflow-hidden rounded-[12px]">
        <ImageSlot slot={project.cover} aspect="16 / 10" rounded={12} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
          style={{ background: "linear-gradient(135deg, rgba(34,211,255,.25), rgba(138,92,240,.2))" }}
        />
        {project.year && (
          <span
            className="mono-stroke absolute left-2 top-2 rounded px-1.5 py-0.5 text-[9px]"
            style={{
              background: "rgba(10,20,40,.72)",
              color: "#9BE8FF",
              letterSpacing: "0.2em",
            }}
          >
            {resolveMaybeToPlain(project.year) || "—"}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="truncate text-[16px] font-bold tracking-[-0.015em] text-[color:var(--color-ink)] transition-colors group-hover:text-[color:var(--color-accent)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.name}
          </h3>
          {project.proof && <ProofBadge icon={project.proof.icon} text={project.proof.text} />}
        </div>
        <p className="line-clamp-2 text-[12.5px] leading-[1.5] text-[color:var(--color-ink-2)]">{project.pitch}</p>
        <div className="mt-1 flex flex-wrap gap-[6px]">
          {project.stack
            .map(resolveMaybeToPlain)
            .filter(Boolean)
            .slice(0, 3)
            .map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
        </div>
      </div>
    </button>
  );
}

function ProjectList({ projects: list, onOpen }: { projects: Project[]; onOpen: (p: Project) => void }) {
  return (
    <div
      className="overflow-hidden rounded-[12px]"
      style={{ border: "1px solid var(--color-hairline)" }}
    >
      <table className="w-full border-collapse text-left text-[13px]">
        <thead style={{ background: "var(--color-surface-2)" }}>
          <tr className="text-[11px] font-semibold tracking-[0.04em] text-[color:var(--color-ink-3)] uppercase">
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Category</th>
            <th className="px-3 py-2">Stack</th>
            <th className="px-3 py-2">Year</th>
            <th className="px-3 py-2">Proof</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr
              key={p.slug}
              onClick={() => onOpen(p)}
              className="h-[40px] cursor-pointer border-t border-[color:var(--color-hairline)] hover:bg-[color:var(--color-surface-3)]"
            >
              <td className="px-3 font-semibold text-[color:var(--color-ink)]">{p.name}</td>
              <td className="px-3 text-[color:var(--color-ink-2)]">{p.categories.join(", ")}</td>
              <td className="px-3 text-[color:var(--color-ink-2)]">
                {p.stack.map(resolveMaybeToPlain).filter(Boolean).slice(0, 3).join(", ")}
              </td>
              <td className="px-3 text-[color:var(--color-ink-2)]">
                <MaybeText value={p.year} />
              </td>
              <td className="px-3 text-[color:var(--color-ink-2)]">{p.proof?.text ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────

function ExperiencePane() {
  const [selectedId, setSelectedId] = useState<string>(experience[0]?.id ?? "");
  const selected = experience.find((r) => r.id === selectedId) ?? experience[0];
  return (
    <div className="grid h-full" style={{ gridTemplateColumns: "260px 1fr" }}>
      <ul
        className="overflow-y-auto"
        style={{
          background: "var(--color-surface-2)",
          borderRight: "1px solid var(--color-hairline)",
        }}
      >
        {experience.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => setSelectedId(r.id)}
              aria-current={selected?.id === r.id ? "true" : undefined}
              className={cn(
                "flex w-full flex-col gap-0.5 border-b border-[color:var(--color-hairline)] px-3 py-3 text-left",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40 focus-visible:ring-inset",
                selected?.id === r.id ? "bg-[color:var(--color-accent-soft)]" : "hover:bg-[color:var(--color-surface-3)]",
              )}
              data-role={r.id}
            >
              <div className="text-[13px] font-semibold text-[color:var(--color-ink)]">{r.title}</div>
              <div className="text-[12px] text-[color:var(--color-ink-2)]">{r.orgShort ?? r.org}</div>
              <div className="text-[11px] text-[color:var(--color-ink-3)]">
                <MaybeText value={r.start} /> – {r.end}
              </div>
            </button>
          </li>
        ))}
      </ul>
      {selected && <RoleDetail role={selected} />}
    </div>
  );
}

function RoleDetail({ role }: { role: Role }) {
  return (
    <div className="overflow-y-auto p-6">
      <div className="mono-stroke mb-2 text-[10px]" style={{ letterSpacing: "0.3em", color: "var(--color-accent)" }}>
        · {role.kind} ·
      </div>
      <h3
        className="text-[26px] font-bold leading-[1.05] text-[color:var(--color-ink)]"
        style={{
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.02em",
          background: "linear-gradient(135deg, var(--color-ink) 0%, var(--color-accent) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {role.title}
      </h3>
      <div className="mt-1 text-[14px] text-[color:var(--color-ink-2)]">
        {role.org} · {role.location}
      </div>
      <div className="text-[12px] text-[color:var(--color-ink-3)]">
        <MaybeText value={role.start} /> – {role.end}
      </div>
      <p className="mt-4 text-[14px] leading-6 text-[color:var(--color-ink)]">{role.summary}</p>
      <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-[14px] leading-6 text-[color:var(--color-ink)]">
        {role.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-1">
        {role.skills.map((s) => (
          <Chip key={s}>{s}</Chip>
        ))}
      </div>
    </div>
  );
}

// ─── Education ────────────────────────────────────────────────────────────

function EducationPane() {
  const [selectedId, setSelectedId] = useState<string>(education[0]?.id ?? "");
  const selected = education.find((e) => e.id === selectedId) ?? education[0];
  return (
    <div className="grid h-full" style={{ gridTemplateColumns: "260px 1fr" }}>
      <ul
        className="overflow-y-auto"
        style={{
          background: "var(--color-surface-2)",
          borderRight: "1px solid var(--color-hairline)",
        }}
      >
        {education.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => setSelectedId(e.id)}
              aria-current={selected?.id === e.id ? "true" : undefined}
              className={cn(
                "flex w-full flex-col gap-0.5 border-b border-[color:var(--color-hairline)] px-3 py-3 text-left",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40 focus-visible:ring-inset",
                selected?.id === e.id ? "bg-[color:var(--color-accent-soft)]" : "hover:bg-[color:var(--color-surface-3)]",
              )}
            >
              <div className="text-[13px] font-semibold text-[color:var(--color-ink)]">{e.short}</div>
              <div className="text-[12px] text-[color:var(--color-ink-2)]">{e.credential}</div>
              <div className="text-[11px] text-[color:var(--color-ink-3)]">
                {e.start} – {e.end}
              </div>
            </button>
          </li>
        ))}
      </ul>
      {selected && <SchoolDetail school={selected} />}
    </div>
  );
}

function SchoolDetail({ school }: { school: School }) {
  return (
    <div className="overflow-y-auto p-6">
      <h3 className="text-[20px] font-[650] tracking-[-0.01em] text-[color:var(--color-ink)]">{school.name}</h3>
      <div className="mt-1 text-[14px] text-[color:var(--color-ink-2)]">{school.credential}</div>
      <div className="text-[12px] text-[color:var(--color-ink-3)]">
        {school.location} · {school.start} – {school.end}
        {school.grade ? ` · ${school.grade}` : ""}
      </div>
      <ul className="mt-5 flex list-disc flex-col gap-2 pl-5 text-[14px] leading-6 text-[color:var(--color-ink)]">
        {school.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </div>
  );
}
