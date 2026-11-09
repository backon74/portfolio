import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  initSoundFromStorage,
  setSoundOn,
  getSoundOn,
  playSoundNow,
  __resetSoundForTests,
  __markGestureForTests,
} from "@/os/hooks/useSound";

class FakeAudio {
  src: string;
  volume = 1;
  currentTime = 0;
  preload = "auto";
  played = 0;
  constructor(src: string) {
    this.src = src;
  }
  play() {
    this.played += 1;
    return Promise.resolve();
  }
}

beforeEach(() => {
  __resetSoundForTests();
  try {
    window.localStorage.clear();
  } catch {
    /* ignore */
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).Audio = FakeAudio as unknown as typeof Audio;
});

describe("sound persistence", () => {
  it("defaults to off", () => {
    initSoundFromStorage();
    expect(getSoundOn()).toBe(false);
  });

  it("persists the on state across inits", () => {
    setSoundOn(true);
    expect(window.localStorage.getItem("hamzaos.sound.on")).toBe("1");
    __resetSoundForTests();
    initSoundFromStorage();
    expect(getSoundOn()).toBe(true);
  });

  it("writes 0 when disabled", () => {
    setSoundOn(true);
    setSoundOn(false);
    expect(window.localStorage.getItem("hamzaos.sound.on")).toBe("0");
  });

  it("swallows localStorage errors", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(() => setSoundOn(true)).not.toThrow();
    spy.mockRestore();
  });
});

describe("sound playback gate", () => {
  it("does not play before a user gesture", () => {
    setSoundOn(true); // enables without chime
    // No gesture marked
    expect(playSoundNow("open")).toBe(false);
  });

  it("does not play when muted, even after gesture", () => {
    __markGestureForTests();
    expect(playSoundNow("open")).toBe(false);
  });

  it("plays when on and a gesture has been seen", () => {
    __markGestureForTests();
    setSoundOn(true);
    expect(playSoundNow("open")).toBe(true);
  });

  it("first enable triggers the boot chime (counts click as gesture)", () => {
    // simulate toggle-on via setSoundOn with chime
    setSoundOn(true, { chime: true });
    // boot chime played (gesture marked internally) → subsequent calls work
    expect(playSoundNow("click")).toBe(true);
  });
});
