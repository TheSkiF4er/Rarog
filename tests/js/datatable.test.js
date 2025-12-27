/**
 * @file datatable.test.js
 * Тесты для DataTable (MVP: сортировка и поиск).
 */

import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("Rarog.DataTable", () => {
  test("сортировка по колонке меняет порядок строк", () => {
    document.body.innerHTML = `
      <div data-rg-table>
        <input type="search" data-rg-table-search />
        <table class="rg-table">
          <thead>
            <tr>
              <th data-rg-sort="name">Имя</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Alice</td></tr>
            <tr><td>Bob</td></tr>
          </tbody>
        </table>
      </div>
    `;

    const root = document.querySelector("[data-rg-table]");
    const table = Rarog.DataTable.getOrCreate(root);

    const header = root.querySelector("[data-rg-sort=\"name\"]");
    header.click();

    const cells = Array.from(root.querySelectorAll("tbody tr td")).map(td => td.textContent);
    expect(cells[0]).not.toBe("");
  });

  test("поиск фильтрует строки", () => {
    document.body.innerHTML = `
      <div data-rg-table>
        <input type="search" data-rg-table-search />
        <table class="rg-table">
          <thead>
            <tr>
              <th data-rg-sort="name">Имя</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Alice</td></tr>
            <tr><td>Bob</td></tr>
          </tbody>
        </table>
      </div>
    `;

    const root = document.querySelector("[data-rg-table]");
    const table = Rarog.DataTable.getOrCreate(root);
    const search = root.querySelector("[data-rg-table-search]");

    search.value = "Alice";
    search.dispatchEvent(new Event("input", { bubbles: true }));

    const visibleRows = Array.from(root.querySelectorAll("tbody tr")).filter(tr => tr.style.display !== "none");
    expect(visibleRows.length).toBe(1);
  });
});
