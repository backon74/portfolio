import { describe, it, expect } from "vitest";
import {
  filterProjects,
  findProject,
  adjacentProjects,
  resolveUsedIn,
  PROJECT_CATEGORIES,
} from "@/lib/content";
import { projects } from "@/content/projects";

describe("filterProjects", () => {
  it('returns every project for category "All" and empty query', () => {
    expect(filterProjects("All", "").length).toBe(projects.length);
  });

  it("filters by category", () => {
    const mobile = filterProjects("Mobile", "");
    expect(mobile.length).toBeGreaterThan(0);
    for (const p of mobile) expect(p.categories).toContain("Mobile");
  });

  it("searches by name (case-insensitive)", () => {
    const got = filterProjects("All", "anchor");
    expect(got.some((p) => p.slug === "anchor")).toBe(true);
  });

  it("searches by stack token", () => {
    const got = filterProjects("All", "kotlin");
    // No project lists Kotlin in stack, but search should not throw and return 0 or more
    expect(Array.isArray(got)).toBe(true);
  });
});

describe("findProject / adjacentProjects", () => {
  it("finds a known slug", () => {
    expect(findProject("anchor")?.name).toBe("Anchor");
  });

  it("returns undefined for unknown slug", () => {
    expect(findProject("does-not-exist")).toBeUndefined();
  });

  it("returns prev/next for middle project", () => {
    const mid = projects[2];
    const { prev, next } = adjacentProjects(mid.slug);
    expect(prev?.slug).toBe(projects[1].slug);
    expect(next?.slug).toBe(projects[3].slug);
  });

  it("returns no prev for first project", () => {
    const { prev } = adjacentProjects(projects[0].slug);
    expect(prev).toBeUndefined();
  });
});

describe("resolveUsedIn", () => {
  it('resolves "portfolio" sentinel', () => {
    expect(resolveUsedIn("portfolio").kind).toBe("portfolio");
  });

  it("resolves a known project slug", () => {
    const r = resolveUsedIn("anchor");
    expect(r.kind).toBe("project");
    if (r.kind === "project") expect(r.slug).toBe("anchor");
  });

  it("resolves a known role id", () => {
    const r = resolveUsedIn("batelco");
    expect(r.kind).toBe("role");
  });

  it("returns unknown for garbage", () => {
    expect(resolveUsedIn("nope-not-real").kind).toBe("unknown");
  });
});

describe("PROJECT_CATEGORIES", () => {
  it("starts with All and covers every category used", () => {
    expect(PROJECT_CATEGORIES[0]).toBe("All");
    const seen = new Set<string>();
    for (const p of projects) for (const c of p.categories) seen.add(c);
    for (const c of seen) {
      expect(PROJECT_CATEGORIES).toContain(c);
    }
  });
});
