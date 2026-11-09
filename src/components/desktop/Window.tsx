"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useOs, type WindowState } from "@/os/store";
import { APPS } from "@/os/apps";
import { useReducedMotion } from "@/os/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const RESIZE_EDGES: Edge[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

export function Window({ win }: { win: WindowState }) {
  const focus = useOs((s) => s.focus);
  const close = useOs((s) => s.close);
  const minimise = useOs((s) => s.minimise);
  const toggleMaximise = useOs((s) => s.toggleMaximise);
  const move = useOs((s) => s.move);
  const resize = useOs((s) => s.resize);
  const focusedId = useOs((s) => s.focusedId);

  const reduced = useReducedMotion();
  const isFocused = focusedId === win.id;
  const app = APPS[win.appId];
  const AppComponent = app.component;

  const titleRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [glitch, setGlitch] = useState(!reduced);
  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setGlitch(false), 180);
    return () => clearTimeout(t);
  }, [reduced]);
  const dragState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizeState = useRef<{
    edge: Edge;
    startX: number;
    startY: number;
    origRect: { x: number; y: number; w: number; h: number };
  } | null>(null);

  // Focus into the window on open
  useEffect(() => {
    if (isFocused && bodyRef.current) {
      const focusable = bodyRef.current.querySelector<HTMLElement>(
        'button, a, input, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }
    // when closed, return focus to opener if present
    return () => {
      if (win.openerEl) {
        const el = document.querySelector<HTMLElement>(`[data-icon="${win.appId}"]`);
        el?.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win.id]);

  const onTitlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("[data-traffic-light]")) return;
      if (win.maximised) return;
      focus(win.id);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: win.rect.x,
        origY: win.rect.y,
      };
    },
    [focus, win.id, win.rect.x, win.rect.y, win.maximised],
  );

  const onTitlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragState.current) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      move(win.id, { x: dragState.current.origX + dx, y: dragState.current.origY + dy });
    },
    [move, win.id],
  );

  const onTitlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragState.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  const onResizeDown = useCallback(
    (edge: Edge) => (e: React.PointerEvent<HTMLDivElement>) => {
      e.stopPropagation();
      focus(win.id);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      resizeState.current = {
        edge,
        startX: e.clientX,
        startY: e.clientY,
        origRect: { ...win.rect },
      };
    },
    [focus, win.id, win.rect],
  );

  const onResizeMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const st = resizeState.current;
      if (!st) return;
      const dx = e.clientX - st.startX;
      const dy = e.clientY - st.startY;
      let { x, y, w, h } = st.origRect;
      if (st.edge.includes("e")) w = st.origRect.w + dx;
      if (st.edge.includes("w")) {
        w = st.origRect.w - dx;
        x = st.origRect.x + dx;
      }
      if (st.edge.includes("s")) h = st.origRect.h + dy;
      if (st.edge.includes("n")) {
        h = st.origRect.h - dy;
        y = st.origRect.y + dy;
      }
      resize(win.id, { x, y, w, h });
    },
    [resize, win.id],
  );

  const onResizeUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    resizeState.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  if (win.minimised) return null;

  return (
    <motion.div
      role="dialog"
      aria-labelledby={`title-${win.id}`}
      data-window={win.id}
      data-app={win.appId}
      data-focused={isFocused}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      transition={
        reduced
          ? { duration: 0.08 }
          : { type: "spring", stiffness: 420, damping: 34, mass: 0.9 }
      }
      onPointerDown={() => focus(win.id)}
      className="liquid-glass pointer-events-auto absolute flex flex-col"
      style={{
        left: win.rect.x,
        top: win.rect.y,
        width: win.rect.w,
        height: win.rect.h,
        zIndex: win.z,
        borderRadius: 18,
        background: isFocused ? "rgba(248,251,255,0.82)" : "rgba(236,244,255,0.52)",
        boxShadow: isFocused
          ? "0 0 0 0.5px rgba(10,30,60,.2), inset 0 1px 0 rgba(255,255,255,.75), 0 30px 70px -20px rgba(10,30,60,.5), 0 0 60px -10px rgba(34,211,255,.3)"
          : "0 0 0 0.5px rgba(10,30,60,.12), inset 0 1px 0 rgba(255,255,255,.4), 0 10px 30px -12px rgba(10,30,60,.25)",
        backdropFilter: isFocused ? "blur(40px) saturate(200%)" : "blur(20px) saturate(140%)",
        WebkitBackdropFilter: isFocused ? "blur(40px) saturate(200%)" : "blur(20px) saturate(140%)",
        transition: reduced
          ? "box-shadow 80ms linear, background 80ms linear"
          : "box-shadow 160ms var(--ease-standard), background 160ms var(--ease-standard), backdrop-filter 160ms var(--ease-standard)",
        animation: glitch ? "rgb-split 180ms steps(3) 1" : undefined,
      }}
    >
      {/* Title bar */}
      <div
        ref={titleRef}
        className={cn(
          "relative z-[2] flex h-[44px] shrink-0 items-center",
          "cursor-default select-none",
        )}
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,.3) 0%, rgba(255,255,255,0) 100%)",
          borderBottom: "1px solid rgba(34,211,255,.18)",
        }}
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        onDoubleClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-traffic-light]")) return;
          toggleMaximise(win.id);
        }}
      >
        <TrafficLights
          focused={isFocused}
          onClose={() => close(win.id)}
          onMinimise={() => minimise(win.id)}
          onMaximise={() => toggleMaximise(win.id)}
        />
        <div
          id={`title-${win.id}`}
          className={cn(
            "pointer-events-none absolute left-1/2 -translate-x-1/2 text-[14px] leading-5 font-semibold",
            isFocused ? "text-[color:var(--color-ink)]" : "text-[color:var(--color-ink-3)]",
          )}
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
        >
          {app.title}
        </div>
      </div>

      {/* Body */}
      <div ref={bodyRef} className="relative z-[2] flex-1 overflow-auto" style={{ background: "rgba(255,255,255,.55)" }}>
        <AppComponent payload={win.payload} />
      </div>

      {/* Glitch scanline overlay (first ~180 ms) */}
      {glitch ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(34,211,255,.18) 0 1px, transparent 1px 3px)",
            mixBlendMode: "screen",
            opacity: 0.8,
          }}
        />
      ) : null}

      {/* Resize handles */}
      {!win.maximised &&
        RESIZE_EDGES.map((edge) => (
          <div
            key={edge}
            data-resize={edge}
            onPointerDown={onResizeDown(edge)}
            onPointerMove={onResizeMove}
            onPointerUp={onResizeUp}
            className="absolute"
            style={edgeStyle(edge)}
          />
        ))}
    </motion.div>
  );
}

