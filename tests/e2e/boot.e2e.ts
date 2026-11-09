import { test, expect } from "@playwright/test";

const BOOT = '[data-testid="boot-screen"]';

test("boot screen appears on first visit and disappears", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "no-preference" });
  await context.addInitScript(() => {
    try {
      window.localStorage.clear();
    } catch {
      /* ignore */
    }
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(BOOT)).toBeVisible();
  // Wait for it to fade away on its own (1.2s + 250ms fade)
  await expect(page.locator(BOOT)).toBeHidden({ timeout: 4000 });
  await expect(page.getByTestId("dock")).toBeVisible();
  await context.close();
});

test("boot screen is skipped on second visit (flag persists)", async ({ page }) => {
  // first visit sets the flag
  await page.goto("/");
  await page.waitForTimeout(1800);
  // second visit: no boot screen
  await page.goto("/");
  // boot element should either never render or already be gone
  await page.waitForTimeout(200);
  await expect(page.locator(BOOT)).toHaveCount(0);
});

test("boot screen is skipped on deep links", async ({ page, context }) => {
  await context.addInitScript(() => {
    try {
      window.localStorage.clear();
    } catch {
      /* ignore */
    }
  });
  await page.goto("/?open=hamza");
  // Deep link suppresses the boot screen even on first visit.
  await page.waitForTimeout(200);
  await expect(page.locator(BOOT)).toHaveCount(0);
  await expect(page.locator('[data-window][data-app="hamza"]')).toBeVisible();
});

test("boot screen is skipped under prefers-reduced-motion", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  await context.addInitScript(() => {
    try {
      window.localStorage.clear();
    } catch {
      /* ignore */
    }
  });
  const page = await context.newPage();
  await page.goto("/");
  await page.waitForTimeout(200);
  await expect(page.locator(BOOT)).toHaveCount(0);
  await expect(page.getByTestId("dock")).toBeVisible();
  await context.close();
});

test("sound toggle switches icon and persists in localStorage", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("/");
  // fresh context has empty localStorage anyway; ensure sound is off
  await page.evaluate(() => {
    try {
      window.localStorage.removeItem("hamzaos.sound.on");
    } catch {
      /* ignore */
    }
  });
  await page.reload();
  const btn = page.getByTestId("sound-toggle");
  await expect(btn).toHaveAttribute("aria-label", "Enable sound");
  await btn.click();
  await expect(btn).toHaveAttribute("aria-label", "Mute sound");
  const stored = await page.evaluate(() => window.localStorage.getItem("hamzaos.sound.on"));
  expect(stored).toBe("1");
  // reload and confirm it stays on
  await page.reload();
  await expect(page.getByTestId("sound-toggle")).toHaveAttribute("aria-label", "Mute sound");
  await context.close();
});
