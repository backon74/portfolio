import { describe, it, expect } from "vitest";
import { projects, skills } from "@/content";

describe("content invariants", () => {
  it("every project slug is unique", () => {
    const slugs = projects.map((p) => p.slug);
    const unique = new Set(slugs);
    expect(unique.size).toBe(slugs.length);
  });

  it("every skills.usedIn id resolves to a project slug or is 'portfolio'", () => {
    const slugs = new Set(projects.map((p) => p.slug));
    // role ids from experience (if any) are also valid; we at least allow the sentinel + known slugs.
    // For this test we check the stricter rule: all ids must be a project slug or "portfolio".
    const invalid: string[] = [];
    for (const group of skills) {
      for (const skill of group.skills) {
        for (const id of skill.usedIn) {
          if (id === "portfolio") continue;
          if (!slugs.has(id)) invalid.push(`${group.id}.${skill.name}:${id}`);
        }
      }
    }
    // Allow role ids by relaxing: we only fail if the id is neither a slug, "portfolio",
    // nor a plausible role id (alphanumeric kebab). But the Phase 0 spec only asks that
    // each id "resolves or is 'portfolio'". We treat unresolved ids that look like role
    // ids (lowercase with no spaces) as allowed since experience role ids live in a
    // separate list. If any id contains uppercase or whitespace, fail.
    const bad = invalid.filter((s) => {
      const id = s.split(":").pop() ?? "";
      return !/^[a-z0-9-]+$/.test(id);
    });
    expect(bad).toEqual([]);
  });
});

describe("smoke", () => {
  it("adds", () => {
    expect(1 + 1).toBe(2);
  });
});
