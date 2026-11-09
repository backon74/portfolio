import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchWeather, parseOpenMeteo, wmoToInfo, type OpenMeteoResponse } from "@/lib/weather";
import fixture from "@/lib/__fixtures__/open-meteo.json";

const muharraq = {
  id: "muharraq",
  name: "Muharraq",
  flag: "🇧🇭",
  lat: 26.25,
  lon: 50.61,
  tz: "Asia/Bahrain",
};

describe("weather lib", () => {
  afterEach(() => vi.restoreAllMocks());

  it("maps WMO codes to short labels + icons", () => {
    expect(wmoToInfo(0).icon).toBe("Sun");
    expect(wmoToInfo(3).label).toBe("Overcast");
    expect(wmoToInfo(45).icon).toBe("CloudFog");
    expect(wmoToInfo(63).icon).toBe("CloudRain");
    expect(wmoToInfo(73).icon).toBe("CloudSnow");
    expect(wmoToInfo(95).icon).toBe("CloudLightning");
    expect(wmoToInfo(999).label).toBe("—");
  });

  it("parses the open-meteo fixture into the widget city shape", () => {
    const city = parseOpenMeteo(fixture as OpenMeteoResponse, muharraq);
    expect(city.id).toBe("muharraq");
    expect(city.temp).toBe(27);
    expect(city.code).toBe(2);
    expect(city.daily).toHaveLength(3);
    expect(city.daily[0]).toMatchObject({ hi: 29, lo: 22, code: 2 });
    expect(city.hi).toBe(29);
    expect(city.lo).toBe(22);
  });

  it("falls back to empty cities when every fetch times out", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((_input: unknown, init: RequestInit) => {
        return new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
        });
      }),
    );
    const data = await fetchWeather([muharraq], 20);
    expect(data.cities).toEqual([]);
  });

  it("falls back to empty on non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response("fail", { status: 500 }))));
    const data = await fetchWeather([muharraq]);
    expect(data.cities).toEqual([]);
  });

  it("returns successful cities even if one fails", async () => {
    let n = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(() => {
        n += 1;
        if (n === 1) return Promise.resolve(new Response(JSON.stringify(fixture), { status: 200 }));
        return Promise.resolve(new Response("x", { status: 500 }));
      }),
    );
    const data = await fetchWeather([muharraq, { ...muharraq, id: "m2", name: "M2" }]);
    expect(data.cities).toHaveLength(1);
    expect(data.cities[0].id).toBe("muharraq");
  });
});
