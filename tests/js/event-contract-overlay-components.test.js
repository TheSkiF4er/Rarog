import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("overlay component event contract", () => {
  test("Collapse emits cancelable show/hide and post events with detail", () => {
    document.body.innerHTML = `
      <button id="trigger" data-rg-target="#panel">Toggle</button>
      <div id="panel" hidden aria-hidden="true">Body</div>
    `;

    const trigger = document.getElementById("trigger");
    const panel = document.getElementById("panel");
    const collapse = Rarog.Collapse.getOrCreate(trigger);
    const order = [];

    ["rg:collapse:show", "rg:collapse:shown", "rg:collapse:hide", "rg:collapse:hidden"].forEach(type => {
      panel.addEventListener(type, e => {
        order.push(type);
        expect(e.detail.instance).toBe(collapse);
        expect(e.detail.trigger).toBe(trigger);
        expect(e.detail.target).toBe(panel);
      });
    });

    collapse.show();
    expect(panel.hasAttribute("hidden")).toBe(false);
    collapse.hide();
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    expect(order).toEqual([
      "rg:collapse:show",
      "rg:collapse:shown",
      "rg:collapse:hide",
      "rg:collapse:hidden"
    ]);
  });

  test("Toast show can be canceled and shown/hidden fire after DOM changes", () => {
    document.body.innerHTML = `<div id="toast" class="toast"></div>`;
    const el = document.getElementById("toast");
    const toast = Rarog.Toast.getOrCreate(el, { autoHide: false });
    const order = [];

    el.addEventListener(
      "rg:toast:show",
      e => {
        order.push(e.type);
        e.preventDefault();
      },
      { once: true }
    );

    toast.show();
    expect(el.classList.contains("is-visible")).toBe(false);

    el.addEventListener("rg:toast:show", e => order.push(e.type), { once: true });
    el.addEventListener(
      "rg:toast:shown",
      e => {
        order.push(e.type);
        expect(el.classList.contains("is-visible")).toBe(true);
        expect(e.detail.target).toBe(el);
      },
      { once: true }
    );
    el.addEventListener(
      "rg:toast:hidden",
      e => {
        order.push(e.type);
        expect(el.classList.contains("is-visible")).toBe(false);
        expect(e.detail.target).toBe(el);
      },
      { once: true }
    );

    toast.show();
    toast.hide();

    expect(order).toEqual(["rg:toast:show", "rg:toast:show", "rg:toast:shown", "rg:toast:hidden"]);
  });

  test("Tooltip emits full lifecycle with trigger/target/placement detail and cancelable hide", () => {
    document.body.innerHTML = `<button id="btn" title="Hello" data-rg-placement="bottom"></button>`;
    const btn = document.getElementById("btn");
    const tooltip = Rarog.Tooltip.getOrCreate(btn);
    const seen = [];

    tooltip.show();
    const tip = document.querySelector(".tooltip");
    expect(tip).toBeTruthy();

    tip.addEventListener(
      "rg:tooltip:hide",
      e => {
        seen.push(e.type);
        expect(e.detail.trigger).toBe(btn);
        expect(e.detail.target).toBe(tip);
        expect(e.detail.placement).toBe("bottom");
        e.preventDefault();
      },
      { once: true }
    );

    tooltip.hide();
    expect(tip.classList.contains("is-visible")).toBe(true);

    tip.addEventListener(
      "rg:tooltip:hidden",
      e => {
        seen.push(e.type);
        expect(e.detail.trigger).toBe(btn);
        expect(e.detail.target).toBe(tip);
        expect(e.detail.placement).toBe("bottom");
      },
      { once: true }
    );
    tip.addEventListener("rg:tooltip:hide", () => seen.push("rg:tooltip:hide"), { once: true });

    tooltip.hide();
    expect(seen).toEqual(["rg:tooltip:hide", "rg:tooltip:hide", "rg:tooltip:hidden"]);
  });

  test("Popover emits cancelable show/hide with shown/hidden", () => {
    document.body.innerHTML = `<button id="btn" data-rg-popover-title="Title" data-rg-popover-content="Body"></button>`;
    const btn = document.getElementById("btn");
    const popover = Rarog.Popover.getOrCreate(btn);
    const log = [];

    btn.addEventListener("click", () => log.push("click"), { once: true });
    popover.show();
    const pop = document.querySelector(".popover");
    expect(pop).toBeTruthy();

    pop.addEventListener(
      "rg:popover:hide",
      e => {
        log.push(e.type);
        expect(e.detail.trigger).toBe(btn);
        expect(e.detail.target).toBe(pop);
        expect(e.detail.placement).toBe("top");
        e.preventDefault();
      },
      { once: true }
    );

    popover.hide();
    expect(pop.classList.contains("is-visible")).toBe(true);

    pop.addEventListener("rg:popover:hidden", () => log.push("rg:popover:hidden"), { once: true });
    pop.addEventListener("rg:popover:hide", () => log.push("rg:popover:hide"), { once: true });
    popover.hide();

    expect(log).toEqual(["rg:popover:hide", "rg:popover:hide", "rg:popover:hidden"]);
  });
});
