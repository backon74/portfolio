import { test, expect } from "@playwright/test";

test.describe("widgets (desktop)", () => {
  // Block external data so the ControlDeck shows its offline/loading states.
  test.beforeEach(async ({ context }) => {
    await context.route("**/api/github", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "offline" }),
      }),
    );
    await context.route("**/api/weather", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "offline" }),
      }),
    );
    await context.route("**/api/song", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          title: "Workin' Day and Night",
          artist: "Michael Jackson",
          artworkUrl: null,
          previewUrl: null,
          trackUrl: null,
        }),
      }),
    );
  });

  test("ControlDeck renders with no uncaught errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto("/");
    const deck = page.getByLabel("Widgets", { exact: true });
    await expect(deck).toBeVisible();

    // Profile section is a button that opens the Hamza app.
    await expect(page.getByRole("button", { name: "Open Hamza app" })).toBeVisible();

    // Deck has mono labels for every section.
    await expect(deck.getByText("OPERATOR")).toBeVisible();
    await expect(deck.getByText("NOW PLAYING")).toBeVisible();
    await expect(deck.getByText("GIT · ACTIVITY")).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("profile section opens the Hamza app on click", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open Hamza app" }).click();
    await expect(page.locator('[data-window][data-app="hamza"]')).toBeVisible();
  });

  test("no layout shift: ControlDeck has stable bounding box", async ({ page }) => {
    await page.goto("/");
    const col = page.getByLabel("Widgets", { exact: true });
    const b1 = await col.boundingBox();
    await page.waitForTimeout(400);
    const b2 = await col.boundingBox();
    expect(b1).not.toBeNull();
    expect(b2).not.toBeNull();
    expect(Math.round(b1!.width)).toBe(Math.round(b2!.width));
    expect(Math.round(b1!.height)).toBe(Math.round(b2!.height));
  });
});
