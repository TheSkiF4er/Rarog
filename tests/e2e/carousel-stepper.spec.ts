import { test, expect } from "@playwright/test";

test.describe("Rarog stepper (demo page)", () => {
  test("stepper goes to next step", async ({ page }) => {
    await page.goto("/tests/rarog-js-core.test.html");

    const next = page.locator("[data-rg-step-to='next']").first();
    await next.click();

    await expect(page.locator("#demoStepper .stepper-step.is-active").nth(1)).toBeVisible();
    await expect(page.locator("#demoStepper .stepper-content.is-active").nth(0)).toContainText("Step 2 content");
  });
});
