import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("Rarog.Datepicker accessibility/event", () => {
  test("input and popup expose dialog semantics and lifecycle events", () => {
    document.body.innerHTML = `
      <div class="rg-datepicker" data-rg-datepicker>
        <input type="text" id="dp" />
        <div class="rg-datepicker-popup">
          <div class="rg-datepicker-title"></div>
          <button type="button" class="rg-datepicker-prev">‹</button>
          <button type="button" class="rg-datepicker-next">›</button>
          <div class="rg-datepicker-grid"></div>
        </div>
      </div>
    `;

    const root = document.querySelector("[data-rg-datepicker]");
    const input = document.getElementById("dp");
    const events = [];
    root.addEventListener("rg:datepicker:show", () => events.push("show"));
    root.addEventListener("rg:datepicker:shown", () => events.push("shown"));
    const dp = Rarog.Datepicker.getOrCreate(root);

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

    const popup = root.querySelector(".rg-datepicker-popup");
    expect(input.getAttribute("aria-haspopup")).toBe("dialog");
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(popup.getAttribute("role")).toBe("dialog");
    expect(events).toEqual(["show", "shown"]);
  });
});

describe("Rarog.Select accessibility/event", () => {
  test("toggle exposes listbox semantics and emits show/hide/change", () => {
    document.body.innerHTML = `
      <div class="rg-select" data-rg-select>
        <button type="button" class="rg-select-toggle" data-rg-select-toggle>
          <span class="rg-select-label" data-rg-placeholder="Choose"></span>
        </button>
        <div class="rg-select-menu" data-rg-select-menu>
          <button type="button" class="rg-select-option" data-rg-value="basic">Basic</button>
          <button type="button" class="rg-select-option" data-rg-value="pro">Pro</button>
        </div>
        <input type="hidden" id="planField" />
      </div>
    `;

    const root = document.querySelector("[data-rg-select]");
    const select = Rarog.Select.getOrCreate(root);
    const toggle = root.querySelector("[data-rg-select-toggle]");
    const menu = root.querySelector("[data-rg-select-menu]");
    const seen = [];
    root.addEventListener("rg:select:shown", () => seen.push("shown"));
    root.addEventListener("rg:select:hidden", () => seen.push("hidden"));
    root.addEventListener("rg:select:change", e => seen.push(e.detail.value));

    toggle.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    root.querySelector('[data-rg-value="pro"]').click();

    expect(toggle.getAttribute("aria-haspopup")).toBe("listbox");
    expect(menu.getAttribute("role")).toBe("listbox");
    expect(document.getElementById("planField").value).toBe("pro");
    expect(seen).toEqual(["shown", "hidden", "pro"]);
  });
});

describe("Rarog.Combobox accessibility/event", () => {
  test("input exposes combobox semantics and emits shown/change", () => {
    document.body.innerHTML = `
      <div class="rg-combobox" data-rg-combobox>
        <input type="text" class="rg-combobox-input" />
        <div class="rg-combobox-list">
          <button type="button" class="rg-combobox-option" data-rg-value="apple">Apple</button>
          <button type="button" class="rg-combobox-option" data-rg-value="banana">Banana</button>
        </div>
        <input type="hidden" id="fruitField" />
      </div>
    `;

    const root = document.querySelector("[data-rg-combobox]");
    const input = root.querySelector(".rg-combobox-input");
    const seen = [];
    root.addEventListener("rg:combobox:shown", () => seen.push("shown"));
    root.addEventListener("rg:combobox:change", e => seen.push(e.detail.value));

    const box = Rarog.Combobox.getOrCreate(root);
    input.value = "ban";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    root.querySelector('[data-rg-value="banana"]').click();

    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-controls")).toBeTruthy();
    expect(document.getElementById("fruitField").value).toBe("banana");
    expect(seen).toEqual(["shown", "banana"]);
  });
});

describe("Rarog.TagsInput accessibility/event", () => {
  test("adds accessible tag list and emits add/remove/change", () => {
    document.body.innerHTML = `
      <div class="rg-tags-input" data-rg-tags-input>
        <div class="rg-tags"></div>
        <input class="rg-tags-input-input" />
        <input type="hidden" id="tagsHidden" />
      </div>
    `;

    const root = document.querySelector("[data-rg-tags-input]");
    const input = root.querySelector(".rg-tags-input-input");
    const tags = Rarog.TagsInput.getOrCreate(root);
    const events = [];
    root.addEventListener("rg:tags-input:add", e => events.push(`add:${e.detail.value}`));
    root.addEventListener("rg:tags-input:remove", e => events.push(`remove:${e.detail.value}`));

    input.value = "frontend";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    root.querySelector(".rg-tag-remove").click();

    expect(root.querySelector(".rg-tags").getAttribute("role")).toBe("list");
    expect(events).toEqual(["add:frontend", "remove:frontend"]);
  });
});

describe("Rarog.DataTable accessibility/event", () => {
  test("sortable header gets aria-sort and status updates", () => {
    document.body.innerHTML = `
      <div data-rg-table>
        <input type="search" data-rg-table-search />
        <div data-rg-table-pagination></div>
        <table class="rg-table">
          <thead>
            <tr>
              <th data-rg-sort="name">Name</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Bob</td></tr>
            <tr><td>Alice</td></tr>
          </tbody>
        </table>
      </div>
    `;

    const root = document.querySelector("[data-rg-table]");
    const events = [];
    root.addEventListener("rg:table:sort", () => events.push("sort"));
    const table = Rarog.DataTable.getOrCreate(root, { pageSize: 1 });
    const header = root.querySelector('[data-rg-sort="name"]');

    header.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    expect(header.getAttribute("aria-sort")).toBe("ascending");
    expect(root.querySelector('[data-rg-table-status]').textContent).toContain("rows");
    expect(events).toEqual(["sort"]);
  });
});

describe("Rarog.Stepper accessibility/event", () => {
  test("steps expose tabs semantics and arrow keys change step", () => {
    document.body.innerHTML = `
      <div class="stepper" id="testStepper">
        <div class="stepper-header">
          <button class="stepper-step is-active" data-rg-step-to="0">One</button>
          <button class="stepper-step" data-rg-step-to="1">Two</button>
        </div>
        <div class="stepper-body">
          <section class="stepper-content is-active">A</section>
          <section class="stepper-content">B</section>
        </div>
      </div>
    `;

    const el = document.getElementById("testStepper");
    const events = [];
    el.addEventListener("rg:stepper:changed", e => events.push(e.detail.toIndex));
    const stepper = Rarog.Stepper.getOrCreate(el);
    const first = el.querySelector('.stepper-step[data-rg-step-to="0"]');

    first.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

    const second = el.querySelector('.stepper-step[data-rg-step-to="1"]');
    expect(el.querySelector('.stepper-header').getAttribute('role')).toBe('tablist');
    expect(second.getAttribute('role')).toBe('tab');
    expect(second.getAttribute('aria-selected')).toBe('true');
    expect(events).toEqual([1]);
  });
});
