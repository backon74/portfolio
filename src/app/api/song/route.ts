import { NextResponse } from "next/server";
import { fetchSong } from "@/lib/itunes";
import { song } from "@/content/site";

// NOTE: `export const revalidate` is incompatible with cacheComponents (Next 16);
// caching is done via the Cache-Control response header below.
export async function GET() {
  const data = await fetchSong(song.searchTerm, song.title, song.artist);
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=2592000" },
  });
}
