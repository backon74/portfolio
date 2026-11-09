// Content helpers shared by the content apps (Files, CaseStudy, Research, Skills).

import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import { isTodo, type Maybe, type Project, type ProjectCategory } from "@/content/types";

export const PROJECT_CATEGORIES: readonly ("All" | ProjectCategory)[] = [
  "All",
  "Mobile",
  "AI/ML",
  "Cloud",
  "Web",
  "Systems",
] as const;

export function findProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function adjacentProjects(slug: string): { prev?: Project; next?: Project } {
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx < 0) return {};
  return {
    prev: idx > 0 ? projects[idx - 1] : undefined,
    next: idx < projects.length - 1 ? projects[idx + 1] : undefined,
  };
}

export function filterProjects(
  category: "All" | ProjectCategory,
  query: string
): Project[] {
  const q = query.trim().toLowerCase();
  return projects.filter((p) => {
    if (category !== "All" && !p.categories.includes(category)) return false;
    if (!q) return true;
    const hay = [
      p.name,
      p.pitch,
      p.context,
      ...p.stack.map(resolveMaybeToPlain),
      ...p.categories,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

/**
 * Render a Maybe<string> value:
 *   - In production: an em dash.
 *   - In development: an em dash marker. Caller can detect todos via `isTodo` to show the amber dot.
 * Use `renderMaybe` for a plain string suitable in tooltips/text.
 */
export function renderMaybe(v: Maybe<string>): string {
  if (isTodo(v)) return "—";
  return v;
}

export function resolveMaybeToPlain(v: Maybe<string>): string {
  return isTodo(v) ? "" : v;
}

/** Is development mode? Used to show the amber TODO dot. */
export const IS_DEV = process.env.NODE_ENV !== "production";

export function experienceById(id: string) {
  return experience.find((r) => r.id === id);
}

export function educationById(id: string) {
  return education.find((e) => e.id === id);
}

/** A usedIn id can resolve to a project, a role, "portfolio" (this site), or nothing. */
export type UsedInResolved =
  | { kind: "project"; slug: string; name: string }
  | { kind: "role"; id: string; label: string }
  | { kind: "portfolio" }
  | { kind: "unknown"; id: string };

export function resolveUsedIn(id: string): UsedInResolved {
  if (id === "portfolio") return { kind: "portfolio" };
  const p = projects.find((x) => x.slug === id);
  if (p) return { kind: "project", slug: p.slug, name: p.name };
  const r = experience.find((x) => x.id === id);
  if (r) return { kind: "role", id: r.id, label: `${r.org}` };
  return { kind: "unknown", id };
}
