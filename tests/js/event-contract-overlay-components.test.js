/**
 * @file event-contract-overlay-components.test.js
 * Контрактные тесты для Toast / Tooltip / Popover / Collapse.
 */

import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("Overlay/interaction event contract", () => {
  test("Collapse emits show/shown/hide/hidden in order", () => {
    document.body.innerHTML = `
      <button id="toggle" data-rg-target="#panel"></button>
      <div id="panel" class="collapse" hidden></div>
    `;

    const trigger = document.getElementById("toggle");
    const panel = document.getElementById("panel");
    const collapse = Rarog.Collapse.getOrCreate(trigger, panel);
    const seen = [];

    ["show", "shown", "hide", "hidden"].forEach(name => {
      panel.addEventListener(`rg:collapse:${name}`, () => seen.push(name));
    });

    collapse.show();
    collapse.hide();

    expect(seen).toEqual(["show", "shown", "hide", "hidden"]);
  });

  test("Collapse show can be cancelled", () => {
    document.body.innerHTML = `
      <button id="toggle" data-rg-target="#panel"></button>
      <div id="panel" class="collapse" hidden></div>
    `;

    const trigger = document.getElementById("toggle");
    const panel = document.getElementById("panel");
    const collapse = Rarog.Collapse.getOrCreate(trigger, panel);

    panel.addEventListener("rg:collapse:show", event => event.preventDefault());

    const result = collapse.show();

    expect(result).toBe(false);
    expect(panel.hasAttribute("hidden")).toBe(true);
  });

  test("Toast emits stable lifecycle and detail payload", () => {
    document.body.innerHTML = `<div id="toast" class="toast" hidden></div>`;
    const toastEl = document.getElementById("toast");
    const toast = Rarog.Toast.getOrCreate(toastEl, { autohide: false });
    const payloads = [];

    toastEl.addEventListener("rg:toast:show", event => payloads.push(event.detail));
    toastEl.addEventListener("rg:toast:shown", event => payloads.push(event.detail));

    toast.show();

    expect(payloads).toHaveLength(2);
    expect(payloads[0].instance).toBe(toast);
    expect(payloads[0].target).toBe(toastEl);
    expect(payloads[1].target).toBe(toastEl);
  });

  test("Tooltip emits show/shown/hide/hidden and exposes placement", () => {
    document.body.innerHTML = `<button id="trigger" title="Help"></button>`;
    const trigger = document.getElementById("trigger");
    const tooltip = Rarog.Tooltip.getOrCreate(trigger, { placement: "bottom" });
    const seen = [];

    trigger.addEventListener("rg:tooltip:show", event => seen.push(`${event.type}:${event.detail.placement}`));
    trigger.addEventListener("rg:tooltip:shown", event => seen.push(`${event.type}:${event.detail.placement}`));
    trigger.addEventListener("rg:tooltip:hidden", event => seen.push(`${event.type}:${event.detail.placement}`));

    tooltip.show();
    tooltip.hide();

    expect(seen).toEqual([
      "rg:tooltip:show:bottom",
      "rg:tooltip:shown:bottom",
      "rg:tooltip:hidden:bottom"
    ]);
  });

  test("Popover hide can be cancelled", () => {
    document.body.innerHTML = `<button id="trigger" data-rg-popover-content="Body"></button>`;
    const trigger = document.getElementById("trigger");
    const popover = Rarog.Popover.getOrCreate(trigger, { placement: "right" });

    trigger.addEventListener("rg:popover:hide", event => event.preventDefault());

    popover.show();
    const result = popover.hide();

    expect(result).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });
});
