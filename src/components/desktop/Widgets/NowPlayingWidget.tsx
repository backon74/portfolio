"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { WidgetFrame } from "./WidgetFrame";
import type { SongWidgetData } from "@/lib/itunes";
import { song as songContent } from "@/content/site";

export const NOW_PLAYING_WIDGET_SIZE = { w: 340, h: 140 } as const;

type State = "loading" | "ok" | "empty";

function Vinyl({ art, playing }: { art: string | null; playing: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        width: 92,
        height: 92,
        borderRadius: "50%",
        animation: playing ? "vinyl-spin 6s linear infinite" : undefined,
        animationPlayState: playing ? "running" : "paused",
        background:
          "radial-gradient(circle at 50% 50%, #1b3666 0%, #0b1a33 40%, #050c1d 70%, #020612 100%)",
        boxShadow:
          "inset 0 0 0 2px rgba(255,255,255,.1), inset 0 0 20px rgba(34,211,255,.18), 0 2px 8px rgba(10,30,60,.4), 0 0 14px -4px rgba(34,211,255,.5)",
      }}
    >
      {/* Groove rings */}
      {[88, 76, 66, 56, 46].map((d) => (
        <div
          key={d}
          style={{
            position: "absolute",
            top: `calc(50% - ${d / 2}px)`,
            left: `calc(50% - ${d / 2}px)`,
            width: d,
            height: d,
            borderRadius: "50%",
            border: "1px solid rgba(180,210,255,.08)",
          }}
        />
      ))}
      {/* Center label (album art if present) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "inset 0 0 0 1.5px rgba(34,211,255,.5)",
          background: "#0b1a33",
        }}
      >
        {art ? (
          <Image src={art} alt="" fill sizes="36px" className="object-cover" unoptimized />
        ) : (
          <div
            style={{
              display: "grid",
              placeItems: "center",
              width: "100%",
              height: "100%",
              color: "#22D3FF",
              fontSize: 14,
            }}
          >
            ♪
          </div>
        )}
      </div>
      {/* Spindle hole */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          borderRadius: "50%",
          background: "#000",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,.1)",
        }}
      />
      {/* Cyan glint */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(34,211,255,.25) 0%, transparent 35%, transparent 65%, rgba(255,255,255,.08) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export function NowPlayingWidget() {
  const [data, setData] = useState<SongWidgetData | null>(null);
  const [state, setState] = useState<State>("loading");
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
        if (cancelled) return;
        setData(json);
        setState("ok");
      } catch {
        if (!cancelled) {
          setData({
            title: songContent.title,
            artist: songContent.artist,
            artworkUrl: null,
            previewUrl: null,
            trackUrl: null,
          });
          setState("empty");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      if (!a.duration || Number.isNaN(a.duration)) return;
      setProgress(a.currentTime / a.duration);
    };
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
      a.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    }
  };

  const title = data?.title ?? songContent.title;
  const artist = data?.artist ?? songContent.artist;
  const preview = data?.previewUrl ?? null;
  const art = data?.artworkUrl ?? null;
  const trackUrl = data?.trackUrl ?? null;
  const disabled = !preview;

  return (
    <WidgetFrame
      width={NOW_PLAYING_WIDGET_SIZE.w}
      height={NOW_PLAYING_WIDGET_SIZE.h}
      label="Now playing"
      code="NPL-315"
    >
      <div className="flex h-full items-center gap-[12px] p-[12px]">
        {state === "loading" ? (
          <div className="size-[92px] shrink-0 animate-pulse rounded-full bg-[color:var(--color-surface-3)]" />
        ) : (
          <Vinyl art={art} playing={playing} />
        )}
        <div className="min-w-0 flex-1">
          <div
            className="mono-stroke text-[9px] uppercase"
            style={{ color: "var(--color-ink-3)", letterSpacing: "0.25em" }}
          >
            Now Playing
          </div>
          <a
            href={trackUrl ?? "#"}
            target={trackUrl ? "_blank" : undefined}
            rel="noreferrer noopener"
            className="mt-[2px] block truncate text-[14px] font-semibold text-[color:var(--color-ink)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            style={{ fontFamily: "var(--font-display), var(--font-sans)" }}
            aria-disabled={!trackUrl}
            onClick={(e) => {
              if (!trackUrl) e.preventDefault();
            }}
          >
            {title}
          </a>
          <div className="truncate text-[12px] text-[color:var(--color-ink-2)]">{artist}</div>
          <div className="mt-[6px] h-[3px] overflow-hidden rounded-full bg-[color:var(--color-surface-3)]">
            <div
              className="h-full transition-[width] duration-100"
              style={{
                width: `${Math.round(progress * 100)}%`,
                background: "linear-gradient(90deg, var(--color-accent), var(--color-accent-hot))",
                boxShadow: "0 0 8px rgba(34,211,255,.6)",
              }}
              aria-hidden
            />
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={disabled}
          aria-label={playing ? "Pause preview" : "Play 30-second preview"}
          className="flex size-[38px] items-center justify-center rounded-full text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          style={{
            background: "linear-gradient(180deg, #2E7BF6 0%, #1D4FD3 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,.4), 0 2px 8px rgba(10,30,60,.25), 0 0 14px rgba(34,211,255,.5)",
          }}
        >
          {playing ? <Pause size={16} /> : <Play size={16} className="translate-x-[1px]" />}
        </button>
        {preview && <audio ref={audioRef} src={preview} preload="none" />}
      </div>
    </WidgetFrame>
  );
}
