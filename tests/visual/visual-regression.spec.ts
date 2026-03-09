import { test, expect } from "@playwright/test";

const pages = [
  { path: "/tests/visual/fixtures/overlays.html", name: "overlays" },
  { path: "/tests/visual/fixtures/forms.html", name: "forms" },
  { path: "/tests/visual/fixtures/data-layout.html", name: "data-layout" }
];

for (const pageDef of pages) {
  test(`${pageDef.name} visual baseline`, async ({ page }) => {
    await page.goto(pageDef.path);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addStyleTag({
      content: "*{animation:none !important;transition:none !important;scroll-behavior:auto !important;}"
    });
    await expect(page).toHaveScreenshot(`${pageDef.name}.png`, {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.01
    });
  });
}
