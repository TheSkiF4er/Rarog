import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("Rarog.Modal accessibility", () => {
  test("adds dialog semantics, traps focus, and restores focus", () => {
    document.body.innerHTML = `
      <button type="button" id="openBtn">Open</button>
      <div class="modal" id="testModal" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <h2 class="modal-title">Settings</h2>
            <div class="modal-body">Modal description</div>
            <button type="button" id="firstBtn">Save</button>
            <button type="button" data-rg-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    `;

    const opener = document.getElementById("openBtn");
    const el = document.getElementById("testModal");
    opener.focus();

    const modal = Rarog.Modal.getOrCreate(el);
    modal.show();

    expect(el.getAttribute("role")).toBe("dialog");
    expect(el.getAttribute("aria-modal")).toBe("true");
    expect(el.getAttribute("aria-hidden")).toBe("false");
    expect(el.getAttribute("aria-labelledby")).toBeTruthy();
    expect(el.getAttribute("aria-describedby")).toBeTruthy();
    expect(document.activeElement.id).toBe("firstBtn");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    expect(document.activeElement.getAttribute("data-rg-dismiss")).toBe("modal");

    modal.hide();
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(document.activeElement.id).toBe("openBtn");
  });
});

describe("Rarog.Dropdown accessibility", () => {
  test("wires menu ARIA attributes and supports keyboard open", () => {
    document.body.innerHTML = `
      <div class="dropdown">
        <button type="button" id="ddToggle" data-rg-toggle="dropdown" data-rg-target="#ddMenu">Toggle</button>
        <div class="dropdown-menu" id="ddMenu">
          <button type="button">First</button>
          <button type="button">Second</button>
        </div>
      </div>
    `;

    const toggle = document.getElementById("ddToggle");
    const menu = document.getElementById("ddMenu");
    const dropdown = Rarog.Dropdown.getOrCreate(toggle);

    expect(toggle.getAttribute("aria-haspopup")).toBe("menu");
    expect(toggle.getAttribute("aria-controls")).toBe("ddMenu");
    expect(menu.getAttribute("role")).toBe("menu");
    expect(menu.getAttribute("aria-hidden")).toBe("true");

    toggle.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(menu.getAttribute("aria-hidden")).toBe("false");
    expect(document.activeElement.textContent).toBe("First");

    dropdown.hide();
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("Rarog.Tooltip and Rarog.Popover accessibility", () => {
  test("tooltip creates role=tooltip and aria-describedby", () => {
    document.body.innerHTML = `<button id="tipBtn" data-rg-toggle="tooltip" title="Hello"></button>`;
    const btn = document.getElementById("tipBtn");
    const tooltip = Rarog.Tooltip.getOrCreate(btn);

    tooltip.show();

    const tipEl = document.querySelector(".tooltip");
    expect(tipEl).toBeTruthy();
    expect(tipEl.getAttribute("role")).toBe("tooltip");
    expect(tipEl.getAttribute("aria-hidden")).toBe("false");
    expect(btn.getAttribute("aria-describedby")).toBe(tipEl.id);

    tooltip.hide();
    expect(tipEl.getAttribute("aria-hidden")).toBe("true");
  });

  test("popover creates dialog semantics and links trigger", () => {
    document.body.innerHTML = `<button id="popBtn" data-rg-toggle="popover" data-rg-popover-title="Info" data-rg-popover-content="Body"></button>`;
    const btn = document.getElementById("popBtn");
    const popover = Rarog.Popover.getOrCreate(btn);

    popover.show();

    const popEl = document.querySelector(".popover");
    expect(btn.getAttribute("aria-haspopup")).toBe("dialog");
    expect(btn.getAttribute("aria-expanded")).toBe("true");
    expect(btn.getAttribute("aria-controls")).toBe(popEl.id);
    expect(popEl.getAttribute("role")).toBe("dialog");
    expect(popEl.getAttribute("aria-hidden")).toBe("false");
  });
});
