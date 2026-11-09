import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchSong, parseItunesResponse, pickTrack, upscaleArtwork, type ItunesResponse } from "@/lib/itunes";
import fixture from "@/lib/__fixtures__/itunes.json";

describe("itunes lib", () => {
  afterEach(() => vi.restoreAllMocks());

  it("prefers the Off the Wall / Michael Jackson track", () => {
    const picked = pickTrack(fixture as ItunesResponse);
    expect(picked?.collectionName).toBe("Off the Wall");
    expect(picked?.artistName).toBe("Michael Jackson");
  });

  it("upscales artwork to a bigger size", () => {
    const url = "https://is1-ssl.mzstatic.com/image/thumb/Music/x/100x100bb.jpg";
    expect(upscaleArtwork(url, 200)).toBe("https://is1-ssl.mzstatic.com/image/thumb/Music/x/200x200bb.jpg");
    expect(upscaleArtwork(null)).toBeNull();
  });

  it("parses to the widget shape with preview + track link", () => {
    const parsed = parseItunesResponse(fixture as ItunesResponse, "fallback title", "fallback artist");
    expect(parsed.title).toBe("Workin' Day and Night");
    expect(parsed.artist).toBe("Michael Jackson");
    expect(parsed.previewUrl).toContain("preview.m4a");
    expect(parsed.trackUrl).toContain("music.apple.com");
    expect(parsed.artworkUrl).toContain("200x200bb");
  });

  it("returns a static fallback when there are no results", () => {
    const parsed = parseItunesResponse({ resultCount: 0, results: [] }, "T", "A");
    expect(parsed).toEqual({ title: "T", artist: "A", artworkUrl: null, previewUrl: null, trackUrl: null });
  });

  it("falls back to title/artist only when the request times out", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((_input: unknown, init: RequestInit) => {
        return new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
        });
      }),
    );
    const data = await fetchSong("term", "Fallback Title", "Fallback Artist", 20);
    expect(data).toEqual({
      title: "Fallback Title",
      artist: "Fallback Artist",
      artworkUrl: null,
      previewUrl: null,
      trackUrl: null,
    });
  });

  it("falls back when fetch returns a non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response("bad", { status: 500 }))));
    const data = await fetchSong("term", "T", "A");
    expect(data.previewUrl).toBeNull();
    expect(data.title).toBe("T");
  });
});
