import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("runtime pass: stepper / datepicker / select / combobox / tags-input / data-table", () => {
  test("Stepper emits cancelable change and changed with legacy goto", () => {
    document.body.innerHTML = `
      <div class="stepper" id="s">
        <button class="stepper-step is-active" data-rg-step-to="0"></button>
        <button class="stepper-step" data-rg-step-to="1"></button>
        <section class="stepper-content is-active">A</section>
        <section class="stepper-content">B</section>
      </div>
    `;
    const el = document.getElementById("s");
    const stepper = Rarog.Stepper.getOrCreate(el);
    const events = [];
    el.addEventListener("rg:stepper:change", e => events.push([e.type, e.detail.fromIndex, e.detail.toIndex]));
    el.addEventListener("rg:stepper:changed", e => events.push([e.type, e.detail.fromIndex, e.detail.toIndex]));
    el.addEventListener("rg:stepper:goto", () => events.push(["rg:stepper:goto"]));

    stepper.goTo(1);

    expect(events).toEqual([
      ["rg:stepper:change", 0, 1],
      ["rg:stepper:changed", 0, 1],
      ["rg:stepper:goto"]
    ]);
  });

  test("Datepicker show/hide are cancelable and emit shown/hidden", () => {
    document.body.innerHTML = `
      <div class="rg-datepicker" data-rg-datepicker>
        <input type="text" id="birthday" />
        <div class="rg-datepicker-popup" hidden>
          <button type="button" class="rg-datepicker-prev">‹</button>
          <div class="rg-datepicker-title"></div>
          <button type="button" class="rg-datepicker-next">›</button>
          <div class="rg-datepicker-grid"></div>
        </div>
      </div>
    `;
    const el = document.querySelector("[data-rg-datepicker]");
    const picker = Rarog.Datepicker.getOrCreate(el);
    const events = [];
    el.addEventListener("rg:datepicker:show", e => {
      events.push(e.type);
      e.preventDefault();
    });

    expect(picker.show()).toBe(false);
    expect(events).toEqual(["rg:datepicker:show"]);

    el.replaceWith(el.cloneNode(true));
    document.body.innerHTML = `
      <div class="rg-datepicker" data-rg-datepicker>
        <input type="text" id="birthday" />
        <div class="rg-datepicker-popup" hidden>
          <button type="button" class="rg-datepicker-prev">‹</button>
          <div class="rg-datepicker-title"></div>
          <button type="button" class="rg-datepicker-next">›</button>
          <div class="rg-datepicker-grid"></div>
        </div>
      </div>
    `;
    const el2 = document.querySelector("[data-rg-datepicker]");
    const picker2 = Rarog.Datepicker.getOrCreate(el2);
    const events2 = [];
    ["rg:datepicker:show", "rg:datepicker:shown", "rg:datepicker:hide", "rg:datepicker:hidden"].forEach(name => {
      el2.addEventListener(name, () => events2.push(name));
    });
    picker2.show();
    picker2.hide();
    expect(events2).toEqual(["rg:datepicker:show", "rg:datepicker:shown", "rg:datepicker:hide", "rg:datepicker:hidden"]);
  });

  test("Select and Combobox emit stable lifecycle plus legacy open/close", () => {
    document.body.innerHTML = `
      <div class="rg-select" data-rg-select id="sel">
        <button type="button" class="rg-select-toggle" data-rg-select-toggle><span class="rg-select-label"></span></button>
        <div class="rg-select-menu" data-rg-select-menu>
          <button type="button" class="rg-select-option" data-rg-value="basic">Basic</button>
        </div>
        <input type="hidden" id="plan" />
      </div>
      <div class="rg-combobox" data-rg-combobox id="combo">
        <input class="rg-combobox-input" />
        <button type="button" class="rg-combobox-toggle">▼</button>
        <div class="rg-combobox-list" hidden>
          <button type="button" class="rg-combobox-option" data-rg-value="alpha">Alpha</button>
        </div>
      </div>
    `;
    const selEl = document.getElementById("sel");
    const comboEl = document.getElementById("combo");
    const select = Rarog.Select.getOrCreate(selEl);
    const combo = Rarog.Combobox.getOrCreate(comboEl);
    const selEvents = [];
    const comboEvents = [];
    ["rg:select:show", "rg:select:shown", "rg:select:hide", "rg:select:hidden", "rg:select:open", "rg:select:close"].forEach(name => selEl.addEventListener(name, () => selEvents.push(name)));
    ["rg:combobox:show", "rg:combobox:shown", "rg:combobox:hide", "rg:combobox:hidden", "rg:combobox:open", "rg:combobox:close"].forEach(name => comboEl.addEventListener(name, () => comboEvents.push(name)));
    select.show();
    select.hide();
    combo.show();
    combo.hide();
    expect(selEvents).toEqual(["rg:select:show", "rg:select:shown", "rg:select:open", "rg:select:hide", "rg:select:hidden", "rg:select:close"]);
    expect(comboEvents).toEqual(["rg:combobox:show", "rg:combobox:shown", "rg:combobox:open", "rg:combobox:hide", "rg:combobox:hidden", "rg:combobox:close"]);
  });

  test("TagsInput add/remove are cancelable and DataTable emits search/sort/page/update", () => {
    document.body.innerHTML = `
      <div class="rg-tags-input" data-rg-tags-input id="tags">
        <div class="rg-tags"></div>
        <input class="rg-tags-input-input" />
        <input type="hidden" id="tagsHidden" />
      </div>
      <div id="tableWrap" data-rg-table data-rg-page-size="1">
        <input data-rg-table-search />
        <table>
          <thead><tr><th data-rg-sort="name">Name</th></tr></thead>
          <tbody><tr><td>Предварительное</td></tr><tr><td>Alpha</td></tr></tbody>
        </table>
        <div class="rg-table-pagination"></div>
      </div>
    `;
    const tagsEl = document.getElementById("tags");
    const tags = Rarog.TagsInput.getOrCreate(tagsEl);
    tagsEl.addEventListener("rg:tags-input:add", e => e.preventDefault(), { once: true });
    expect(tags.addTag("blocked")).toBe(false);
    expect(document.getElementById("tagsHidden").value).toBe("");
    const tagEvents = [];
    ["rg:tags-input:add", "rg:tags-input:change", "rg:tags-input:remove"].forEach(name => tagsEl.addEventListener(name, () => tagEvents.push(name)));
    tags.addTag("frontend");
    tags.removeTag("frontend");
    expect(tagEvents).toEqual(["rg:tags-input:add", "rg:tags-input:change", "rg:tags-input:remove", "rg:tags-input:change"]);

    const tableEl = document.getElementById("tableWrap");
    const table = Rarog.DataTable.getOrCreate(tableEl);
    const tableEvents = [];
    ["rg:table:search", "rg:table:sort", "rg:table:page", "rg:table:update"].forEach(name => tableEl.addEventListener(name, () => tableEvents.push(name)));
    const search = tableEl.querySelector("[data-rg-table-search]");
    search.value = "alpha";
    search.dispatchEvent(new Event("input", { bubbles: true }));
    tableEl.querySelector("th[data-rg-sort]").click();
    const pageLink = tableEl.querySelector(".page-link[data-rg-page='1']");
    if (pageLink) pageLink.click();
    expect(tableEvents).toContain("rg:table:search");
    expect(tableEvents).toContain("rg:table:sort");
    expect(tableEvents).toContain("rg:table:update");
    expect(table instanceof Rarog.DataTable).toBe(true);
  });
});
