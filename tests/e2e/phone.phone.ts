import { test, expect, type Page } from "@playwright/test";

async function dismissWelcome(page: Page) {
  const dialog = page.getByRole("dialog");
  // Give the sheet a brief window to mount
  try {
    await dialog.waitFor({ state: "visible", timeout: 1500 });
  } catch {
    return; // sheet did not appear (already seen)
  }
  await dialog.getByRole("button", { name: "Explore the desktop" }).click();
  await expect(dialog).toHaveCount(0);
}

test("phone home screen renders status bar, widgets and dock", async ({ page }) => {
  await page.goto("/");
  await dismissWelcome(page);
  await expect(page.locator('[data-shell="phone"]')).toBeVisible();
  await expect(page.locator("[data-phone-statusbar]")).toBeVisible();
  await expect(page.locator("[data-phone-home]")).toBeVisible();
  await expect(page.locator("[data-phone-dock]")).toBeVisible();
  await expect(page.getByRole("button", { name: "Open Projects", exact: true })).toBeVisible();
});

test("opening an app zooms into full-screen with a back button, then back to home", async ({ page }) => {
  await page.goto("/");
  await dismissWelcome(page);

  await page.getByRole("button", { name: "Open Skills", exact: true }).click();
  await expect(page.locator('[data-phone-app="skills"]')).toBeVisible();
  await expect(page.getByRole("button", { name: "Back to home" })).toBeVisible();

  await page.getByRole("button", { name: "Back to home" }).click();
  await expect(page.locator("[data-phone-home]")).toBeVisible();
  await expect(page.locator('[data-phone-app="skills"]')).toHaveCount(0);
});

test("every home grid app opens full-screen", async ({ page }) => {
  await page.goto("/");
  await dismissWelcome(page);

  const apps = [
    { btn: "Open Projects", attr: "files" },
    { btn: "Open Experience", attr: "files" },
    { btn: "Open Education", attr: "files" },
    { btn: "Open Research", attr: "research" },
    { btn: "Open Skills", attr: "skills" },
    { btn: "Open Hamza", attr: "hamza" },
    { btn: "Open Résumé", attr: "resume" },
  ];
  for (const a of apps) {
    await page.getByRole("button", { name: a.btn, exact: true }).click();
    await expect(page.locator(`[data-phone-app="${a.attr}"]`).first()).toBeVisible();
    await page.getByRole("button", { name: "Back to home" }).click();
    await expect(page.locator(`[data-phone-app="${a.attr}"]`)).toHaveCount(0);
    await expect(page.locator("[data-phone-home]")).toBeVisible();
  }
});

test("deep link opens an app directly in phone mode", async ({ page }) => {
  await page.goto("/?open=research");
  await expect(page.locator('[data-phone-app="research"]')).toBeVisible();
});

test("welcome bottom sheet opens from the dock", async ({ page }) => {
  await page.goto("/");
  await dismissWelcome(page);

  await page.getByRole("button", { name: "Welcome", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("phone screenshots", async ({ page }) => {
  await page.goto("/");
  await dismissWelcome(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: "screenshots/phone-home-390.png", fullPage: false });

  await page.setViewportSize({ width: 360, height: 780 });
  await page.waitForTimeout(200);
  await page.screenshot({ path: "screenshots/phone-home-360.png", fullPage: false });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open Hamza", exact: true }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: "screenshots/phone-hamza-390.png", fullPage: false });
});
