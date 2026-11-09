import { fetchWithTimeout } from "./fetchWithTimeout";

// Shape returned to the client from /api/github.
export type GitHubDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type GitHubWidgetData = {
  total: number | null;
  weeks: GitHubDay[][];
  user: string;
};

// Raw GraphQL response shape we parse.
export type GitHubGraphQlResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: {
            contributionDays: {
              date: string;
              contributionCount: number;
              color?: string;
            }[];
          }[];
        };
      };
    };
  };
  errors?: unknown;
};

const QUERY = /* GraphQL */ `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

function levelFor(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count < 3) return 1;
  if (count < 6) return 2;
  if (count < 10) return 3;
  return 4;
}

// Parse the raw GraphQL response into the widget shape. Keeps only the last ~20 weeks.
export function parseContributions(
  raw: GitHubGraphQlResponse,
  user: string,
  weeksToKeep = 20,
): GitHubWidgetData {
  const cal = raw?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) return { total: null, weeks: [], user };
  const allWeeks = (cal.weeks ?? []).map((w) =>
    (w.contributionDays ?? []).map(
      (d): GitHubDay => ({
        date: d.date,
        count: d.contributionCount ?? 0,
        level: levelFor(d.contributionCount ?? 0),
      }),
    ),
  );
  const weeks = allWeeks.slice(Math.max(0, allWeeks.length - weeksToKeep));
  return { total: cal.totalContributions ?? 0, weeks, user };
}

export const GITHUB_FALLBACK: GitHubWidgetData = { total: null, weeks: [], user: "" };

/**
 * Fetch contributions. Returns a fallback shape on any error (missing token,
 * timeout, 4xx/5xx, invalid JSON). Never throws.
 */
export async function fetchGitHubContributions(
  user: string,
  token: string | undefined,
  timeoutMs = 4000,
): Promise<GitHubWidgetData> {
  if (!token) return { ...GITHUB_FALLBACK, user };
  try {
    const res = await fetchWithTimeout(
      "https://api.github.com/graphql",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query: QUERY, variables: { login: user } }),
      },
      timeoutMs,
    );
    if (!res.ok) return { ...GITHUB_FALLBACK, user };
    const json = (await res.json()) as GitHubGraphQlResponse;
    if (json.errors) return { ...GITHUB_FALLBACK, user };
    return parseContributions(json, user);
  } catch {
    return { ...GITHUB_FALLBACK, user };
  }
}
