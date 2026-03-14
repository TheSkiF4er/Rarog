import { Rarog } from "../../packages/js/src/rarog.esm.js";

function collectEvents(target, names) {
  const calls = [];
  const handlers = names.map(name => {
    const handler = event => {
      calls.push({ name, detail: event.detail, target: event.target });
    };
    target.addEventListener(name, handler);
    return { name, handler };
  });

  return {
    calls,
    stop() {
      handlers.forEach(({ name, handler }) => target.removeEventListener(name, handler));
    }
  };
}

describe("JS Core contract sweep", () => {
  test("public namespace exports the full stable constructor surface", () => {
    expect(Rarog.Dropdown).toBeTypeOf("function");
    expect(Rarog.Collapse).toBeTypeOf("function");
    expect(Rarog.Modal).toBeTypeOf("function");
    expect(Rarog.Offcanvas).toBeTypeOf("function");
    expect(Rarog.Toast).toBeTypeOf("function");
    expect(Rarog.Tooltip).toBeTypeOf("function");
    expect(Rarog.Popover).toBeTypeOf("function");
    expect(Rarog.Carousel).toBeTypeOf("function");
    expect(Rarog.Stepper).toBeTypeOf("function");
    expect(Rarog.Datepicker).toBeTypeOf("function");
    expect(Rarog.DatetimePicker).toBeTypeOf("function");
    expect(Rarog.Select).toBeTypeOf("function");
    expect(Rarog.Combobox).toBeTypeOf("function");
    expect(Rarog.TagsInput).toBeTypeOf("function");
    expect(Rarog.DataTable).toBeTypeOf("function");
    expect(Rarog.InputMask).toBeTypeOf("object");
    expect(Rarog.init).toBeTypeOf("function");
    expect(Rarog.dispose).toBeTypeOf("function");
    expect(Rarog.reinit).toBeTypeOf("function");
  });

  test("dropdown contract: cache, aria state, open-close lifecycle", () => {
    document.body.innerHTML = `
      <button type="button" id="dd-trigger" data-rg-toggle="dropdown" data-rg-target="#dd-menu">Toggle</button>
      <div id="dd-menu" class="dropdown-menu" hidden>
        <button type="button">One</button>
      </div>
    `;

    const trigger = document.getElementById("dd-trigger");
    const menu = document.getElementById("dd-menu");
    const a = Rarog.Dropdown.getOrCreate(trigger);
    const b = Rarog.Dropdown.getOrCreate(trigger);

    expect(a).toBe(b);
    expect(Rarog.Dropdown.getInstance(trigger)).toBe(a);

    a.show();
    expect(menu.classList.contains("rg-open")).toBe(true);
    expect(menu.hasAttribute("hidden")).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    a.hide();
    expect(menu.classList.contains("rg-open")).toBe(false);
    expect(menu.hasAttribute("hidden")).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  test("collapse contract: cache, aria state, toggle/show/hide", () => {
    document.body.innerHTML = `
      <button type="button" id="collapse-trigger" data-rg-target="#collapse-target">Toggle</button>
      <div id="collapse-target" hidden aria-hidden="true">Body</div>
    `;

    const trigger = document.getElementById("collapse-trigger");
    const target = document.getElementById("collapse-target");
    const collapse = Rarog.Collapse.getOrCreate(trigger);

    collapse.show();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(target.getAttribute("aria-hidden")).toBe("false");
    expect(target.hasAttribute("hidden")).toBe(false);

    collapse.toggle();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(target.getAttribute("aria-hidden")).toBe("true");
    expect(target.hasAttribute("hidden")).toBe(true);
  });

  test("modal contract: cache, focus, visibility state", () => {
    document.body.innerHTML = `
      <button type="button" id="before">Open</button>
      <div class="modal" id="modal" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <button type="button" id="inside">Inside</button>
            <button type="button" data-rg-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    `;

    const modalEl = document.getElementById("modal");
    const before = document.getElementById("before");
    const inside = document.getElementById("inside");
    before.focus();

    const modal = Rarog.Modal.getOrCreate(modalEl);
    expect(Rarog.Modal.getInstance(modalEl)).toBe(modal);

    modal.show();
    expect(modalEl.classList.contains("rg-modal-open")).toBe(true);
    expect(modalEl.getAttribute("aria-hidden")).toBe(null);
    expect(document.body.getAttribute("data-rg-scroll-locked")).toBe("true");
    expect(document.activeElement === inside || document.activeElement === modalEl).toBe(true);

    modal.hide();
    expect(modalEl.classList.contains("rg-modal-open")).toBe(false);
    expect(modalEl.getAttribute("aria-hidden")).toBe("true");
    expect(document.body.getAttribute("data-rg-scroll-locked")).toBe(null);
    expect(document.activeElement).toBe(before);
  });

  test("offcanvas contract: event emission, body lock, backdrop lifecycle", () => {
    document.body.innerHTML = `<div id="drawer" class="offcanvas" aria-hidden="true"></div>`;

    const el = document.getElementById("drawer");
    const events = collectEvents(el, ["rg:offcanvas:show", "rg:offcanvas:hide"]);
    const offcanvas = Rarog.Offcanvas.getOrCreate(el);

    offcanvas.show();
    expect(el.classList.contains("is-open")).toBe(true);
    expect(document.body.classList.contains("rg-offcanvas-open")).toBe(true);
    expect(document.querySelector(".offcanvas-backdrop")).not.toBeNull();

    offcanvas.hide();
    expect(el.classList.contains("is-open")).toBe(false);
    expect(document.body.classList.contains("rg-offcanvas-open")).toBe(false);
    expect(events.calls.map(call => call.name)).toEqual(["rg:offcanvas:show", "rg:offcanvas:hide"]);
    events.stop();
  });

  test("toast contract: show/hide classes and custom events", () => {
    document.body.innerHTML = `<div id="toast" class="toast" aria-hidden="true"></div>`;

    const el = document.getElementById("toast");
    const events = collectEvents(el, ["rg:toast:show", "rg:toast:hide"]);
    const toast = Rarog.Toast.getOrCreate(el, { autohide: false });

    toast.show();
    expect(el.classList.contains("is-visible")).toBe(true);

    toast.hide();
    expect(el.classList.contains("is-visible")).toBe(false);
    expect(events.calls.map(call => call.name)).toEqual(["rg:toast:show", "rg:toast:hide"]);
    events.stop();
  });

  test("tooltip and popover contract: overlay node creation, lifecycle events, dispose", () => {
    document.body.innerHTML = `
      <button id="tooltip-btn" data-rg-toggle="tooltip" title="Hint">Tooltip</button>
      <button id="popover-btn" data-rg-toggle="popover" data-rg-title="Title" data-rg-content="Body">Popover</button>
    `;

    const tooltipBtn = document.getElementById("tooltip-btn");
    const popoverBtn = document.getElementById("popover-btn");
    const tooltip = Rarog.Tooltip.getOrCreate(tooltipBtn);
    const popover = Rarog.Popover.getOrCreate(popoverBtn);

    const tooltipEvents = collectEvents(document, ["rg:tooltip:show", "rg:tooltip:hide"]);
    const popoverEvents = collectEvents(document, ["rg:popover:show", "rg:popover:hide"]);

    tooltip.show();
    const tooltipNode = document.querySelector(".tooltip");
    expect(tooltipNode).not.toBeNull();

    tooltip.hide();
    tooltip.dispose();
    expect(document.querySelector(".tooltip")).toBeNull();

    popover.show();
    const popoverNode = document.querySelector(".popover");
    expect(popoverNode).not.toBeNull();

    popover.hide();
    popover.dispose();
    expect(document.querySelector(".popover")).toBeNull();

    expect(tooltipEvents.calls.map(call => call.name)).toEqual(["rg:tooltip:show", "rg:tooltip:hide"]);
    expect(popoverEvents.calls.map(call => call.name)).toEqual(["rg:popover:show", "rg:popover:hide"]);
    tooltipEvents.stop();
    popoverEvents.stop();
  });

  test("carousel contract: next/prev/goto and indicator state", () => {
    document.body.innerHTML = `
      <div id="carousel" class="carousel">
        <div class="carousel-inner">
          <div class="carousel-item is-active">One</div>
          <div class="carousel-item">Two</div>
          <div class="carousel-item">Three</div>
        </div>
        <button data-rg-target="#carousel" data-rg-slide-to="0"></button>
        <button data-rg-target="#carousel" data-rg-slide-to="1"></button>
        <button data-rg-target="#carousel" data-rg-slide-to="2"></button>
      </div>
    `;

    const el = document.getElementById("carousel");
    const events = collectEvents(el, ["rg:carousel:next", "rg:carousel:prev", "rg:carousel:goto"]);
    const carousel = Rarog.Carousel.getOrCreate(el, { autoplay: false });

    carousel.next();
    expect(el.querySelectorAll(".carousel-item")[1].classList.contains("is-active")).toBe(true);

    carousel.prev();
    expect(el.querySelectorAll(".carousel-item")[0].classList.contains("is-active")).toBe(true);

    carousel.goTo(2);
    expect(el.querySelectorAll(".carousel-item")[2].classList.contains("is-active")).toBe(true);
    expect(events.calls.map(call => call.name)).toEqual([
      "rg:carousel:next",
      "rg:carousel:prev",
      "rg:carousel:goto"
    ]);
    carousel.destroy();
    events.stop();
  });

  test("stepper contract: next/prev/goto/reset update active step/content", () => {
    document.body.innerHTML = `
      <div id="stepper" class="stepper">
        <div class="stepper-step is-active">Step 1</div>
        <div class="stepper-step">Step 2</div>
        <div class="stepper-step">Step 3</div>
        <div class="stepper-content is-active">Content 1</div>
        <div class="stepper-content" hidden aria-hidden="true">Content 2</div>
        <div class="stepper-content" hidden aria-hidden="true">Content 3</div>
      </div>
    `;

    const el = document.getElementById("stepper");
    const events = collectEvents(el, [
      "rg:stepper:next",
      "rg:stepper:prev",
      "rg:stepper:goto",
      "rg:stepper:reset"
    ]);
    const stepper = Rarog.Stepper.getOrCreate(el);

    stepper.next();
    expect(el.querySelectorAll(".stepper-step")[1].classList.contains("is-active")).toBe(true);

    stepper.prev();
    expect(el.querySelectorAll(".stepper-step")[0].classList.contains("is-active")).toBe(true);

    stepper.goTo(2);
    expect(el.querySelectorAll(".stepper-step")[2].classList.contains("is-active")).toBe(true);

    stepper.reset();
    expect(el.querySelectorAll(".stepper-step")[0].classList.contains("is-active")).toBe(true);
    expect(events.calls.map(call => call.name)).toEqual([
      "rg:stepper:next",
      "rg:stepper:prev",
      "rg:stepper:goto",
      "rg:stepper:reset"
    ]);
    stepper.destroy();
    events.stop();
  });

  test("datepicker and datetime picker contract: cache and value sync", () => {
    document.body.innerHTML = `
      <div id="datepicker" data-rg-datepicker>
        <input type="date" id="date-input" />
        <div class="rg-datepicker-popup">
          <button type="button" class="rg-datepicker-day" data-rg-date="2025-01-15">15</button>
        </div>
      </div>
      <div id="datetime" data-rg-datetime-picker>
        <input type="datetime-local" id="datetime-input" />
        <div class="rg-datepicker-popup">
          <button type="button" class="rg-datepicker-day" data-rg-date="2025-01-16">16</button>
        </div>
      </div>
    `;

    const dpRoot = document.getElementById("datepicker");
    const dtRoot = document.getElementById("datetime");
    const datepicker = Rarog.Datepicker.getOrCreate(dpRoot);
    const datetimePicker = Rarog.DatetimePicker.getOrCreate(dtRoot);

    dpRoot.querySelector("[data-rg-date='2025-01-15']").click();
    dtRoot.querySelector("[data-rg-date='2025-01-16']").click();

    expect(document.getElementById("date-input").value).toBe("2025-01-15");
    expect(Rarog.Datepicker.getInstance(dpRoot)).toBe(datepicker);
    expect(Rarog.DatetimePicker.getInstance(dtRoot)).toBe(datetimePicker);
  });

  test("select and combobox contract: value sync and emitted change/open-close events", () => {
    document.body.innerHTML = `
      <div id="select" data-rg-select>
        <button type="button" data-rg-select-toggle><span class="rg-select-label"></span></button>
        <div data-rg-select-menu hidden>
          <button type="button" data-rg-value="basic">Basic</button>
          <button type="button" data-rg-value="pro">Pro</button>
        </div>
        <input type="hidden" id="select-hidden" />
      </div>
      <div id="combobox" data-rg-combobox>
        <input type="text" class="rg-combobox-input" />
        <button type="button" class="rg-combobox-toggle">Toggle</button>
        <div class="rg-combobox-list" hidden>
          <button type="button" data-rg-value="alpha">Alpha</button>
          <button type="button" data-rg-value="beta">Предварительное</button>
        </div>
        <input type="hidden" id="combobox-hidden" />
      </div>
    `;

    const selectRoot = document.getElementById("select");
    const comboboxRoot = document.getElementById("combobox");
    const selectEvents = collectEvents(selectRoot, ["rg:select:change"]);
    const comboboxEvents = collectEvents(comboboxRoot, [
      "rg:combobox:open",
      "rg:combobox:close",
      "rg:combobox:change"
    ]);

    const select = Rarog.Select.getOrCreate(selectRoot);
    const combobox = Rarog.Combobox.getOrCreate(comboboxRoot);

    select.show();
    selectRoot.querySelector("[data-rg-value='pro']").click();
    expect(document.getElementById("select-hidden").value).toBe("pro");

    combobox.show();
    comboboxRoot.querySelector(".rg-combobox-input").value = "be";
    comboboxRoot.querySelector(".rg-combobox-input").dispatchEvent(new Event("input", { bubbles: true }));
    comboboxRoot.querySelector("[data-rg-value='beta']").click();
    expect(document.getElementById("combobox-hidden").value).toBe("beta");

    expect(selectEvents.calls.map(call => call.name)).toEqual(["rg:select:change"]);
    expect(comboboxEvents.calls.map(call => call.name)).toContain("rg:combobox:open");
    expect(comboboxEvents.calls.map(call => call.name)).toContain("rg:combobox:change");

    select.dispose();
    combobox.dispose();
    selectEvents.stop();
    comboboxEvents.stop();
  });

  test("tags input contract: add/remove/clear syncs hidden input", () => {
    document.body.innerHTML = `
      <div id="tags" data-rg-tags-input>
        <div class="rg-tags"></div>
        <input class="rg-tags-input-input" />
        <input type="hidden" id="tags-hidden" />
      </div>
    `;

    const root = document.getElementById("tags");
    const events = collectEvents(root, ["rg:tags-input:change"]);
    const tags = Rarog.TagsInput.getOrCreate(root);

    tags.addTag("alpha");
    tags.addTag("beta");
    expect(document.getElementById("tags-hidden").value).toBe("alpha,beta");

    tags.removeTag("alpha");
    expect(document.getElementById("tags-hidden").value).toBe("beta");

    tags.clear();
    expect(document.getElementById("tags-hidden").value).toBe("");
    expect(events.calls.length).toBeGreaterThanOrEqual(2);
    tags.dispose();
    events.stop();
  });

  test("data table contract: search, sort and pagination trigger update events", () => {
    document.body.innerHTML = `
      <div id="table-wrap" data-rg-table data-rg-page-size="2">
        <input type="search" data-rg-table-search />
        <table>
          <thead>
            <tr>
              <th data-rg-sort="name">Name</th>
              <th data-rg-sort="score" data-rg-sort-type="number">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Charlie</td><td>30</td></tr>
            <tr><td>Alice</td><td>10</td></tr>
            <tr><td>Bob</td><td>20</td></tr>
          </tbody>
        </table>
        <div class="rg-table-pagination"></div>
      </div>
    `;

    const root = document.getElementById("table-wrap");
    const table = root.querySelector("table");
    const events = collectEvents(root, ["rg:table:update"]);
    const dataTable = Rarog.DataTable.getOrCreate(root);

    root.querySelector("[data-rg-table-search]").value = "bob";
    root.querySelector("[data-rg-table-search]").dispatchEvent(new Event("input", { bubbles: true }));
    expect(table.tBodies[0].rows.length).toBe(1);

    root.querySelector("[data-rg-table-search]").value = "";
    root.querySelector("[data-rg-table-search]").dispatchEvent(new Event("input", { bubbles: true }));
    table.querySelector("th[data-rg-sort='score']").click();
    expect(table.tBodies[0].rows[0].cells[1].textContent.trim()).toBe("10");

    const pageTwo = root.querySelector("[data-rg-page='2']");
    if (pageTwo) {
      pageTwo.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      expect(table.tBodies[0].rows.length).toBeGreaterThan(0);
    }

    expect(events.calls.length).toBeGreaterThanOrEqual(3);
    dataTable.dispose();
    events.stop();
  });

  test("input mask contract: custom handler formats value on input", () => {
    document.body.innerHTML = `<input id="mask" data-rg-mask="demo" />`;

    Rarog.InputMask.register("demo", value => String(value || "").replace(/\D+/g, "").slice(0, 3));

    const input = document.getElementById("mask");
    Rarog.InputMask.apply(input);
    input.value = "ab12cd345";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(input.value).toBe("123");
  });
});
