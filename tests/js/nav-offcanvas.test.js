/**
 * @file nav-offcanvas.test.js
 * Smoke-тест навигации + offcanvas (ранее реализованный компонент).
 */

import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("Navbar + Offcanvas", () => {
  test("Offcanvas getOrCreate работает", () => {
    document.body.innerHTML = `
      <div class="offcanvas" id="offcanvas"></div>
    `;
    const el = document.getElementById("offcanvas");
    const offcanvas = Rarog.Offcanvas.getOrCreate(el);
    expect(offcanvas).toBeTruthy();
  });
});
