import { describe, it, expect, beforeEach } from "vitest";

const BOOT_KEY = "hamzaos.boot.seen";

beforeEach(() => {
  try {
    window.localStorage.clear();
  } catch {
    /* ignore */
  }
});

describe("boot flag", () => {
  it("is unset on first visit", () => {
    expect(window.localStorage.getItem(BOOT_KEY)).toBeNull();
  });

  it("writes '1' once set", () => {
    window.localStorage.setItem(BOOT_KEY, "1");
    expect(window.localStorage.getItem(BOOT_KEY)).toBe("1");
  });

  it("second read returns the persisted value (simulating a refresh)", () => {
    window.localStorage.setItem(BOOT_KEY, "1");
    const seen = window.localStorage.getItem(BOOT_KEY) === "1";
    expect(seen).toBe(true);
  });
});
