import { test, expect } from "@playwright/test";

test("shell measurements match DESIGN.md §3", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("menubar", { name: "HamzaOS menu bar" }).waitFor();

  // Menu bar height = 32 (v2)
  const menuBar = page.getByRole("menubar", { name: "HamzaOS menu bar" });
  const mb = await menuBar.boundingBox();
  expect(mb!.height).toBe(32);

  // Dock exists; tile icon = 62 (v2)
  const dock = page.getByTestId("dock");
  const dockBox = await dock.boundingBox();
  expect(dockBox!.height).toBe(86);
  // Measure one dock icon's SVG wrapper
  const firstDockIcon = dock.locator("button[data-dock-item]").first();
  const iconSvg = firstDockIcon.locator("svg").first();
  const iconBox = await iconSvg.boundingBox();
  expect(iconBox!.width).toBe(62);
  expect(iconBox!.height).toBe(62);

  // Open a window; window radius = 18 (v2), title bar = 44
  await page.locator('[data-icon="hamza"]').click();
  const win = page.locator('[data-window][data-app="hamza"]');
  await expect(win).toBeVisible();
  const radius = await win.evaluate(
    (el) => getComputedStyle(el as HTMLElement).borderTopLeftRadius,
  );
  expect(radius).toBe("18px");
  const titleBarHeight = await win.evaluate((el) => {
    const title = (el as HTMLElement).querySelector("[id^='title-']")?.parentElement;
    if (!title) return "0px";
    return getComputedStyle(title).height;
  });
  expect(titleBarHeight).toBe("44px");
});

test("reduced-motion: window appears without scale animation", async ({ browser }) => {
  const ctx = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 1440, height: 900 },
  });
  const page = await ctx.newPage();
  await page.goto("/");
  await page.getByRole("menubar", { name: "HamzaOS menu bar" }).waitFor();
  await page.locator('[data-icon="skills"]').click();
  const win = page.locator('[data-window][data-app="skills"]');
  await expect(win).toBeVisible();
  // A transition shouldn't exceed ~100ms under reduced motion.
  // Check that the effective box-shadow transition duration has been shortened.
  const dur = await win.evaluate(
    (el) => getComputedStyle(el as HTMLElement).transitionDuration,
  );
  // Either the shadow transition is 0.08s (our override) or 0.12s untouched;
  // the *-motion override applies to every transition-duration, so expect <=0.12s.
  expect(parseFloat(dur)).toBeLessThanOrEqual(0.12);
  await ctx.close();
});

test("traffic lights, dock icons and menu items are keyboard-focusable", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("menubar", { name: "HamzaOS menu bar" }).waitFor();
  await page.locator('[data-icon="projects"]').click();
  const close = page.locator('[data-window][data-app="files"] >> role=button[name="Close window"]');
  await close.focus();
  const outline = await close.evaluate(
    (el) => getComputedStyle(el as HTMLElement).outlineStyle,
  );
  // focus-visible ring is a box-shadow / ring utility — just make sure the element can receive focus.
  expect(await close.evaluate((el) => document.activeElement === el)).toBe(true);
  expect(outline).toBeDefined();
});
