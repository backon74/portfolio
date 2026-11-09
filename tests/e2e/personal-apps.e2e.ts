import { test, expect } from "@playwright/test";

test("Welcome window opens via deep link ?welcome=1", async ({ page }) => {
  await page.goto("/?welcome=1");
  const win = page.locator('[data-window][data-app="welcome"]');
  await expect(win).toBeVisible();
  await expect(win.getByText("Hi, I'm Hamza", { exact: false })).toBeVisible();
  await expect(win.getByRole("button", { name: /Explore the desktop/ })).toBeVisible();
  await expect(win.getByRole("button", { name: /Open Recruiter View/ })).toBeVisible();
});

test("Hamza app opens with tabs and header", async ({ page }) => {
  await page.goto("/?open=hamza");
  const win = page.locator('[data-window][data-app="hamza"]');
  await expect(win).toBeVisible();
  await expect(win.getByRole("tab", { name: "About" })).toBeVisible();
  await expect(win.getByRole("tab", { name: "Beyond code" })).toBeVisible();
  await expect(win.getByRole("tab", { name: "Awards" })).toBeVisible();
});

test.skip("Hamza > Trips removed in v2.1 overhaul", async () => {});

test("Photos lightbox opens and closes with Escape", async ({ page }) => {
  await page.goto("/?open=photos");
  const win = page.locator('[data-window][data-app="photos"]');
  await expect(win).toBeVisible();
  await win.locator('[data-photo-thumb="0"]').click();
  const dialog = win.locator("[data-lightbox]");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});

test("Mail app renders form with required fields and submit button", async ({ page }) => {
  await page.goto("/?open=mail");
  const win = page.locator('[data-window][data-app="mail"]');
  await expect(win).toBeVisible();
  await expect(win.locator("#mail-name")).toBeVisible();
  await expect(win.locator("#mail-email")).toBeVisible();
  await expect(win.locator("#mail-subject")).toBeVisible();
  await expect(win.locator("#mail-message")).toBeVisible();
  await expect(win.getByRole("button", { name: /Send/ })).toBeDisabled();
});

test("Mail app: submitting without RESEND key shows mailto fallback", async ({ page }) => {
  await page.goto("/?open=mail");
  const win = page.locator('[data-window][data-app="mail"]');
  await win.locator("#mail-name").fill("Test Recruiter");
  await win.locator("#mail-email").fill("test@example.com");
  await win.locator("#mail-message").fill(
    "Hi Hamza, this is an automated test message that is long enough.",
  );
  await win.getByRole("button", { name: /Send/ }).click();
  await expect(win.locator("[data-mail-mailto]")).toBeVisible();
});

test("About HamzaOS opens from the menu-bar logo", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("About HamzaOS").click();
  const win = page.locator('[data-window][data-app="aboutOs"]');
  await expect(win).toBeVisible();
  await expect(win.getByText("HamzaOS 1.0")).toBeVisible();
});

test("Keyboard shortcuts window opens via Help menu", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-menu="help"]').click();
  await page.getByRole("menuitem", { name: /Keyboard shortcuts/ }).click();
  const win = page.locator('[data-window][data-app="shortcuts"]');
  await expect(win).toBeVisible();
  await expect(
    win.getByRole("heading", { name: "Keyboard shortcuts", level: 1 }),
  ).toBeVisible();
});
