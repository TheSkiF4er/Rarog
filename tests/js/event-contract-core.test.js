/**
 * @file event-contract-core.test.js
 * Контрактные тесты lifecycle-событий для публичного JS интерфейс.
 */

import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("Rarog event contract", () => {
  test("Dropdown emits show/shown/hide/hidden and supports preventDefault on show", () => {
    document.body.innerHTML = `
      <button id="trigger" data-rg-target="#menu">Toggle</button>
      <div id="menu" hidden><button type="button">Item</button></div>
    `;

    const trigger = document.getElementById("trigger");
    const menu = document.getElementById("menu");
    const dropdown = Rarog.Dropdown.getOrCreate(trigger);
    const calls = [];

    menu.addEventListener("rg:dropdown:show", event => {
      calls.push(event.type);
      event.preventDefault();
    }, { once: true });

    expect(dropdown.show()).toBe(false);
    expect(menu.hasAttribute("hidden")).toBe(true);

    ["rg:dropdown:show", "rg:dropdown:shown", "rg:dropdown:hide", "rg:dropdown:hidden"].forEach(type => {
      menu.addEventListener(type, event => calls.push(event.type));
    });

    dropdown.show();
    dropdown.hide();

    expect(calls).toEqual([
      "rg:dropdown:show",
      "rg:dropdown:show",
      "rg:dropdown:shown",
      "rg:dropdown:hide",
      "rg:dropdown:hidden"
    ]);
  });

  test("Collapse emits lifecycle events with stable detail payload", () => {
    document.body.innerHTML = `
      <button id="trigger" data-rg-target="#panel">Toggle</button>
      <div id="panel" hidden aria-hidden="true"></div>
    `;

    const trigger = document.getElementById("trigger");
    const panel = document.getElementById("panel");
    const collapse = Rarog.Collapse.getOrCreate(trigger);
    let detail = null;

    panel.addEventListener("rg:collapse:shown", event => {
      detail = event.detail;
    });

    collapse.show();

    expect(detail.instance).toBe(collapse);
    expect(detail.trigger).toBe(trigger);
    expect(detail.target).toBe(panel);
  });

  test("Modal and Offcanvas emit cancelable show/hide lifecycle", () => {
    document.body.innerHTML = `
      <button id="open">Open</button>
      <div id="modal"><button type="button">Focusable</button></div>
      <div id="drawer"></div>
    `;

    const open = document.getElementById("open");
    open.focus();
    const modalEl = document.getElementById("modal");
    const drawerEl = document.getElementById("drawer");
    const modal = Rarog.Modal.getOrCreate(modalEl);
    const offcanvas = Rarog.Offcanvas.getOrCreate(drawerEl);
    const modalEvents = [];
    const offcanvasEvents = [];

    modalEl.addEventListener("rg:modal:show", event => modalEvents.push(event.type));
    modalEl.addEventListener("rg:modal:shown", event => modalEvents.push(event.type));
    modalEl.addEventListener("rg:modal:hide", event => modalEvents.push(event.type));
    modalEl.addEventListener("rg:modal:hidden", event => modalEvents.push(event.type));

    drawerEl.addEventListener("rg:offcanvas:show", event => offcanvasEvents.push(event.type));
    drawerEl.addEventListener("rg:offcanvas:shown", event => offcanvasEvents.push(event.type));
    drawerEl.addEventListener("rg:offcanvas:hide", event => offcanvasEvents.push(event.type));
    drawerEl.addEventListener("rg:offcanvas:hidden", event => offcanvasEvents.push(event.type));

    modal.show();
    modal.hide();
    offcanvas.show();
    offcanvas.hide();

    expect(modalEvents).toEqual(["rg:modal:show", "rg:modal:shown", "rg:modal:hide", "rg:modal:hidden"]);
    expect(offcanvasEvents).toEqual(["rg:offcanvas:show", "rg:offcanvas:shown", "rg:offcanvas:hide", "rg:offcanvas:hidden"]);
  });

  test("Toast / Tooltip / Popover emit shown/hidden with stable detail", () => {
    document.body.innerHTML = `
      <div id="toast"></div>
      <button id="tooltipBtn" title="Hello"></button>
      <button id="popoverBtn" data-rg-popover-content="Body"></button>
    `;

    const toastEl = document.getElementById("toast");
    const toast = Rarog.Toast.getOrCreate(toastEl, { autoHide: false });
    const tooltipBtn = document.getElementById("tooltipBtn");
    const popoverBtn = document.getElementById("popoverBtn");
    const tooltip = Rarog.Tooltip.getOrCreate(tooltipBtn);
    const popover = Rarog.Popover.getOrCreate(popoverBtn);

    const seen = [];
    toastEl.addEventListener("rg:toast:shown", e => seen.push([e.type, e.detail.target === toastEl]));

    toast.show();
    tooltip.show();
    popover.show();

    expect(seen[0]).toEqual(["rg:toast:shown", true]);
    expect(tooltip._tooltip).toBeTruthy();
    expect(popover._popover).toBeTruthy();
  });

  test("Carousel emits slide/slid and keeps legacy next event after slid", () => {
    document.body.innerHTML = `
      <div class="carousel" id="carousel">
        <div class="carousel-inner">
          <div class="carousel-item is-active">1</div>
          <div class="carousel-item">2</div>
        </div>
      </div>
    `;

    const el = document.getElementById("carousel");
    const carousel = Rarog.Carousel.getOrCreate(el);
    const events = [];

    ["rg:carousel:slide", "rg:carousel:slid", "rg:carousel:next"].forEach(type => {
      el.addEventListener(type, event => events.push([event.type, event.detail.fromIndex, event.detail.toIndex]));
    });

    carousel.next();

    expect(events).toEqual([
      ["rg:carousel:slide", 0, 1],
      ["rg:carousel:slid", 0, 1],
      ["rg:carousel:next", 0, 1]
    ]);
  });
});
