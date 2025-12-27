import { test, expect } from "@playwright/test";

test.describe("Rarog carousel & stepper (demo page)", () => {
  test("carousel switches slides", async ({ page }) => {
    await page.goto("/tests/rarog-js-core.test.html");

    const next = page.locator("[data-rg-target='#demoCarousel'][data-rg-slide='next'], .carousel-control-next").first();
    await next.click();
    await page.waitForTimeout(200);

    await expect(page.locator(".carousel-item.active")).toBeVisible();
  });

  test("stepper goes to next step", async ({ page }) => {
    await page.goto("/tests/rarog-js-core.test.html");

    const next = page.locator("[data-rg-step-to='next']").first();
    await next.click();

    await expect(page.locator(".stepper-step.is-active")).toBeVisible();
  });
});
