"use client";

import { create } from "zustand";

// ───────────────────────────────────────────────────────────── Types

export type AppId =
  | "welcome"
  | "files"
  | "caseStudy"
  | "research"
  | "skills"
  | "hamza"
  | "photos"
  | "resume"
  | "mail"
  | "aboutOs"
  | "shortcuts";

export type Rect = { x: number; y: number; w: number; h: number };

export type WindowState = {
  id: string;
  appId: AppId;
  payload?: Record<string, unknown>;
  rect: Rect;
  prevRect?: Rect;
  z: number;
  minimised: boolean;
  maximised: boolean;
  openerEl?: string | null; // id of element that opened the window (for focus return)
};

export type OsState = {
  windows: Record<string, WindowState>;
  order: string[]; // z-order back→front
  focusedId: string | null;
  nextZ: number;
};

export type OsActions = {
  open: (
    appId: AppId,
    opts?: { payload?: Record<string, unknown>; openerEl?: string | null }
  ) => string;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimise: (id: string) => void;
  restore: (id: string) => void;
  toggleMaximise: (id: string) => void;
  move: (id: string, pos: { x: number; y: number }) => void;
  resize: (id: string, rect: Partial<Rect>) => void;
  cascade: () => void;
  minimiseAll: () => void;
  closeAll: () => void;
  clampAllToViewport: (vw: number, vh: number) => void;
  hydrate: (state: Partial<OsState>) => void;
};

export type OsStore = OsState & OsActions;

// ───────────────────────────────────────────────────────────── Constants

// Safe area for windows, DESIGN.md §3: top 38, bottom 92, left/right 12
export const SAFE = { top: 38, bottom: 92, left: 12, right: 12 } as const;
// Drag constraint: at least 80px of title bar must stay on screen.
export const DRAG_MIN_VISIBLE = 80;
export const TITLE_BAR_HEIGHT = 44;

export const CASE_STUDY_CAP = 4;

// Default viewport for SSR / tests
const DEFAULT_VP = { w: 1440, h: 900 };

// ───────────────────────────────────────────────────────────── Helpers

function getViewport(): { w: number; h: number } {
  if (typeof window !== "undefined") {
    return { w: window.innerWidth, h: window.innerHeight };
  }
  return DEFAULT_VP;
}

export function clampRect(rect: Rect, vp = getViewport()): Rect {
  const minW = 240;
  const minH = 160;
  const w = Math.max(minW, Math.min(rect.w, vp.w - SAFE.left - SAFE.right));
  const h = Math.max(minH, Math.min(rect.h, vp.h - SAFE.top - SAFE.bottom));
  const maxX = vp.w - SAFE.right - DRAG_MIN_VISIBLE;
  const minX = SAFE.left + DRAG_MIN_VISIBLE - w;
  const x = Math.max(minX, Math.min(rect.x, maxX));
  // Keep title bar fully below menu bar and at least title bar visible above dock
  const minY = SAFE.top;
  const maxY = vp.h - SAFE.bottom - TITLE_BAR_HEIGHT;
  const y = Math.max(minY, Math.min(rect.y, maxY));
  return { x, y, w, h };
}

export function cascadeOffset(openCount: number): { dx: number; dy: number } {
  return { dx: openCount * 28, dy: openCount * 28 };
}

function centerRect(size: { w: number; h: number }, vp = getViewport()): Rect {
  const w = Math.min(size.w, Math.floor((vp.w - SAFE.left - SAFE.right) * 0.92));
  const h = Math.min(size.h, Math.floor((vp.h - SAFE.top - SAFE.bottom) * 0.92));
  return {
    x: Math.round((vp.w - w) / 2),
    y: Math.max(SAFE.top + 8, Math.round((vp.h - h) / 2)),
    w,
    h,
  };
}

let idCounter = 0;
export function makeId(appId: AppId, payload?: Record<string, unknown>): string {
  if (appId === "caseStudy" && payload && typeof payload.slug === "string") {
    return `caseStudy:${payload.slug}`;
  }
  // non-case-study apps are single-instance; id === appId
  if (appId !== "caseStudy") return appId;
  idCounter += 1;
  return `caseStudy:${idCounter}`;
}

// ───────────────────────────────────────────────────────────── App defaults

// Default & minimum sizes (per PRD §3.5)
export const APP_DEFAULTS: Record<
  AppId,
  { title: string; defaultSize: { w: number; h: number }; minSize: { w: number; h: number }; singleInstance: boolean }
