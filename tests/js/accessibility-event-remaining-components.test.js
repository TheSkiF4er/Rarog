import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("Remaining components accessibility/event pass", () => {
  test("Stepper emits change/changed and syncs tab semantics", () => {
    document.body.innerHTML = `
      <div class="stepper" id="wizard">
        <div class="stepper-header">
          <button class="stepper-step is-active">Step 1</button>
          <button class="stepper-step">Step 2</button>
        </div>
        <div class="stepper-body">
          <section class="stepper-content is-active">A</section>
          <section class="stepper-content">B</section>
        </div>
      </div>
    `;

    const wizard = document.getElementById("wizard");
    const stepper = Rarog.Stepper.getOrCreate(wizard);
    const events = [];
    wizard.addEventListener("rg:stepper:change", e => events.push([e.type, e.detail.index]));
    wizard.addEventListener("rg:stepper:changed", e => events.push([e.type, e.detail.index]));

    stepper.goTo(1);

    expect(wizard.querySelector(".stepper-header").getAttribute("role")).toBe("tablist");
    expect(wizard.querySelectorAll(".stepper-step")[1].getAttribute("aria-selected")).toBe("true");
    expect(events).toEqual([["rg:stepper:change", 1], ["rg:stepper:changed", 1]]);
  });

  test("Datepicker emits show/shown and wires dialog ARIA", () => {
    document.body.innerHTML = `<div id="picker" data-rg-datepicker><input type="text"></div>`;
    const el = document.getElementById("picker");
    const input = el.querySelector("input");
    const picker = Rarog.Datepicker.getOrCreate(el);
    const calls = [];
    input.addEventListener("rg:datepicker:show", () => calls.push("show"));
    input.addEventListener("rg:datepicker:shown", () => calls.push("shown"));

    picker.show();

    expect(input.getAttribute("aria-haspopup")).toBe("dialog");
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(calls).toEqual(["show", "shown"]);
  });

  test("Select and Combobox emit change events and sync listbox semantics", () => {
    document.body.innerHTML = `
      <div id="select" class="rg-select">
        <button class="rg-select-toggle">Select</button>
        <div class="rg-select-menu">
          <button class="rg-select-item is-selected">A</button>
          <button class="rg-select-item">B</button>
        </div>
      </div>
      <div id="combo" class="rg-combobox">
        <input class="rg-combobox-input" />
        <button class="rg-combobox-toggle"></button>
        <div class="rg-combobox-menu">
          <button class="rg-combobox-item is-selected">One</button>
          <button class="rg-combobox-item">Two</button>
        </div>
      </div>
    `;

    const select = Rarog.Select.getOrCreate(document.getElementById("select"));
    const combo = Rarog.Combobox.getOrCreate(document.getElementById("combo"));
    const selectRoot = document.getElementById("select");
    const comboRoot = document.getElementById("combo");
    const events = [];

    selectRoot.addEventListener("rg:select:changed", e => events.push([e.type, e.detail.index]));
    comboRoot.addEventListener("rg:combobox:changed", e => events.push([e.type, e.detail.index]));

    if (typeof select.selectIndex === "function") select.selectIndex(1);
    if (typeof combo.selectIndex === "function") combo.selectIndex(1);

    expect(selectRoot.querySelector("[role='listbox']")).toBeTruthy();
    expect(comboRoot.querySelector("[role='listbox']")).toBeTruthy();
    expect(events).toEqual([["rg:select:changed", 1], ["rg:combobox:changed", 1]]);
  });

  test("TagsInput emits add/remove events and improves control labels", () => {
    document.body.innerHTML = `<div id="tags" class="rg-tags-input"><input type="text"></div>`;
    const root = document.getElementById("tags");
    const tags = Rarog.TagsInput.getOrCreate(root);
    const seen = [];

    root.addEventListener("rg:tagsinput:added", e => seen.push([e.type, e.detail.value]));
    root.addEventListener("rg:tagsinput:removed", e => seen.push([e.type, e.detail.value]));

    tags.addTag("alpha");
    tags.removeTag("alpha");

    expect(root.getAttribute("role")).toBe("group");
    expect(root.querySelector("input").getAttribute("aria-label")).toBeTruthy();
    expect(seen).toEqual([["rg:tagsinput:added", "alpha"], ["rg:tagsinput:removed", "alpha"]]);
  });

  test("DataTable emits page/sort events and improves accessible metadata", () => {
    document.body.innerHTML = `
      <div id="tableWrap" class="rg-data-table">
        <input class="rg-data-table-search" />
        <table>
          <thead><tr><th data-rg-sort="name">Name</th></tr></thead>
          <tbody><tr><td>A</td></tr></tbody>
        </table>
        <div class="rg-data-table-pagination"><button class="is-active" data-rg-page="1">1</button></div>
      </div>
    `;

    const root = document.getElementById("tableWrap");
    const table = Rarog.DataTable.getOrCreate(root);
    const seen = [];
    root.addEventListener("rg:datatable:pagechanged", e => seen.push(e.type));
    root.addEventListener("rg:datatable:sortchanged", e => seen.push(e.type));

    if (typeof table.goToPage === "function") table.goToPage(1);
    if (typeof table.sortBy === "function") table.sortBy("name");

    expect(root.querySelector(".rg-data-table-search").getAttribute("aria-label")).toBeTruthy();
    expect(root.querySelector("th[data-rg-sort]").getAttribute("aria-sort")).toBeTruthy();
    expect(root.querySelector("[data-rg-page='1']").getAttribute("aria-current")).toBe("page");
    expect(seen).toEqual(["rg:datatable:pagechanged", "rg:datatable:sortchanged"]);
  });
});
