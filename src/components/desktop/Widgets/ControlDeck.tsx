"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useOs } from "@/os/store";
import { profile, links, song as songContent } from "@/content/site";
import { useReducedMotion } from "@/os/hooks/useReducedMotion";
import type { GitHubWidgetData } from "@/lib/github";
import type { WeatherWidgetData } from "@/lib/weather";
import type { SongWidgetData } from "@/lib/itunes";

const DECK_W = 360;
const DECK_H = 640;

function subscribe(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}
const getSnapshot = () => window.innerWidth;
const getServerSnapshot = () => 1440;

/* -------------- Vinyl mini -------------- */
function Vinyl({ art, playing, size = 76 }: { art: string | null; playing: boolean; size?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        animation: playing ? "vinyl-spin 6s linear infinite" : undefined,
        animationPlayState: playing ? "running" : "paused",
        background:
          "radial-gradient(circle at 50% 50%, #1b3666 0%, #0b1a33 40%, #050c1d 72%, #020612 100%)",
        boxShadow:
          "inset 0 0 0 2px rgba(255,255,255,.1), inset 0 0 20px rgba(34,211,255,.18), 0 2px 10px rgba(10,30,60,.5), 0 0 16px -4px rgba(34,211,255,.55)",
      }}
    >
      {[0.9, 0.78, 0.66, 0.54, 0.42].map((r) => (
        <div
          key={r}
          style={{
            position: "absolute",
            top: `${(1 - r) * 50}%`,
            left: `${(1 - r) * 50}%`,
            width: `${r * 100}%`,
            height: `${r * 100}%`,
            borderRadius: "50%",
            border: "1px solid rgba(180,210,255,.08)",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "32%",
          height: "32%",
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "inset 0 0 0 1.5px rgba(34,211,255,.5)",
          background: "#0b1a33",
        }}
      >
        {art ? (
          <Image src={art} alt="" fill sizes="30px" className="object-cover" unoptimized />
        ) : (
          <div style={{ display: "grid", placeItems: "center", width: "100%", height: "100%", color: "#22D3FF", fontSize: 12 }}>
            ♪
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 5,
          height: 5,
          marginLeft: -2.5,
          marginTop: -2.5,
          borderRadius: "50%",
          background: "#000",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(34,211,255,.25) 0%, transparent 40%, transparent 60%, rgba(255,255,255,.08) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* -------------- Micro components -------------- */
function MonoLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span
        className="mono-stroke"
        style={{ fontSize: 9, color: "rgba(10,30,60,.5)", letterSpacing: "0.3em" }}
      >
        {children}
      </span>
      {right ? <span className="mono-stroke" style={{ fontSize: 9, color: "rgba(10,30,60,.4)" }}>{right}</span> : null}
    </div>
  );
}

function Divider() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 1,
        background:
          "linear-gradient(90deg, rgba(10,30,60,0), rgba(34,211,255,.25) 50%, rgba(10,30,60,0))",
      }}
    />
  );
}

