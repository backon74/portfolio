import { describe, it, expect, beforeEach } from "vitest";
import {
  useOs,
  APP_DEFAULTS,
  CASE_STUDY_CAP,
  clampRect,
  SAFE,
  DRAG_MIN_VISIBLE,
} from "@/os/store";

function resetStore() {
  useOs.setState({
    windows: {},
    order: [],
    focusedId: null,
    nextZ: 1,
  });
}

// jsdom gives us window.innerWidth/Height; set a known size
beforeEach(() => {
  resetStore();
  Object.defineProperty(window, "innerWidth", { value: 1440, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: 900, configurable: true });
  try {
    window.sessionStorage.clear();
  } catch {
    /* ignore */
  }
});

describe("OS store — open/focus/z-order", () => {
  it("opens a window and focuses it", () => {
    const id = useOs.getState().open("files");
    const state = useOs.getState();
    expect(state.windows[id]).toBeDefined();
    expect(state.focusedId).toBe(id);
    expect(state.order).toEqual([id]);
  });

  it("brings a window to front when focused again", () => {
    const a = useOs.getState().open("files");
    const b = useOs.getState().open("photos");
    expect(useOs.getState().focusedId).toBe(b);
    useOs.getState().focus(a);
    const { order, focusedId, windows } = useOs.getState();
    expect(focusedId).toBe(a);
    expect(order[order.length - 1]).toBe(a);
    expect(windows[a].z).toBeGreaterThan(windows[b].z);
  });

  it("single-instance apps re-use the same id and restore if minimised", () => {
    const a = useOs.getState().open("files");
    useOs.getState().minimise(a);
    expect(useOs.getState().windows[a].minimised).toBe(true);
    const b = useOs.getState().open("files");
    expect(b).toBe(a);
    expect(useOs.getState().windows[a].minimised).toBe(false);
  });
});

describe("OS store — case-study cap", () => {
  it(`keeps at most ${CASE_STUDY_CAP} case-study windows and evicts the oldest`, () => {
    const ids: string[] = [];
    for (let i = 0; i < CASE_STUDY_CAP + 2; i++) {
      ids.push(useOs.getState().open("caseStudy", { payload: { slug: `p${i}` } }));
    }
    const cs = Object.values(useOs.getState().windows).filter(
      (w) => w.appId === "caseStudy",
    );
    expect(cs.length).toBe(CASE_STUDY_CAP);
    // First two should be gone
    expect(useOs.getState().windows[ids[0]]).toBeUndefined();
    expect(useOs.getState().windows[ids[1]]).toBeUndefined();
    // Last ones remain
    expect(useOs.getState().windows[ids[ids.length - 1]]).toBeDefined();
  });

  it("re-opening the same case-study slug does not create a new window", () => {
    const a = useOs.getState().open("caseStudy", { payload: { slug: "anchor" } });
    const b = useOs.getState().open("caseStudy", { payload: { slug: "anchor" } });
    expect(a).toBe(b);
  });
});

describe("OS store — minimise/restore/maximise/close", () => {
  it("minimise clears focus if minimised window was focused", () => {
    const a = useOs.getState().open("files");
    useOs.getState().minimise(a);
    expect(useOs.getState().focusedId).toBeNull();
    expect(useOs.getState().windows[a].minimised).toBe(true);
  });

  it("restore brings window back and re-focuses it", () => {
    const a = useOs.getState().open("files");
    useOs.getState().minimise(a);
    useOs.getState().restore(a);
    expect(useOs.getState().windows[a].minimised).toBe(false);
    expect(useOs.getState().focusedId).toBe(a);
  });

  it("toggleMaximise saves prevRect and restores it", () => {
    const a = useOs.getState().open("files");
    const orig = { ...useOs.getState().windows[a].rect };
    useOs.getState().toggleMaximise(a);
    expect(useOs.getState().windows[a].maximised).toBe(true);
    expect(useOs.getState().windows[a].prevRect).toEqual(orig);
    useOs.getState().toggleMaximise(a);
    expect(useOs.getState().windows[a].maximised).toBe(false);
    expect(useOs.getState().windows[a].rect).toEqual(orig);
  });

  it("close removes the window and re-focuses the next in order", () => {
    const a = useOs.getState().open("files");
    const b = useOs.getState().open("photos");
    useOs.getState().close(b);
    expect(useOs.getState().windows[b]).toBeUndefined();
    expect(useOs.getState().focusedId).toBe(a);
  });
});

describe("OS store — move/resize/clamp", () => {
  it("move clamps the window so at least 80px of title stays on screen", () => {
    const a = useOs.getState().open("files");
    useOs.getState().move(a, { x: -99999, y: -99999 });
    const r = useOs.getState().windows[a].rect;
    // The right edge of the window must be at least DRAG_MIN_VISIBLE past the left safe area
    expect(r.x + r.w).toBeGreaterThanOrEqual(SAFE.left + DRAG_MIN_VISIBLE);
    expect(r.y).toBeGreaterThanOrEqual(SAFE.top);
    useOs.getState().move(a, { x: 99999, y: 99999 });
    const r2 = useOs.getState().windows[a].rect;
    expect(r2.x).toBeLessThanOrEqual(1440 - SAFE.right - DRAG_MIN_VISIBLE);
    expect(r2.y).toBeLessThanOrEqual(900 - SAFE.bottom - 44);
  });

  it("resize respects app minimum size", () => {
    const a = useOs.getState().open("files");
    useOs.getState().resize(a, { w: 10, h: 10 });
    const r = useOs.getState().windows[a].rect;
    expect(r.w).toBeGreaterThanOrEqual(APP_DEFAULTS.files.minSize.w);
    expect(r.h).toBeGreaterThanOrEqual(APP_DEFAULTS.files.minSize.h);
  });

  it("clampRect keeps windows inside the viewport", () => {
    const clamped = clampRect(
      { x: 5000, y: 5000, w: 400, h: 300 },
      { w: 1024, h: 768 },
    );
    expect(clamped.x + DRAG_MIN_VISIBLE).toBeLessThanOrEqual(1024 - SAFE.right + 0.01);
    expect(clamped.y).toBeLessThanOrEqual(768 - SAFE.bottom - 44);
  });
});

describe("OS store — cascade / minimiseAll", () => {
  it("cascade staggers windows by 28px", () => {
    // Two case-study windows get the same default size → delta is pure stagger.
    const a = useOs.getState().open("caseStudy", { payload: { slug: "p1" } });
    const b = useOs.getState().open("caseStudy", { payload: { slug: "p2" } });
    useOs.getState().cascade();
    const ra = useOs.getState().windows[a].rect;
    const rb = useOs.getState().windows[b].rect;
    expect(rb.x - ra.x).toBe(28);
    expect(rb.y - ra.y).toBe(28);
  });

  it("minimiseAll hides every window", () => {
    useOs.getState().open("files");
    useOs.getState().open("photos");
    useOs.getState().minimiseAll();
    const allMin = Object.values(useOs.getState().windows).every((w) => w.minimised);
    expect(allMin).toBe(true);
    expect(useOs.getState().focusedId).toBeNull();
  });
});

describe("OS store — persistence (sessionStorage)", () => {
  it("writes state into sessionStorage after mutation", () => {
    useOs.getState().open("files");
    const raw = window.sessionStorage.getItem("hamzaos.os.v1");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string);
    expect(parsed.order.length).toBe(1);
  });
});
