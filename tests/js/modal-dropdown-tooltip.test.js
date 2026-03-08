/**
 * @file modal-dropdown-tooltip.test.js
 * Базовые behavior-тесты для Modal, Dropdown, Tooltip/Popover.
 */

import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("Rarog.Modal", () => {
  test("getOrCreate кэширует инстанс и управляет классами rg-modal-open", () => {
    document.body.innerHTML = `
      <button type="button" data-rg-toggle="modal" data-rg-target="#testModal"></button>
      <div class="modal" id="testModal" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <button type="button" data-rg-dismiss="modal"></button>
          </div>
        </div>
      </div>
    `;

    const el = document.getElementById("testModal");
    const modalA = Rarog.Modal.getOrCreate(el);
    const modalB = Rarog.Modal.getOrCreate(el);
    expect(modalA).toBe(modalB);

    modalA.show();
    expect(el.classList.contains("rg-modal-open")).toBe(true);

    modalA.hide();
    expect(el.classList.contains("rg-modal-open")).toBe(false);
  });
});

describe("Rarog.Dropdown", () => {
  test("show/hide обновляет состояние меню и aria-атрибуты", () => {
    document.body.innerHTML = `
      <div class="dropdown" id="dd">
        <button type="button" id="dd-toggle" data-rg-toggle="dropdown" data-rg-target="#dd-menu">Toggle</button>
        <div class="dropdown-menu" id="dd-menu" hidden>Menu</div>
      </div>
    `;

    const toggle = document.getElementById("dd-toggle");
    const menu = document.getElementById("dd-menu");
    const dropdown = Rarog.Dropdown.getOrCreate(toggle);

    dropdown.show();
    expect(menu.classList.contains("rg-open")).toBe(true);
    expect(menu.hasAttribute("hidden")).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");

    dropdown.hide();
    expect(menu.classList.contains("rg-open")).toBe(false);
    expect(menu.hasAttribute("hidden")).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("Rarog.Tooltip & Rarog.Popover", () => {
  test("Tooltip создаётся getOrCreate и может быть уничтожен", () => {
    document.body.innerHTML = `<button id="btn" data-rg-toggle="tooltip" title="Hello"></button>`;
    const btn = document.getElementById("btn");
    const tooltip = Rarog.Tooltip.getOrCreate(btn);
    expect(tooltip).toBeDefined();
    tooltip.dispose();
  });

  test("Popover создаётся getOrCreate", () => {
    document.body.innerHTML = `<button id="btn2" data-rg-toggle="popover" data-rg-content="Body"></button>`;
    const btn2 = document.getElementById("btn2");
    const popover = Rarog.Popover.getOrCreate(btn2);
    expect(popover).toBeDefined();
  });
});
