import { test } from "@playwright/test";
import path from "node:path";

const apps = [
  { slug: "files-projects", url: "/?open=files" },
  { slug: "case-anchor", url: "/?open=project:anchor" },
  { slug: "research", url: "/?open=research" },
  { slug: "skills", url: "/?open=skills" },
  { slug: "resume", url: "/?open=resume" },
  { slug: "welcome", url: "/?welcome=1" },
  { slug: "hamza", url: "/?open=hamza" },
  { slug: "photos", url: "/?open=photos" },
  { slug: "mail", url: "/?open=mail" },
];

for (const a of apps) {
  test(`screenshot app ${a.slug} 1440x900`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(a.url);
    await page
      .getByRole("menubar", { name: "HamzaOS menu bar" })
      .waitFor({ state: "visible", timeout: 5000 })
      .catch(() => {});
    // wait briefly for the lazy-loaded app body
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join("screenshots", `app-${a.slug}-1440x900.png`),
      fullPage: false,
    });
  });
}
