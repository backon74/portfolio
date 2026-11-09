import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchGitHubContributions,
  parseContributions,
  type GitHubGraphQlResponse,
} from "@/lib/github";
import fixture from "@/lib/__fixtures__/github.json";

describe("github lib", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parses the fixture into day grid + total", () => {
    const parsed = parseContributions(fixture as GitHubGraphQlResponse, "backon74");
    expect(parsed.total).toBe(742);
    expect(parsed.weeks.length).toBe(2);
    expect(parsed.weeks[0]).toHaveLength(7);
    expect(parsed.weeks[0][0]).toEqual({ date: "2026-10-19", count: 0, level: 0 });
    expect(parsed.weeks[0][4]).toEqual({ date: "2026-10-23", count: 12, level: 4 });
  });

  it("buckets counts into 0–4 levels", () => {
    const raw: GitHubGraphQlResponse = {
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: 0,
              weeks: [
                {
                  contributionDays: [
                    { date: "d1", contributionCount: 0 },
                    { date: "d2", contributionCount: 1 },
                    { date: "d3", contributionCount: 2 },
                    { date: "d4", contributionCount: 5 },
                    { date: "d5", contributionCount: 9 },
                    { date: "d6", contributionCount: 100 },
                    { date: "d7", contributionCount: 3 },
                  ],
                },
              ],
            },
          },
        },
      },
    };
    const parsed = parseContributions(raw, "x");
    expect(parsed.weeks[0].map((d) => d.level)).toEqual([0, 1, 1, 2, 3, 4, 2]);
  });

  it("returns the fallback when token is missing", async () => {
    const data = await fetchGitHubContributions("x", undefined);
    expect(data.total).toBeNull();
    expect(data.weeks).toEqual([]);
    expect(data.user).toBe("x");
  });

  it("returns the fallback on a non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response("nope", { status: 401 }))),
    );
    const data = await fetchGitHubContributions("x", "token");
    expect(data.total).toBeNull();
    expect(data.weeks).toEqual([]);
  });

  it("returns the fallback when the fetch times out (AbortError)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((_input: unknown, init: RequestInit) => {
        return new Promise<Response>((_resolve, reject) => {
          const signal = init?.signal;
          if (!signal) return;
          if (signal.aborted) reject(new DOMException("Aborted", "AbortError"));
          signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
        });
      }),
    );
    const data = await fetchGitHubContributions("x", "token", 20);
    expect(data.total).toBeNull();
    expect(data.weeks).toEqual([]);
  });

  it("returns the fallback when graphql returns errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response(JSON.stringify({ errors: [{ message: "bad" }] }), { status: 200 }))),
    );
    const data = await fetchGitHubContributions("x", "token");
    expect(data.total).toBeNull();
  });

  it("uses the real fixture via fetch mock", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response(JSON.stringify(fixture), { status: 200 }))),
    );
    const data = await fetchGitHubContributions("backon74", "token");
    expect(data.total).toBe(742);
    expect(data.weeks.length).toBe(2);
  });
});