> = {
  welcome: { title: "Welcome.txt", defaultSize: { w: 560, h: 420 }, minSize: { w: 360, h: 280 }, singleInstance: true },
  files: { title: "Files", defaultSize: { w: 960, h: 620 }, minSize: { w: 640, h: 420 }, singleInstance: true },
  caseStudy: { title: "Case Study", defaultSize: { w: 860, h: 700 }, minSize: { w: 560, h: 440 }, singleInstance: false },
  research: { title: "Research", defaultSize: { w: 900, h: 700 }, minSize: { w: 600, h: 460 }, singleInstance: true },
  skills: { title: "Skills", defaultSize: { w: 720, h: 560 }, minSize: { w: 520, h: 400 }, singleInstance: true },
  photos: { title: "Photos", defaultSize: { w: 900, h: 620 }, minSize: { w: 560, h: 420 }, singleInstance: true },
  hamza: { title: "Hamza", defaultSize: { w: 820, h: 620 }, minSize: { w: 540, h: 440 }, singleInstance: true },
  resume: { title: "Résumé.pdf", defaultSize: { w: 760, h: 860 }, minSize: { w: 500, h: 500 }, singleInstance: true },
  mail: { title: "Mail", defaultSize: { w: 600, h: 520 }, minSize: { w: 440, h: 400 }, singleInstance: true },
  aboutOs: { title: "About HamzaOS", defaultSize: { w: 420, h: 300 }, minSize: { w: 360, h: 260 }, singleInstance: true },
  shortcuts: { title: "Keyboard shortcuts", defaultSize: { w: 460, h: 440 }, minSize: { w: 360, h: 320 }, singleInstance: true },
};

// ───────────────────────────────────────────────────────────── sessionStorage

const STORAGE_KEY = "hamzaos.os.v1";

function loadPersisted(): Partial<OsState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OsState>;
    return parsed;
  } catch {
    return null;
  }
}

function persist(state: OsState): void {
  if (typeof window === "undefined") return;
  try {
    const slim: OsState = {
      windows: state.windows,
      order: state.order,
      focusedId: state.focusedId,
      nextZ: state.nextZ,
    };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
  } catch {
    /* ignore quota errors */
  }
}

// ───────────────────────────────────────────────────────────── Store

