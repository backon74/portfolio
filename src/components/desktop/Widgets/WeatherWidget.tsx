"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Sun,
  CloudSun,
  Cloud,
  Cloudy,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  type LucideIcon,
} from "lucide-react";
import { WidgetFrame } from "./WidgetFrame";
import type { WeatherCity, WeatherIconName, WeatherWidgetData } from "@/lib/weather";

export const WEATHER_WIDGET_SIZE = { w: 340, h: 150 } as const;
export const WEATHER_WIDGET_SIZE_EXPANDED = { w: 340, h: 250 } as const;

const ICONS: Record<WeatherIconName, LucideIcon> = {
  Sun,
  CloudSun,
  Cloud,
  Cloudy,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
};

type State = "loading" | "ok" | "empty";

function localTime(tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(new Date());
  } catch {
    return "";
  }
}

function dayLabel(iso: string, tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: tz }).format(new Date(iso + "T00:00:00Z"));
  } catch {
    return "";
  }
}

export function WeatherWidget() {
  const [data, setData] = useState<WeatherWidgetData | null>(null);
  const [state, setState] = useState<State>("loading");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/weather", { cache: "no-store" });
        if (!res.ok) throw new Error("bad");
        const json = (await res.json()) as WeatherWidgetData;
        if (cancelled) return;
        setData(json);
        setState(json.cities.length > 0 ? "ok" : "empty");
      } catch {
        if (!cancelled) setState("empty");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const size = expanded ? WEATHER_WIDGET_SIZE_EXPANDED : WEATHER_WIDGET_SIZE;
  const cities = useMemo(() => data?.cities ?? [], [data]);

  return (
    <WidgetFrame
      as="button"
      width={size.w}
      height={size.h}
      label="Toggle 3-day forecast"
      onClick={() => setExpanded((v) => !v)}
      code="WTH-973"
    >
      <div className="h-full p-[14px]">
        {state === "loading" ? (
          <div className="grid h-full grid-cols-2 gap-[12px]">
            <div className="animate-pulse rounded-[12px] bg-[color:var(--color-surface-3)]" />
            <div className="animate-pulse rounded-[12px] bg-[color:var(--color-surface-3)]" />
          </div>
        ) : state === "ok" ? (
          <div className="flex h-full flex-col gap-[8px]">
            <div className="grid grid-cols-2 gap-[12px]">
              {cities.map((c) => (
                <CityTile key={c.id} city={c} />
              ))}
            </div>
            {expanded && (
              <div className="grid grid-cols-2 gap-[12px] pt-[4px]">
                {cities.map((c) => (
                  <div key={c.id} className="flex flex-col gap-[3px]">
                    {c.daily.map((d) => {
                      const Ico = ICONS[d.icon];
                      return (
                        <div
                          key={d.date}
                          className="flex items-center justify-between text-[11px] text-[color:var(--color-ink-2)]"
                        >
                          <span className="w-[32px]">{dayLabel(d.date, c.tz)}</span>
                          <Ico size={14} className="text-[color:var(--color-ink-3)]" />
                          <span className="tabular-nums">
                            {d.hi}° / {d.lo}°
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-[12px] text-[color:var(--color-ink-3)]">
            Weather unavailable
          </div>
        )}
      </div>
    </WidgetFrame>
  );
}

function CityTile({ city }: { city: WeatherCity }) {
  const Ico = ICONS[city.icon];
  return (
    <div className="flex flex-col gap-[2px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[4px]">
          <span className="text-[11px] text-[color:var(--color-ink-3)]">{city.flag}</span>
          <span className="text-[12px] font-medium text-[color:var(--color-ink)]">{city.name}</span>
        </div>
        <span className="text-[10px] tabular-nums text-[color:var(--color-ink-3)]">{localTime(city.tz)}</span>
      </div>
      <div className="flex items-center gap-[8px]">
        <Ico size={28} className="text-[color:var(--color-ink-2)]" />
        <div>
          <div className="text-[22px] font-semibold leading-none tabular-nums text-[color:var(--color-ink)]">
            {city.temp != null ? `${city.temp}°` : "—"}
          </div>
          <div className="mt-[3px] text-[10px] text-[color:var(--color-ink-3)]">{city.label}</div>
        </div>
      </div>
      <div className="text-[10px] tabular-nums text-[color:var(--color-ink-3)]">
        {city.hi != null && city.lo != null ? `H ${city.hi}° · L ${city.lo}°` : ""}
      </div>
    </div>
  );
}
