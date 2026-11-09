"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Sound system for HamzaOS (desktop only).
 *
 * Rules (CLAUDE.md §8 + PRD §9):
 *  - Default off; speaker toggle in the menu bar enables it.
 *  - Persisted in `localStorage` under `hamzaos.sound.on`, wrapped in try/catch.
 *  - UI chimes are tiny and ONLY play after the first user gesture
 *    (browsers block audio before a gesture; we also guard explicitly).
 *  - Volume 0.35 for all sounds.
 *  - On the phone shell nothing imports this hook.
 */

export type SoundName = "boot" | "open" | "close" | "minimise" | "click";

const SOUND_KEY = "hamzaos.sound.on";
const VOLUME = 0.35;

const FILES: Record<SoundName, string> = {
  boot: "/audio/boot.wav",
  open: "/audio/open.wav",
  close: "/audio/close.wav",
  minimise: "/audio/minimise.wav",
  click: "/audio/click.wav",
};

// Module-level singletons keep audio state consistent across hook callers.
let on = false;
let gestureSeen = false;
let initialised = false;
const listeners = new Set<(v: boolean) => void>();
const cache = new Map<SoundName, HTMLAudioElement>();

function readPersisted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SOUND_KEY) === "1";
  } catch {
    return false;
  }
}

function persist(v: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SOUND_KEY, v ? "1" : "0");
  } catch {
    /* ignore quota / privacy errors */
  }
}

function notify() {
  listeners.forEach((l) => l(on));
}

function markGesture() {
  gestureSeen = true;
}

function ensureGestureListeners() {
  if (typeof window === "undefined" || gestureSeen) return;
  const once = () => {
    markGesture();
    window.removeEventListener("pointerdown", once);
    window.removeEventListener("keydown", once);
  };
  window.addEventListener("pointerdown", once, { once: true });
  window.addEventListener("keydown", once, { once: true });
}

function getAudio(name: SoundName): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  let a = cache.get(name);
  if (!a) {
    try {
      a = new Audio(FILES[name]);
      a.preload = "auto";
      a.volume = VOLUME;
      cache.set(name, a);
    } catch {
      return null;
    }
  }
  return a;
}

export function playSoundNow(name: SoundName): boolean {
  if (!on || !gestureSeen) return false;
  const a = getAudio(name);
  if (!a) return false;
  try {
    a.currentTime = 0;
    const p = a.play();
    if (p && typeof p.catch === "function") p.catch(() => undefined);
    return true;
  } catch {
    return false;
  }
}

export function setSoundOn(v: boolean, opts: { chime?: boolean } = {}) {
  const wasOn = on;
  on = v;
  persist(v);
  if (v && !wasOn && opts.chime) {
    // Acts as the "first enable" chime (PRD §3.3): user just clicked the
    // speaker toggle, so there's a gesture. Mark it so this click counts.
    markGesture();
    playSoundNow("boot");
  }
  notify();
}

export function getSoundOn(): boolean {
  return on;
}

/** Sync the module singleton with persisted state. Call once from the shell. */
export function initSoundFromStorage() {
  if (typeof window === "undefined") return;
  on = readPersisted();
  initialised = true;
  ensureGestureListeners();
  notify();
}

export function useSound() {
  const [state, setState] = useState<boolean>(() => (typeof window === "undefined" ? false : on));

  useEffect(() => {
    const l = (v: boolean) => setState(v);
    listeners.add(l);
    if (!initialised) initSoundFromStorage();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(on);
    ensureGestureListeners();
    return () => {
      listeners.delete(l);
    };
  }, []);

  const play = useCallback((name: SoundName) => playSoundNow(name), []);
  const toggle = useCallback(() => setSoundOn(!on, { chime: true }), []);
  const setOn = useCallback((v: boolean) => setSoundOn(v, { chime: v }), []);

  return { on: state, toggle, setOn, play };
}

/** Test-only reset. */
export function __resetSoundForTests() {
  on = false;
  gestureSeen = false;
  initialised = false;
  cache.clear();
  listeners.clear();
}

/** Test-only pretend-the-user-clicked. */
export function __markGestureForTests() {
  gestureSeen = true;
}
