import { test, expect } from "@playwright/test";

const icon = (page: import("@playwright/test").Page, name: string) =>
  page.locator(`[data-icon="${name}"]`);

test("desktop shell renders menu bar, dock and desktop icons", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("menubar", { name: "HamzaOS menu bar" })).toBeVisible();
  await expect(page.getByTestId("dock")).toBeVisible();
  await expect(icon(page, "projects")).toBeVisible();
  await expect(icon(page, "hamza")).toBeVisible();
});

test("single click on a desktop icon opens a window", async ({ page }) => {
  await page.goto("/");
  await icon(page, "hamza").click();
  await expect(page.locator('[data-window][data-app="hamza"]')).toBeVisible();
});

test("drag moves a window", async ({ page }) => {
  await page.goto("/");
  await icon(page, "projects").click();
  const win = page.locator('[data-window][data-app="files"]');
  await expect(win).toBeVisible();
  const before = await win.boundingBox();
  // Drag by the title bar area (y offset 10 inside the window)
  await page.mouse.move(before!.x + 100, before!.y + 10);
  await page.mouse.down();
  await page.mouse.move(before!.x + 250, before!.y + 110, { steps: 10 });
  await page.mouse.up();
  const after = await win.boundingBox();
  expect(Math.abs(after!.x - before!.x)).toBeGreaterThan(50);
});

test("minimise hides the window; dock icon restores it", async ({ page }) => {
  await page.goto("/");
  await icon(page, "hamza").click();
  const win = page.locator('[data-window][data-app="hamza"]');
  await expect(win).toBeVisible();
  await win.getByLabel("Minimise window").click();
  await expect(win).toHaveCount(0);
  // click the desktop Hamza icon to re-open
  await icon(page, "hamza").click();
  await expect(page.locator('[data-window][data-app="hamza"]')).toBeVisible();
});

test("maximise fills the usable area; close removes the window", async ({ page }) => {
  await page.goto("/");
  await icon(page, "hamza").click();
  const win = page.locator('[data-window][data-app="hamza"]');
  await win.getByLabel("Maximise window").click();
  const box = await win.boundingBox();
  expect(box!.width).toBeGreaterThan(1000);
  await win.getByLabel("Close window").click();
  await expect(win).toHaveCount(0);
});

test("keyboard: Enter on a focused desktop icon opens it", async ({ page }) => {
  await page.goto("/");
  await icon(page, "skills").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-window][data-app="skills"]')).toBeVisible();
});

test("deep link ?open=skills opens the Skills app", async ({ page }) => {
  await page.goto("/?open=skills");
  await expect(page.locator('[data-window][data-app="skills"]')).toBeVisible();
});

test("deep link ?open=project:anchor opens a case study window", async ({ page }) => {
  await page.goto("/?open=project:anchor");
  await expect(page.locator('[data-window][data-app="caseStudy"]')).toBeVisible();
});

test("window cannot be dragged completely off-screen", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await icon(page, "hamza").click();
  const win = page.locator('[data-window][data-app="hamza"]');
  const before = await win.boundingBox();
  await page.mouse.move(before!.x + 100, before!.y + 10);
  await page.mouse.down();
  await page.mouse.move(-5000, -5000, { steps: 5 });
  await page.mouse.up();
  const after = await win.boundingBox();
  const viewport = page.viewportSize()!;
  expect(after!.x + after!.width).toBeGreaterThan(80);
  expect(after!.y + 44).toBeLessThan(viewport.height);
});
