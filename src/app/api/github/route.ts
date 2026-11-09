import { NextResponse } from "next/server";
import { fetchGitHubContributions } from "@/lib/github";
import { links } from "@/content/site";

// NOTE: `export const revalidate` is incompatible with cacheComponents (Next 16);
// caching is done via the Cache-Control response header below.
export async function GET() {
  const data = await fetchGitHubContributions(links.githubUser, process.env.GITHUB_TOKEN);
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" },
  });
}
