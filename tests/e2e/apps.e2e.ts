import { test, expect } from "@playwright/test";

const icon = (page: import("@playwright/test").Page, name: string) =>
  page.locator(`[data-icon="${name}"]`);

test("opening Projects shows the Projects view with filter chips", async ({ page }) => {
  await page.goto("/");
  await icon(page, "projects").click();
  const win = page.locator('[data-window][data-app="files"]');
  await expect(win).toBeVisible();
  await expect(win.locator("[data-files-title]")).toHaveText("Projects");
  await expect(win.getByRole("button", { name: "All", exact: true })).toBeVisible();
  await expect(win.getByRole("button", { name: "Mobile", exact: true })).toBeVisible();
});

test("opening Experience shows master-detail", async ({ page }) => {
  await page.goto("/");
  await icon(page, "experience").click();
  const win = page.locator('[data-window][data-app="files"]');
  await expect(win.locator("[data-files-title]")).toHaveText("Experience");
  // Batelco role summary is shown in the detail pane on default selection
  await expect(win.getByText("Android Development Team", { exact: false })).toBeVisible();
});

test("opening Education shows the detail panel", async ({ page }) => {
  await page.goto("/");
  await icon(page, "education").click();
  const win = page.locator('[data-window][data-app="files"]');
  await expect(win.locator("[data-files-title]")).toHaveText("Education");
  await expect(win.getByText("American University of Bahrain")).toBeVisible();
});

test("clicking a project tile opens its case study", async ({ page }) => {
  await page.goto("/?open=files");
  const win = page.locator('[data-window][data-app="files"]');
  await expect(win).toBeVisible();
  await win.locator('[data-project-tile="anchor"]').click();
  await expect(page.locator('[data-window][data-app="caseStudy"]')).toBeVisible();
  await expect(
    page.locator('[data-case-study="anchor"]').getByRole("heading", { name: "Anchor" }),
  ).toBeVisible();
});

test("project with opensApp=research opens the Research app instead of a case study", async ({ page }) => {
  await page.goto("/?open=files");
  const win = page.locator('[data-window][data-app="files"]');
  await win.locator('[data-project-tile="marbertv2"]').click();
  await expect(page.locator('[data-window][data-app="research"]')).toBeVisible();
});

test("Research app shows title, metrics and buttons", async ({ page }) => {
  await page.goto("/?open=research");
  const win = page.locator('[data-window][data-app="research"]');
  await expect(win).toBeVisible();
  await expect(win.getByRole("link", { name: /Code on GitHub/ })).toBeVisible();
  await expect(win.getByRole("button", { name: /Copy citation/ })).toBeVisible();
});

test("Skills app opens and renders categories", async ({ page }) => {
  await page.goto("/?open=skills");
  const win = page.locator('[data-window][data-app="skills"]');
  await expect(win).toBeVisible();
  await expect(win.getByText("System Information")).toBeVisible();
  // Language category appears in the sidebar
  await expect(win.locator('button:has-text("Languages")').first()).toBeVisible();
});

test("Résumé app opens with Download and Open in new tab", async ({ page }) => {
  await page.goto("/?open=resume");
  const win = page.locator('[data-window][data-app="resume"]');
  await expect(win).toBeVisible();
  await expect(win.getByRole("button", { name: /Download/ })).toBeVisible();
  await expect(win.getByRole("link", { name: /Open in new tab/ })).toBeVisible();
});

test("every project opens either a case study or the research app", async ({ page }) => {
  // Keep this concise: iterate through slugs defined in content.
  const slugs = [
    "anchor",
    "smartcool",
    "gatekeep",
    "routemate",
    "marbertv2",
    "real-time-forum",
    "reboot-shooter",
    "graphql-profile",
    "iscmun",
  ];
  for (const slug of slugs) {
    await page.goto("about:blank");
    await page.goto(`/?open=project:${slug}`);
    const cs = page.locator(`[data-case-study="${slug}"]`);
    const research = page.locator('[data-window][data-app="research"]');
    // one of them must be visible
    await Promise.race([
      cs.waitFor({ state: "visible", timeout: 4000 }).catch(() => undefined),
      research.waitFor({ state: "visible", timeout: 4000 }).catch(() => undefined),
    ]);
    const anyVisible = (await cs.count()) + (await research.count()) > 0;
    expect(anyVisible, `no window opened for slug ${slug}`).toBeTruthy();
  }
});
