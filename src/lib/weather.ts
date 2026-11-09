import { fetchWithTimeout } from "./fetchWithTimeout";

// WMO weather codes → short label + a Lucide icon name.
// We return icon names (strings) here so this file stays server-safe; the
// widget component imports the matching Lucide component at render time.
export type WeatherIconName =
  | "Sun"
  | "CloudSun"
  | "Cloud"
  | "Cloudy"
  | "CloudFog"
  | "CloudDrizzle"
  | "CloudRain"
  | "CloudSnow"
  | "CloudLightning";

export type WmoInfo = { label: string; icon: WeatherIconName };

export function wmoToInfo(code: number): WmoInfo {
  // Mapping per https://open-meteo.com/en/docs (WMO Weather interpretation codes)
  if (code === 0) return { label: "Clear", icon: "Sun" };
  if (code === 1) return { label: "Mainly clear", icon: "CloudSun" };
  if (code === 2) return { label: "Partly cloudy", icon: "CloudSun" };
  if (code === 3) return { label: "Overcast", icon: "Cloudy" };
  if (code === 45 || code === 48) return { label: "Fog", icon: "CloudFog" };
  if (code >= 51 && code <= 57) return { label: "Drizzle", icon: "CloudDrizzle" };
  if (code >= 61 && code <= 67) return { label: "Rain", icon: "CloudRain" };
  if (code >= 71 && code <= 77) return { label: "Snow", icon: "CloudSnow" };
  if (code >= 80 && code <= 82) return { label: "Rain showers", icon: "CloudRain" };
  if (code >= 85 && code <= 86) return { label: "Snow showers", icon: "CloudSnow" };
  if (code >= 95 && code <= 99) return { label: "Thunderstorm", icon: "CloudLightning" };
  return { label: "—", icon: "Cloud" };
}

export type CityInput = {
  id: string;
  name: string;
  flag: string;
  lat: number;
  lon: number;
  tz: string;
};

export type WeatherDay = { date: string; hi: number; lo: number; code: number; label: string; icon: WeatherIconName };

export type WeatherCity = {
  id: string;
  name: string;
  flag: string;
  tz: string;
  temp: number | null;
  code: number | null;
  label: string;
  icon: WeatherIconName;
  hi: number | null;
  lo: number | null;
  daily: WeatherDay[];
};

export type WeatherWidgetData = { cities: WeatherCity[] };

// Raw Open-Meteo shape (only fields we read).
export type OpenMeteoResponse = {
  current?: { temperature_2m?: number; weather_code?: number };
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    weather_code?: number[];
  };
};

export function parseOpenMeteo(raw: OpenMeteoResponse, city: CityInput): WeatherCity {
  const cur = raw.current ?? {};
  const daily = raw.daily ?? {};
  const times = daily.time ?? [];
  const hi = daily.temperature_2m_max ?? [];
  const lo = daily.temperature_2m_min ?? [];
  const codes = daily.weather_code ?? [];
  const days: WeatherDay[] = [];
  for (let i = 0; i < Math.min(3, times.length); i += 1) {
    const code = codes[i] ?? 0;
    const info = wmoToInfo(code);
    days.push({
      date: times[i],
      hi: Math.round(hi[i] ?? 0),
      lo: Math.round(lo[i] ?? 0),
      code,
      label: info.label,
      icon: info.icon,
    });
  }
  const curCode = typeof cur.weather_code === "number" ? cur.weather_code : null;
  const info = curCode !== null ? wmoToInfo(curCode) : { label: "—", icon: "Cloud" as WeatherIconName };
  return {
    id: city.id,
    name: city.name,
    flag: city.flag,
    tz: city.tz,
    temp: typeof cur.temperature_2m === "number" ? Math.round(cur.temperature_2m) : null,
    code: curCode,
    label: info.label,
    icon: info.icon,
    hi: days[0]?.hi ?? null,
    lo: days[0]?.lo ?? null,
    daily: days,
  };
}

export const WEATHER_FALLBACK: WeatherWidgetData = { cities: [] };

function buildUrl(c: CityInput): string {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(c.lat));
  url.searchParams.set("longitude", String(c.lon));
  url.searchParams.set("current", "temperature_2m,weather_code");
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,weather_code");
  url.searchParams.set("timezone", c.tz);
  url.searchParams.set("forecast_days", "3");
  return url.toString();
}

export async function fetchWeather(
  cities: readonly CityInput[],
  timeoutMs = 4000,
): Promise<WeatherWidgetData> {
  try {
    const results = await Promise.all(
      cities.map(async (c) => {
        try {
          const res = await fetchWithTimeout(buildUrl(c), { headers: { Accept: "application/json" } }, timeoutMs);
          if (!res.ok) return null;
          const json = (await res.json()) as OpenMeteoResponse;
          return parseOpenMeteo(json, c);
        } catch {
          return null;
        }
      }),
    );
    const ok = results.filter((r): r is WeatherCity => r !== null);
    if (ok.length === 0) return WEATHER_FALLBACK;
    return { cities: ok };
  } catch {
    return WEATHER_FALLBACK;
  }
}
