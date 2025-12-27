/**
 * @file forms-advanced.test.js
 * Тесты для datepicker, select/combobox и tags-input (MVP-поведение).
 */

import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("Rarog.Datepicker", () => {
  test("инициализация через data-API и выбор даты обновляет value", () => {
    document.body.innerHTML = `
      <div class="rg-datepicker" data-rg-datepicker>
        <input type="date" class="rg-datepicker-input" id="birthday" />
        <div class="rg-datepicker-popup">
          <button type="button" class="rg-datepicker-day" data-rg-date="2025-01-01">1</button>
        </div>
      </div>
    `;

    Rarog.initDataApi(document);

    const popupDay = document.querySelector("[data-rg-date=\"2025-01-01\"]");
    const input = document.getElementById("birthday");

    popupDay.click();

    expect(input.value).toBe("2025-01-01");
  });
});

describe("Rarog.Select", () => {
  test("выбор опции обновляет hidden-поле", () => {
    document.body.innerHTML = `
      <div class="rg-select" data-rg-select>
        <button type="button" class="rg-select-toggle" data-rg-select-toggle>
          <span class="rg-select-label" data-rg-placeholder="Выберите"></span>
        </button>
        <div class="rg-select-menu" data-rg-select-menu>
          <button type="button" class="rg-select-option" data-rg-value="basic">Basic</button>
          <button type="button" class="rg-select-option" data-rg-value="pro">Pro</button>
        </div>
        <input type="hidden" name="plan" id="planField" />
      </div>
    `;

    const root = document.querySelector("[data-rg-select]");
    const select = Rarog.Select.getOrCreate(root);
    const option = root.querySelector('[data-rg-value="pro"]');

    option.click();

    const hidden = document.getElementById("planField");
    expect(hidden.value).toBe("pro");
  });
});

describe("Rarog.TagsInput", () => {
  test("Enter добавляет тег и обновляет hidden-поле", () => {
    document.body.innerHTML = `
      <div class="rg-tags-input" data-rg-tags-input>
        <div class="rg-tags"></div>
        <input class="rg-tags-input-input" />
        <input type="hidden" name="tags" id="tagsHidden" />
      </div>
    `;

    const root = document.querySelector("[data-rg-tags-input]");
    const tags = Rarog.TagsInput.getOrCreate(root);
    const input = root.querySelector(".rg-tags-input-input");

    input.value = "frontend";
    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
    input.dispatchEvent(event);

    const hidden = document.getElementById("tagsHidden");
    expect(hidden.value.includes("frontend")).toBe(true);
  });
});