function TrafficLights({
  focused,
  onClose,
  onMinimise,
  onMaximise,
}: {
  focused: boolean;
  onClose: () => void;
  onMinimise: () => void;
  onMaximise: () => void;
}) {
  return (
    <div
      data-traffic-light
      className="group ml-4 flex items-center gap-2"
    >
      <TrafficButton
        label="Close window"
        color="var(--color-tl-close)"
        focused={focused}
        onClick={onClose}
      />
      <TrafficButton
        label="Minimise window"
        color="var(--color-tl-min)"
        focused={focused}
        onClick={onMinimise}
      />
      <TrafficButton
        label="Maximise window"
        color="var(--color-tl-max)"
        focused={focused}
        onClick={onMaximise}
      />
    </div>
  );
}

function TrafficButton({
  label,
  color,
  focused,
  onClick,
}: {
  label: string;
  color: string;
  focused: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex h-3 w-3 items-center justify-center rounded-full",
        "transition-[background,box-shadow] duration-120",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/50",
      )}
      style={{
        background: focused ? color : "#D4D6DB",
        boxShadow: focused
          ? "inset 0 0 0 0.5px rgba(0,0,0,.14)"
          : "inset 0 0 0 0.5px rgba(0,0,0,.08)",
      }}
    />
  );
}

function edgeStyle(edge: Edge): React.CSSProperties {
  const HIT = 6;
  const CORNER = 12;
  const base: React.CSSProperties = { touchAction: "none" };
  switch (edge) {
    case "n":
      return { ...base, top: 0, left: CORNER, right: CORNER, height: HIT, cursor: "ns-resize" };
    case "s":
      return { ...base, bottom: 0, left: CORNER, right: CORNER, height: HIT, cursor: "ns-resize" };
    case "e":
      return { ...base, top: CORNER, bottom: CORNER, right: 0, width: HIT, cursor: "ew-resize" };
    case "w":
      return { ...base, top: CORNER, bottom: CORNER, left: 0, width: HIT, cursor: "ew-resize" };
    case "ne":
      return { ...base, top: 0, right: 0, width: CORNER, height: CORNER, cursor: "nesw-resize" };
    case "nw":
      return { ...base, top: 0, left: 0, width: CORNER, height: CORNER, cursor: "nwse-resize" };
    case "se":
      return { ...base, bottom: 0, right: 0, width: CORNER, height: CORNER, cursor: "nwse-resize" };
    case "sw":
      return { ...base, bottom: 0, left: 0, width: CORNER, height: CORNER, cursor: "nesw-resize" };
  }
}
