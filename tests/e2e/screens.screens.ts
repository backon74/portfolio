import { test } from "@playwright/test";
import path from "node:path";

const sizes = [
  { w: 1440, h: 900, name: "1440x900" },
  { w: 1280, h: 800, name: "1280x800" },
  { w: 1024, h: 768, name: "1024x768" },
  { w: 390, h: 844, name: "390x844" },
];

const routes = [
  { path: "/", slug: "home" },
  { path: "/recruiter", slug: "recruiter" },
];

for (const r of routes) {
  for (const s of sizes) {
    test(`screenshot ${r.slug} ${s.name}`, async ({ page }) => {
      await page.setViewportSize({ width: s.w, height: s.h });
      const resp = await page.goto(r.path);
      if (!resp || resp.status() >= 400) {
        // Phase 0: /recruiter may not exist yet — skip it quietly rather than fail the whole project.
        test.skip(true, `${r.path} not available (status ${resp?.status()})`);
        return;
      }
      // Wait for client-only shell to hydrate (menu bar is a stable signal).
      if (r.path === "/") {
        await page
          .getByRole("menubar", { name: "HamzaOS menu bar" })
          .waitFor({ state: "visible", timeout: 5000 })
          .catch(() => {});
        // Mark boot as seen then reload so the desktop (not boot screen) is captured.
        await page.evaluate(() => {
          try {
            window.localStorage.setItem("hamzaos.boot.seen", "1");
          } catch {
            /* ignore */
          }
        });
        await page.reload();
        await page
          .getByRole("menubar", { name: "HamzaOS menu bar" })
          .waitFor({ state: "visible", timeout: 5000 })
          .catch(() => {});
        await page.waitForTimeout(250);
      }
      await page.screenshot({
        path: path.join("screenshots", `${r.slug}-${s.name}.png`),
        fullPage: true,
      });
    });
  }
}
