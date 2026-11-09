import { fetchWithTimeout } from "./fetchWithTimeout";

export type SongWidgetData = {
  title: string;
  artist: string;
  album?: string;
  artworkUrl: string | null;
  previewUrl: string | null;
  trackUrl: string | null;
};

export type ItunesResult = {
  trackName?: string;
  artistName?: string;
  collectionName?: string;
  previewUrl?: string;
  artworkUrl100?: string;
  artworkUrl60?: string;
  trackViewUrl?: string;
  collectionViewUrl?: string;
};

export type ItunesResponse = {
  resultCount?: number;
  results?: ItunesResult[];
};

const PREFERRED_ALBUM = "off the wall";
const PREFERRED_ARTIST = "michael jackson";

/** Pick the "Off the Wall" / Michael Jackson track from the search results. */
export function pickTrack(raw: ItunesResponse): ItunesResult | null {
  const items = raw.results ?? [];
  if (items.length === 0) return null;
  const scored = items
    .map((r) => {
      let score = 0;
      const album = (r.collectionName ?? "").toLowerCase();
      const artist = (r.artistName ?? "").toLowerCase();
      if (album.includes(PREFERRED_ALBUM)) score += 10;
      if (artist.includes(PREFERRED_ARTIST)) score += 5;
      if (r.previewUrl) score += 2;
      return { r, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored[0]?.r ?? null;
}

/** Upscale the 100 px artwork to a larger size (iTunes supports /SIZExSIZE/). */
export function upscaleArtwork(url: string | undefined | null, px = 200): string | null {
  if (!url) return null;
  return url.replace(/\/\d+x\d+bb\.(jpg|png)/i, `/${px}x${px}bb.$1`);
}

export function parseItunesResponse(
  raw: ItunesResponse,
  fallbackTitle: string,
  fallbackArtist: string,
): SongWidgetData {
  const r = pickTrack(raw);
  if (!r) {
    return {
      title: fallbackTitle,
      artist: fallbackArtist,
      artworkUrl: null,
      previewUrl: null,
      trackUrl: null,
    };
  }
  return {
    title: r.trackName ?? fallbackTitle,
    artist: r.artistName ?? fallbackArtist,
    album: r.collectionName,
    artworkUrl: upscaleArtwork(r.artworkUrl100 ?? r.artworkUrl60 ?? null, 200),
    previewUrl: r.previewUrl ?? null,
    trackUrl: r.trackViewUrl ?? r.collectionViewUrl ?? null,
  };
}

export function songFallback(title: string, artist: string): SongWidgetData {
  return { title, artist, artworkUrl: null, previewUrl: null, trackUrl: null };
}

export async function fetchSong(
  term: string,
  fallbackTitle: string,
  fallbackArtist: string,
  timeoutMs = 4000,
): Promise<SongWidgetData> {
  try {
    const url = new URL("https://itunes.apple.com/search");
    url.searchParams.set("term", term);
    url.searchParams.set("entity", "song");
    url.searchParams.set("limit", "5");
    const res = await fetchWithTimeout(url.toString(), { headers: { Accept: "application/json" } }, timeoutMs);
    if (!res.ok) return songFallback(fallbackTitle, fallbackArtist);
    const json = (await res.json()) as ItunesResponse;
    return parseItunesResponse(json, fallbackTitle, fallbackArtist);
  } catch {
    return songFallback(fallbackTitle, fallbackArtist);
  }
}