export const useOs = create<OsStore>((set, get) => ({
  windows: {},
  order: [],
  focusedId: null,
  nextZ: 1,

  open: (appId, opts = {}) => {
    const defaults = APP_DEFAULTS[appId];
    const payload = opts.payload;
    const id = makeId(appId, payload);
    const state = get();

    // Single-instance: focus existing
    if (state.windows[id]) {
      get().focus(id);
      if (state.windows[id].minimised) get().restore(id);
      return id;
    }

    const vp = getViewport();
    const openWindows = Object.values(state.windows);
    const { dx, dy } = cascadeOffset(openWindows.length);
    const base = centerRect(defaults.defaultSize, vp);
    const rect = clampRect({ x: base.x + dx, y: base.y + dy, w: base.w, h: base.h }, vp);

    const z = state.nextZ + 1;
    const win: WindowState = {
      id,
      appId,
      payload,
      rect,
      z,
      minimised: false,
      maximised: false,
      openerEl: opts.openerEl ?? null,
    };

    const newWindows = { ...state.windows, [id]: win };
    let newOrder = [...state.order.filter((x) => x !== id), id];

    // Case study cap: at most 4 open; evict oldest case study if exceeding
    if (appId === "caseStudy") {
      const caseStudyIds = newOrder.filter(
        (wid) => newWindows[wid]?.appId === "caseStudy"
      );
      while (caseStudyIds.length > CASE_STUDY_CAP) {
        const oldest = caseStudyIds.shift()!;
        delete newWindows[oldest];
        newOrder = newOrder.filter((x) => x !== oldest);
      }
    }

    set(() => {
      const next = { windows: newWindows, order: newOrder, focusedId: id, nextZ: z };
      persist({ ...get(), ...next });
      return next;
    });
    if (appId === "caseStudy" && payload && typeof payload.slug === "string") {
      // Fire-and-forget; analytics helper is a no-op on the server.
      void import("@/lib/analytics").then((m) =>
        m.track("project_opened", { slug: payload.slug as string }),
      );
    }
    return id;
  },

  close: (id) => {
    set((state) => {
      if (!state.windows[id]) return state;
      const windows = { ...state.windows };
      delete windows[id];
      const order = state.order.filter((x) => x !== id);
      const focusedId =
        state.focusedId === id ? order[order.length - 1] ?? null : state.focusedId;
      const next = { ...state, windows, order, focusedId };
      persist(next);
      return next;
    });
  },

  focus: (id) => {
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;
      const z = state.nextZ + 1;
      const windows = { ...state.windows, [id]: { ...win, z, minimised: false } };
      const order = [...state.order.filter((x) => x !== id), id];
      const next = { ...state, windows, order, focusedId: id, nextZ: z };
      persist(next);
      return next;
    });
  },

  minimise: (id) => {
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;
      const windows = { ...state.windows, [id]: { ...win, minimised: true } };
      const stillVisible = state.order.filter((x) => x !== id && !windows[x]?.minimised);
      const focusedId =
        state.focusedId === id ? stillVisible[stillVisible.length - 1] ?? null : state.focusedId;
      const next = { ...state, windows, focusedId };
      persist(next);
      return next;
    });
  },

  restore: (id) => {
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;
      const z = state.nextZ + 1;
      const windows = { ...state.windows, [id]: { ...win, minimised: false, z } };
      const order = [...state.order.filter((x) => x !== id), id];
      const next = { ...state, windows, order, focusedId: id, nextZ: z };
      persist(next);
      return next;
    });
  },

  toggleMaximise: (id) => {
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;
      const vp = getViewport();
      let patch: Partial<WindowState>;
      if (win.maximised && win.prevRect) {
        patch = { maximised: false, rect: win.prevRect, prevRect: undefined };
      } else {
        const maxRect: Rect = {
          x: SAFE.left + 12,
          y: SAFE.top + 12,
          w: vp.w - SAFE.left - SAFE.right - 24,
          h: vp.h - SAFE.top - SAFE.bottom - 24,
        };
        patch = { maximised: true, prevRect: win.rect, rect: maxRect };
      }
      const windows = { ...state.windows, [id]: { ...win, ...patch } };
      const next = { ...state, windows };
      persist(next);
      return next;
    });
  },

  move: (id, pos) => {
    set((state) => {
      const win = state.windows[id];
      if (!win || win.maximised) return state;
      const rect = clampRect({ ...win.rect, x: pos.x, y: pos.y });
      const windows = { ...state.windows, [id]: { ...win, rect } };
      const next = { ...state, windows };
      persist(next);
      return next;
    });
  },

  resize: (id, rect) => {
    set((state) => {
      const win = state.windows[id];
      if (!win || win.maximised) return state;
      const defaults = APP_DEFAULTS[win.appId];
      const merged = { ...win.rect, ...rect };
      const w = Math.max(defaults.minSize.w, merged.w);
      const h = Math.max(defaults.minSize.h, merged.h);
      const clamped = clampRect({ x: merged.x, y: merged.y, w, h });
      const windows = { ...state.windows, [id]: { ...win, rect: clamped } };
      const next = { ...state, windows };
      persist(next);
      return next;
    });
  },

  cascade: () => {
    set((state) => {
      const vp = getViewport();
      const windows = { ...state.windows };
      let i = 0;
      for (const id of state.order) {
        const win = windows[id];
        if (!win || win.minimised) continue;
        const defaults = APP_DEFAULTS[win.appId];
        const base = centerRect(defaults.defaultSize, vp);
        const rect = clampRect(
          { x: base.x + i * 28, y: base.y + i * 28, w: base.w, h: base.h },
          vp
        );
        windows[id] = { ...win, rect, maximised: false, prevRect: undefined };
        i += 1;
      }
      const next = { ...state, windows };
      persist(next);
      return next;
    });
  },

  minimiseAll: () => {
    set((state) => {
      const windows = { ...state.windows };
      for (const id of Object.keys(windows)) {
        windows[id] = { ...windows[id], minimised: true };
      }
      const next = { ...state, windows, focusedId: null };
      persist(next);
      return next;
    });
  },

  closeAll: () => {
    set(() => {
      const next = { windows: {}, order: [], focusedId: null, nextZ: 1 };
      persist(next);
      return next;
    });
  },

  clampAllToViewport: (vw, vh) => {
    set((state) => {
      const vp = { w: vw, h: vh };
      const windows = { ...state.windows };
      for (const id of Object.keys(windows)) {
        const win = windows[id];
        if (win.maximised) {
          windows[id] = {
            ...win,
            rect: {
              x: SAFE.left + 12,
              y: SAFE.top + 12,
              w: vp.w - SAFE.left - SAFE.right - 24,
              h: vp.h - SAFE.top - SAFE.bottom - 24,
            },
          };
        } else {
          windows[id] = { ...win, rect: clampRect(win.rect, vp) };
        }
      }
      const next = { ...state, windows };
      persist(next);
      return next;
    });
  },

  hydrate: (partial) => {
    set((state) => ({ ...state, ...partial }));
  },
}));

// ───────────────────────────────────────────────────────────── Rehydrate

export function rehydrateFromSession(): void {
  const persisted = loadPersisted();
  if (!persisted) return;
  useOs.setState((state) => ({ ...state, ...persisted }));
}
