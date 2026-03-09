import {
  Dropdown,
  Modal,
  Tooltip,
  Popover,
  Carousel,
  Datepicker,
  Rarog,
  dispose as disposeRoot
} from "../../packages/js/src/rarog.esm.js";

describe("destroy/dispose contract", () => {
  test("component instances expose both dispose and destroy aliases", () => {
    document.body.innerHTML = `
      <button id="dd-trigger" data-rg-target="#dd-menu"></button>
      <div id="dd-menu" hidden><button>Item</button></div>
      <div id="modal"><button>Ok</button></div>
      <div id="carousel" class="carousel"><div class="carousel-item is-active"></div></div>
    `;

    const dropdown = Dropdown.getOrCreate(document.getElementById("dd-trigger"));
    const modal = Modal.getOrCreate(document.getElementById("modal"));
    const carousel = Carousel.getOrCreate(document.getElementById("carousel"));

    expect(typeof dropdown.dispose).toBe("function");
    expect(typeof dropdown.destroy).toBe("function");
    expect(typeof modal.dispose).toBe("function");
    expect(typeof modal.destroy).toBe("function");
    expect(typeof carousel.dispose).toBe("function");
    expect(typeof carousel.destroy).toBe("function");
  });

  test("destroy removes instance registration and is idempotent", () => {
    document.body.innerHTML = `
      <button id="dd-trigger" data-rg-target="#dd-menu"></button>
      <div id="dd-menu" hidden><button>Item</button></div>
    `;

    const trigger = document.getElementById("dd-trigger");
    const dropdown = Dropdown.getOrCreate(trigger);
    dropdown.show();
    dropdown.destroy();
    dropdown.destroy();

    expect(Dropdown.getInstance(trigger)).toBe(null);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  test("dispose tears down generated tooltip/popover DOM", () => {
    document.body.innerHTML = `
      <button id="tooltip-trigger" title="Hello"></button>
      <button id="popover-trigger" data-rg-popover-content="World"></button>
    `;

    const tooltipTrigger = document.getElementById("tooltip-trigger");
    const popoverTrigger = document.getElementById("popover-trigger");

    const tooltip = Tooltip.getOrCreate(tooltipTrigger);
    const popover = Popover.getOrCreate(popoverTrigger);

    tooltip.show();
    popover.show();

    expect(document.querySelector(".tooltip")).not.toBe(null);
    expect(document.querySelector(".popover")).not.toBe(null);

    tooltip.dispose();
    popover.dispose();

    expect(Tooltip.getInstance(tooltipTrigger)).toBe(null);
    expect(Popover.getInstance(popoverTrigger)).toBe(null);
    expect(document.querySelector(".tooltip")).toBe(null);
    expect(document.querySelector(".popover")).toBe(null);
  });

  test("Rarog.dispose(root) destroys registered instances inside subtree", () => {
    document.body.innerHTML = `
      <section id="root">
        <button id="dd-trigger" data-rg-toggle="dropdown" data-rg-target="#dd-menu"></button>
        <div id="dd-menu" hidden><button>Item</button></div>
        <div id="calendar" data-rg-datepicker><input type="text"></div>
      </section>
    `;

    const root = document.getElementById("root");
    const trigger = document.getElementById("dd-trigger");
    const calendar = document.getElementById("calendar");

    Dropdown.getOrCreate(trigger).show();
    Datepicker.getOrCreate(calendar).show();

    Rarog.dispose(root);

    expect(Dropdown.getInstance(trigger)).toBe(null);
    expect(Datepicker.getInstance(calendar)).toBe(null);
  });

  test("root dispose alias matches named dispose export", () => {
    expect(Rarog.dispose).toBe(disposeRoot);
  });
});
