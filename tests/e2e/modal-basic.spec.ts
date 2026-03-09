import { test, expect } from "@playwright/test";

test.describe("Rarog modal & dropdown (demo page)", () => {
  test("modal can be opened and closed", async ({ page }) => {
    await page.goto("/tests/rarog-js-core.test.html");

    const openButton = page.locator("#modalToggle");
    await openButton.click();

    const modal = page.locator("#testModal");
    await expect(modal).toHaveClass(/rg-modal-open/);

    const close = modal.locator("[data-rg-dismiss='modal']");
    await close.click();

    await expect(modal).not.toHaveClass(/rg-modal-open/);
    await expect(modal).toHaveAttribute("aria-hidden", "true");
  });
});
