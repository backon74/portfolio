import { NextResponse } from "next/server";
import { fetchWeather, type CityInput } from "@/lib/weather";
import { weatherCities } from "@/content/site";

// NOTE: `export const revalidate` is incompatible with cacheComponents (Next 16);
// caching is done via the Cache-Control response header below.
export async function GET() {
  const cities: CityInput[] = weatherCities.map((c) => ({ ...c }));
  const data = await fetchWeather(cities);
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
  });
}