/* -------------- Sections -------------- */
function ProfileSection() {
  const open = useOs((s) => s.open);
  return (
    <button
      type="button"
      onClick={() => open("hamza")}
      aria-label="Open Hamza app"
      className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-[14px]"
    >
      <div className="flex items-center gap-3">
        <div
          className="relative size-[64px] shrink-0 overflow-hidden rounded-[16px]"
          style={{
            background: "linear-gradient(135deg, #22D3FF 0%, #8A5CF0 100%)",
            boxShadow: "0 0 0 1px rgba(255,255,255,.4), 0 6px 14px -4px rgba(10,30,60,.4)",
          }}
        >
          {!profile.photo.placeholder ? (
            <Image src={profile.photo.src} alt={profile.photo.alt} fill sizes="64px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[26px] font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              {profile.firstName.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <MonoLabel right="● ONLINE">OPERATOR</MonoLabel>
          <div
            className="mt-[2px] truncate text-[18px] font-bold text-[color:var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            {profile.name}
          </div>
          <div className="truncate text-[11px] text-[color:var(--color-ink-2)]">{profile.role}</div>
          <div className="mt-[2px] text-[10px] text-[color:var(--color-ink-3)]">
            Muharraq 🇧🇭 · Marrakech 🇲🇦
          </div>
        </div>
      </div>
    </button>
  );
}

function NowPlayingSection() {
  const [data, setData] = useState<SongWidgetData | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/song", { cache: "no-store" });
        if (!res.ok) throw new Error("bad");
        const json = (await res.json()) as SongWidgetData;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled)
          setData({ title: songContent.title, artist: songContent.artist, artworkUrl: null, previewUrl: null, trackUrl: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => a.duration && setProgress(a.currentTime / a.duration);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a || !data?.previewUrl) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true), () => setPlaying(false));
    }
  };

  const title = data?.title ?? songContent.title;
  const artist = data?.artist ?? songContent.artist;
  const preview = data?.previewUrl ?? null;
  const disabled = !preview;

  return (
    <div>
      <MonoLabel right="NPL-315">NOW PLAYING</MonoLabel>
      <div className="mt-2 flex items-center gap-3">
        <Vinyl art={data?.artworkUrl ?? null} playing={playing} />
        <div className="min-w-0 flex-1">
          <div
            className="truncate text-[15px] font-semibold text-[color:var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </div>
          <div className="truncate text-[11px] text-[color:var(--color-ink-2)]">{artist}</div>
          <div className="mt-[6px] h-[3px] overflow-hidden rounded-full bg-[rgba(10,30,60,.1)]">
            <div
              className="h-full"
              style={{
                width: `${Math.round(progress * 100)}%`,
                background: "linear-gradient(90deg, #2563EB, #22D3FF)",
                boxShadow: "0 0 8px rgba(34,211,255,.6)",
                transition: "width 100ms linear",
              }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={disabled}
          aria-label={playing ? "Pause" : "Play"}
          className="flex size-[36px] shrink-0 items-center justify-center rounded-full text-white disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          style={{
            background: "linear-gradient(180deg, #2E7BF6, #1D4FD3)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.4), 0 0 14px rgba(34,211,255,.5)",
          }}
        >
          {playing ? <Pause size={15} /> : <Play size={15} className="translate-x-[1px]" />}
        </button>
      </div>
      {preview && <audio ref={audioRef} src={preview} preload="none" />}
    </div>
  );
}

