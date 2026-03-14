import { Rarog } from "../../packages/js/src/rarog.esm.js";

function listenOnce(element, type) {
  const calls = [];
  element.addEventListener(type, event => calls.push(event));
  return calls;
}

describe("JS core component contracts", () => {
  test("namespace exposes all public constructors and core helpers", () => {
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

  test("Dropdown caches instance and updates menu visibility contract", () => {
    document.body.innerHTML = `
      <div class="dropdown">
        <button id="trigger" data-rg-toggle="dropdown" data-rg-target="#menu">Toggle</button>
        <div id="menu" class="dropdown-menu" hidden>
          <button type="button">Action</button>
        </div>
      </div>
    `;

    const trigger = document.getElementById("trigger");
    const menu = document.getElementById("menu");
    const dropdown = Rarog.Dropdown.getOrCreate(trigger);

    expect(Rarog.Dropdown.getOrCreate(trigger)).toBe(dropdown);
    expect(Rarog.Dropdown.getInstance(trigger)).toBe(dropdown);

    const showEvents = listenOnce(menu, "rg:dropdown:show");
    const hideEvents = listenOnce(menu, "rg:dropdown:hide");

    dropdown.show();
    expect(menu.hidden).toBe(false);
    expect(menu.classList.contains("rg-open")).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(showEvents).toHaveLength(1);

    dropdown.hide();
    expect(menu.hidden).toBe(true);
    expect(menu.classList.contains("rg-open")).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(hideEvents).toHaveLength(1);
  });

  test("Collapse toggles visibility and emits show/hide on target", () => {
    document.body.innerHTML = `
      <button id="trigger" data-rg-toggle="collapse" data-rg-target="#content">Toggle</button>
      <div id="content" hidden>Body</div>
    `;

    const trigger = document.getElementById("trigger");
    const target = document.getElementById("content");
    const collapse = Rarog.Collapse.getOrCreate(trigger);
    const showEvents = listenOnce(target, "rg:collapse:show");
    const hideEvents = listenOnce(target, "rg:collapse:hide");

    collapse.show();
    expect(target.hidden).toBe(false);
    expect(target.classList.contains("rg-open")).toBe(true);
    expect(showEvents).toHaveLength(1);

    collapse.hide();
    expect(target.hidden).toBe(true);
    expect(target.classList.contains("rg-open")).toBe(false);
    expect(hideEvents).toHaveLength(1);
  });

  test("Modal locks scroll and restores hidden state", () => {
    document.body.innerHTML = `
      <button id="before">Before</button>
      <div id="modal" class="modal" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <button type="button" id="inside">Inside</button>
            <button type="button" data-rg-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    `;

    const before = document.getElementById("before");
    const modalEl = document.getElementById("modal");
    before.focus();

    const modal = Rarog.Modal.getOrCreate(modalEl);
    modal.show();

    expect(modalEl.classList.contains("rg-modal-open")).toBe(true);
    expect(modalEl.getAttribute("aria-hidden")).toBe(null);
    expect(document.body.getAttribute("data-rg-scroll-locked")).toBe("true");
    expect(document.activeElement.id).toBe("inside");

    modal.hide();
    expect(modalEl.classList.contains("rg-modal-open")).toBe(false);
    expect(modalEl.getAttribute("aria-hidden")).toBe("true");
    expect(document.body.getAttribute("data-rg-scroll-locked")).toBe(null);
    expect(document.activeElement).toBe(before);
  });

  test("Offcanvas toggles backdrop, body class and lifecycle events", () => {
    document.body.innerHTML = `<aside id="drawer" class="offcanvas" aria-hidden="true"></aside>`;
    const drawer = document.getElementById("drawer");
    const offcanvas = Rarog.Offcanvas.getOrCreate(drawer);
    const showEvents = listenOnce(drawer, "rg:offcanvas:show");
    const hideEvents = listenOnce(drawer, "rg:offcanvas:hide");

    offcanvas.show();
    expect(drawer.classList.contains("is-open")).toBe(true);
    expect(document.body.classList.contains("rg-offcanvas-open")).toBe(true);
    expect(document.querySelector(".offcanvas-backdrop")).not.toBeNull();
    expect(showEvents).toHaveLength(1);

    offcanvas.hide();
    expect(drawer.classList.contains("is-open")).toBe(false);
    expect(document.body.classList.contains("rg-offcanvas-open")).toBe(false);
    expect(hideEvents).toHaveLength(1);
  });

  test("Toast show/hide contract updates visibility and live region", () => {
    document.body.innerHTML = `<div id="toast" class="toast">Saved</div>`;
    const toastEl = document.getElementById("toast");
    const toast = Rarog.Toast.getOrCreate(toastEl, { autoHide: false });
    const showEvents = listenOnce(toastEl, "rg:toast:show");
    const hideEvents = listenOnce(toastEl, "rg:toast:hide");

    toast.show();
    expect(toastEl.classList.contains("is-visible")).toBe(true);
    expect(toastEl.getAttribute("role")).toBe("status");
    expect(toastEl.getAttribute("aria-live")).toBe("polite");
    expect(showEvents).toHaveLength(1);

    toast.hide();
    expect(toastEl.classList.contains("is-visible")).toBe(false);
    expect(toastEl.hasAttribute("aria-live")).toBe(false);
    expect(hideEvents).toHaveLength(1);
  });

  test("Tooltip creates overlay and binds trigger description", () => {
    document.body.innerHTML = `<button id="tip" title="Helpful">Hover</button>`;
    const trigger = document.getElementById("tip");
    const tooltip = Rarog.Tooltip.getOrCreate(trigger, { placement: "bottom" });

    tooltip.show();
    const overlay = document.querySelector(".tooltip");
    expect(overlay).not.toBeNull();
    expect(overlay.classList.contains("is-visible")).toBe(true);
    expect(trigger.hasAttribute("aria-describedby")).toBe(true);

    tooltip.hide();
    expect(overlay.classList.contains("is-visible")).toBe(false);
    expect(trigger.hasAttribute("aria-describedby")).toBe(false);
  });

  test("Popover toggles overlay visibility and trigger expanded state", () => {
    document.body.innerHTML = `<button id="pop" data-rg-popover-title="Info" data-rg-popover-content="Body">Open</button>`;
    const trigger = document.getElementById("pop");
    const popover = Rarog.Popover.getOrCreate(trigger, { placement: "bottom" });

    popover.show();
    const overlay = document.querySelector(".popover");
    expect(overlay).not.toBeNull();
    expect(overlay.classList.contains("is-visible")).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    popover.hide();
    expect(overlay.classList.contains("is-visible")).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  test("Carousel navigation updates active slide and emits events", () => {
    document.body.innerHTML = `
      <div id="carousel" class="carousel">
        <div class="carousel-inner">
          <div class="carousel-item is-active">One</div>
          <div class="carousel-item">Two</div>
          <div class="carousel-item">Three</div>
        </div>
      </div>
    `;

    const el = document.getElementById("carousel");
    const carousel = Rarog.Carousel.getOrCreate(el, { autoplay: false });
    const nextEvents = listenOnce(el, "rg:carousel:next");
    const prevEvents = listenOnce(el, "rg:carousel:prev");

    carousel.next();
    expect(el.querySelectorAll(".carousel-item")[1].classList.contains("is-active")).toBe(true);
    expect(nextEvents).toHaveLength(1);

    carousel.prev();
    expect(el.querySelectorAll(".carousel-item")[0].classList.contains("is-active")).toBe(true);
    expect(prevEvents).toHaveLength(1);

    carousel.destroy();
    expect(Rarog.Carousel.getInstance(el)).toBe(null);
  });

  test("Stepper maintains current step and emits navigation events", () => {
    document.body.innerHTML = `
      <div id="stepper" class="stepper">
        <button class="stepper-step is-active">A</button>
        <button class="stepper-step">B</button>
        <button class="stepper-step">C</button>
        <div class="stepper-content is-active">A</div>
        <div class="stepper-content" hidden>B</div>
        <div class="stepper-content" hidden>C</div>
      </div>
    `;

    const el = document.getElementById("stepper");
    const stepper = Rarog.Stepper.getOrCreate(el);
    const gotoEvents = listenOnce(el, "rg:stepper:goto");

    stepper.goTo(2);
    expect(el.querySelectorAll(".stepper-step")[2].classList.contains("is-active")).toBe(true);
    expect(gotoEvents).toHaveLength(1);

    stepper.reset();
    expect(el.querySelectorAll(".stepper-step")[0].classList.contains("is-active")).toBe(true);

    stepper.destroy();
    expect(Rarog.Stepper.getInstance(el)).toBe(null);
  });

  test("Datepicker and DatetimePicker create popup, toggle open state and sync value", () => {
    document.body.innerHTML = `
      <div id="dp" data-rg-datepicker><input id="dp-input" type="text" /></div>
      <div id="dtp" data-rg-datetime-picker><input id="dtp-input" type="text" /></div>
    `;

    const dpEl = document.getElementById("dp");
    const datepicker = Rarog.Datepicker.getOrCreate(dpEl);
    const dtpEl = document.getElementById("dtp");
    const datetimePicker = Rarog.DatetimePicker.getOrCreate(dtpEl);

    datepicker.show();
    expect(dpEl.querySelector(".rg-datepicker-popup").classList.contains("is-open")).toBe(true);
    datepicker.hide();
    expect(dpEl.querySelector(".rg-datepicker-popup").classList.contains("is-open")).toBe(false);

    datetimePicker.show();
    expect(dtpEl.querySelector(".rg-datepicker-popup").classList.contains("is-open")).toBe(true);
    datetimePicker.dispose();
    expect(Rarog.DatetimePicker.getInstance(dtpEl)).toBe(null);
  });

  test("Select supports show/hide and value selection contract", () => {
    document.body.innerHTML = `
      <div id="select" data-rg-select>
        <button type="button" data-rg-select-toggle>Choose</button>
        <input type="hidden" id="select-value" />
        <div data-rg-select-menu hidden>
          <button type="button" data-rg-value="alpha">Alpha</button>
          <button type="button" data-rg-value="beta">Предварительное</button>
        </div>
      </div>
    `;

    const el = document.getElementById("select");
    const select = Rarog.Select.getOrCreate(el);
    const changes = listenOnce(el, "rg:select:change");

    select.show();
    expect(el.querySelector("[data-rg-select-menu]").hidden).toBe(false);

    el.querySelector("[data-rg-value='beta']").click();
    expect(document.getElementById("select-value").value).toBe("beta");
    expect(changes).toHaveLength(1);

    select.dispose();
    expect(Rarog.Select.getInstance(el)).toBe(null);
  });

  test("Combobox filters list, changes value and disposes cleanly", () => {
    document.body.innerHTML = `
      <div id="combo" data-rg-combobox>
        <input id="combo-input" type="text" />
        <input type="hidden" id="combo-value" />
        <button type="button" data-rg-combobox-toggle>▼</button>
        <div data-rg-combobox-list hidden>
          <button type="button" data-rg-value="apple">Apple</button>
          <button type="button" data-rg-value="banana">Banana</button>
        </div>
      </div>
    `;

    const el = document.getElementById("combo");
    const combo = Rarog.Combobox.getOrCreate(el);
    const changes = listenOnce(el, "rg:combobox:change");

    combo.show();
    expect(el.querySelector("[data-rg-combobox-list]").hidden).toBe(false);

    el.querySelector("[data-rg-value='banana']").click();
    expect(document.getElementById("combo-input").value).toBe("Banana");
    expect(document.getElementById("combo-value").value).toBe("banana");
    expect(changes).toHaveLength(1);

    combo.dispose();
    expect(Rarog.Combobox.getInstance(el)).toBe(null);
  });

  test("TagsInput add/remove/clear contract keeps hidden input in sync", () => {
    document.body.innerHTML = `
      <div id="tags" data-rg-tags-input>
        <input type="text" data-rg-tags-input-field />
        <input type="hidden" data-rg-tags-input-value />
        <div data-rg-tags-input-list></div>
      </div>
    `;

    const el = document.getElementById("tags");
    const tags = Rarog.TagsInput.getOrCreate(el);

    tags.addTag("alpha");
    tags.addTag("beta");
    expect(el.querySelectorAll("[data-rg-tag-value]")).toHaveLength(2);
    expect(el.querySelector("[data-rg-tags-input-value]").value).toBe("alpha,beta");

    tags.removeTag("alpha");
    expect(el.querySelectorAll("[data-rg-tag-value]")).toHaveLength(1);
    expect(el.querySelector("[data-rg-tags-input-value]").value).toBe("beta");

    tags.clear();
    expect(el.querySelectorAll("[data-rg-tag-value]")).toHaveLength(0);
    expect(el.querySelector("[data-rg-tags-input-value]").value).toBe("");

    tags.dispose();
    expect(Rarog.TagsInput.getInstance(el)).toBe(null);
  });

  test("DataTable search, sort and pagination update visible rows and emit update", () => {
    document.body.innerHTML = `
      <div id="table-wrap" data-rg-table data-rg-page-size="2">
        <input type="text" data-rg-table-search />
        <table>
          <thead>
            <tr>
              <th data-rg-sort="name">Name</th>
              <th data-rg-sort="count" data-rg-sort-type="number">Count</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Gamma</td><td>30</td></tr>
            <tr><td>Alpha</td><td>10</td></tr>
            <tr><td>Предварительное</td><td>20</td></tr>
          </tbody>
        </table>
        <div data-rg-table-pagination></div>
      </div>
    `;

    const el = document.getElementById("table-wrap");
    const table = Rarog.DataTable.getOrCreate(el);
    const updates = listenOnce(el, "rg:table:update");

    const search = el.querySelector("[data-rg-table-search]");
    search.value = "alp";
    search.dispatchEvent(new Event("input", { bubbles: true }));
    expect(el.querySelectorAll("tbody tr")).toHaveLength(1);
    expect(el.querySelector("tbody tr td").textContent).toBe("Alpha");

    search.value = "";
    search.dispatchEvent(new Event("input", { bubbles: true }));
    el.querySelector("th[data-rg-sort='count']").click();
    expect(el.querySelector("tbody tr td").textContent).toBe("Alpha");

    const page2 = el.querySelector("[data-rg-page='2']");
    expect(page2).not.toBeNull();
    page2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(updates.length).toBeGreaterThan(0);

    table.dispose();
    expect(Rarog.DataTable.getInstance(el)).toBe(null);
  });

  test("InputMask register/apply formats value through custom handler", () => {
    document.body.innerHTML = `<input id="masked" data-rg-mask="custom" />`;
    const input = document.getElementById("masked");

    Rarog.InputMask.register("custom", value => value.replace(/\D+/g, "").slice(0, 4));
    Rarog.InputMask.apply(input);

    input.value = "ab12cd345";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(input.value).toBe("1234");
  });
});
