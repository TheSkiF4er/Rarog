import { test, expect } from "@playwright/test";

test.describe("Rarog modal & dropdown (demo page)", () => {
  test("modal can be opened and closed", async ({ page }) => {
    await page.goto("/tests/rarog-js-core.test.html");

    const openButton = page.getByRole("button", { name: /открыть модалку/i });
    await openButton.click();

    const modal = page.locator(".modal.show");
    await expect(modal).toBeVisible();

    await page.screenshot({ path: "tests/e2e-snapshots/modal-open.png", fullPage: false });

    const close = modal.getByRole("button", { name: /закрыть/i });
    await close.click();

    await expect(modal).toBeHidden();
  });
});