/* -------------- Weather dial -------------- */
function WeatherSection() {
  const [data, setData] = useState<WeatherWidgetData | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/weather", { cache: "no-store" });
        if (!res.ok) throw new Error("bad");
        const json = (await res.json()) as WeatherWidgetData;
        if (!cancelled) setData(json);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const cities = data?.cities ?? [];
  return (
    <div>
      <MonoLabel right="WTH-973">CLIMATE · DUAL</MonoLabel>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {cities.length > 0 ? cities.slice(0, 2).map((c) => (
          <div
            key={c.id}
            className="rounded-[12px] p-[10px]"
            style={{
              background: "rgba(255,255,255,.3)",
              boxShadow: "inset 0 0 0 1px rgba(34,211,255,.15)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-[color:var(--color-ink-2)]">{c.flag} {c.name}</span>
            </div>
            <div
              className="mt-1 text-[28px] font-bold leading-none tabular-nums text-[color:var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.temp != null ? `${c.temp}°` : "—"}
            </div>
            <div className="mt-[2px] text-[9px] uppercase tracking-wider text-[color:var(--color-ink-3)]">{c.label}</div>
            <div className="mt-1 text-[9px] tabular-nums text-[color:var(--color-ink-3)]">
              {c.hi != null && c.lo != null ? `${c.hi}° / ${c.lo}°` : ""}
            </div>
          </div>
        )) : (
          <>
            <div className="rounded-[12px] p-[10px] animate-pulse" style={{ background: "rgba(255,255,255,.3)", height: 80 }} />
            <div className="rounded-[12px] p-[10px] animate-pulse" style={{ background: "rgba(255,255,255,.3)", height: 80 }} />
          </>
        )}
      </div>
    </div>
  );
}

/* -------------- GitHub pixel grid -------------- */
function GithubSection() {
  const [data, setData] = useState<GitHubWidgetData | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/github", { cache: "no-store" });
        if (!res.ok) throw new Error("bad");
        const json = (await res.json()) as GitHubWidgetData;
        if (!cancelled) setData(json);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const WEEKS = 22;
  const DAYS = 7;
  const CELL = 11;
  const GAP = 2;
  const level = (l: number) =>
    l >= 4 ? "#0B4BB0" : l === 3 ? "#2B7ADF" : l === 2 ? "#66A4E8" : l === 1 ? "#A6C8F0" : "rgba(10,30,60,.08)";
  return (
    <a
      href={links.github}
      target="_blank"
      rel="noreferrer noopener"
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-[14px]"
    >
      <MonoLabel right={`@${links.githubUser}`}>GIT · ACTIVITY</MonoLabel>
      <div className="mt-2 flex items-end" style={{ gap: GAP }}>
        {data && data.weeks.length > 0 ? (
          data.weeks.slice(-WEEKS).map((week, wi) => (
            <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
              {Array.from({ length: DAYS }).map((_, di) => {
                const day = week[di];
                if (!day) {
                  return <div key={di} style={{ width: CELL, height: CELL, borderRadius: 2, background: "transparent" }} />;
                }
                return (
                  <div
                    key={di}
                    title={`${day.count} on ${day.date}`}
                    style={{
                      width: CELL,
                      height: CELL,
                      borderRadius: 2,
                      background: level(day.level),
                      boxShadow: day.level >= 3 ? "0 0 4px rgba(34,211,255,.5)" : undefined,
                    }}
                  />
                );
              })}
            </div>
          ))
        ) : (
          <div
            className="animate-pulse"
            style={{
              width: WEEKS * CELL + (WEEKS - 1) * GAP,
              height: DAYS * CELL + (DAYS - 1) * GAP,
              borderRadius: 4,
              background: "rgba(10,30,60,.08)",
            }}
          />
        )}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-[color:var(--color-ink-3)]">
        <span className="tabular-nums">
          {data?.total != null ? `${data.total.toLocaleString()} commits · 1y` : "—"}
        </span>
        <span style={{ color: "#22D3FF" }}>OPEN ↗</span>
      </div>
    </a>
  );
}

/* -------------- Deck -------------- */
export function ControlDeck({ firstBoot = false }: { firstBoot?: boolean }) {
  const reduced = useReducedMotion();
  const w = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  if (w < 1024) return null;

  const onMove = (e: React.PointerEvent) => {
    if (reduced) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: px * 4, y: py * 4 });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      initial={firstBoot ? { opacity: 0, x: 20 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: firstBoot ? 0.3 : 0 }}
      className="pointer-events-auto absolute"
      style={{ top: 60, right: 24, width: DECK_W }}
      aria-label="Widgets"
    >
      <div
        className="liquid-glass"
        style={{
          borderRadius: 28,
          padding: 16,
          height: DECK_H,
          transform: reduced ? undefined : `perspective(1000px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 240ms cubic-bezier(.22,1,.36,1)",
        }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        {/* Deck header */}
        <div className="relative z-[2] mb-3 flex items-center justify-between">
          <div
            className="mono-stroke"
            style={{ fontSize: 10, letterSpacing: "0.35em", color: "rgba(10,30,60,.55)" }}
          >
            HAMZAOS · CONTROL DECK
          </div>
          <span
            aria-hidden="true"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#22D3FF",
              boxShadow: "0 0 8px #22D3FF",
              animation: "cyan-pulse 2s ease-in-out infinite",
            }}
          />
        </div>

        <div className="relative z-[2] flex flex-col gap-4">
          <ProfileSection />
          <Divider />
          <NowPlayingSection />
          <Divider />
          <WeatherSection />
          <Divider />
          <GithubSection />
        </div>

        {/* Deck footer: barcode */}
        <div className="absolute bottom-[14px] left-[16px] right-[16px] flex items-center justify-between opacity-55">
          <span className="barcode" style={{ display: "inline-block", height: 8, width: 64, borderRadius: 1 }} />
          <span className="mono-stroke" style={{ fontSize: 8, color: "var(--color-ink-2)", letterSpacing: "0.25em" }}>
            DECK-00-7
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export const CONTROL_DECK_SIZE = { w: DECK_W, h: DECK_H };
