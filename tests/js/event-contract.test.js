/**
 * @file event-contract.test.js
 * Контрактные тесты для стабильного lifecycle Event API.
 */

import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("Rarog Event Contract", () => {
  test("Modal emits show -> shown -> hide -> hidden in order", () => {
    document.body.innerHTML = `
      <button id="trigger" type="button">Open</button>
      <div class="modal" id="modal" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <button type="button" data-rg-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    `;

    const modalEl = document.getElementById("modal");
    const modal = Rarog.Modal.getOrCreate(modalEl);
    const seen = [];

    ["show", "shown", "hide", "hidden"].forEach(name => {
      modalEl.addEventListener(`rg:modal:${name}`, () => seen.push(name));
    });

    modal.show();
    modal.hide();

    expect(seen).toEqual(["show", "shown", "hide", "hidden"]);
  });

  test("Dropdown show can be cancelled", () => {
    document.body.innerHTML = `
      <button id="trigger" data-rg-target="#menu">Toggle</button>
      <div id="menu" hidden>
        <button type="button">Item</button>
      </div>
    `;

    const trigger = document.getElementById("trigger");
    const menu = document.getElementById("menu");
    const dropdown = Rarog.Dropdown.getOrCreate(trigger);

    menu.addEventListener("rg:dropdown:show", event => {
      event.preventDefault();
    });

    const changed = dropdown.show();

    expect(changed).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(menu.hasAttribute("hidden")).toBe(true);
  });

  test("Offcanvas emits shown/hidden and can be cancelled on hide", () => {
    document.body.innerHTML = `
      <div class="offcanvas" id="panel" aria-hidden="true">
        <button type="button" data-rg-dismiss="offcanvas">Close</button>
      </div>
    `;

    const el = document.getElementById("panel");
    const offcanvas = Rarog.Offcanvas.getOrCreate(el);
    const seen = [];

    el.addEventListener("rg:offcanvas:shown", () => seen.push("shown"));
    el.addEventListener("rg:offcanvas:hide", event => {
      seen.push("hide");
      event.preventDefault();
    });

    offcanvas.show();
    const changed = offcanvas.hide();

    expect(seen).toEqual(["shown", "hide"]);
    expect(changed).toBe(false);
    expect(el.classList.contains("is-open")).toBe(true);
  });

  test("Carousel emits slide/slid and preserves legacy next event", () => {
    document.body.innerHTML = `
      <div class="carousel" id="carousel">
        <div class="carousel-inner">
          <div class="carousel-item is-active">One</div>
          <div class="carousel-item">Two</div>
        </div>
      </div>
    `;

    const el = document.getElementById("carousel");
    const carousel = Rarog.Carousel.getOrCreate(el);
    const seen = [];

    el.addEventListener("rg:carousel:slide", event => {
      seen.push(`slide:${event.detail.fromIndex}->${event.detail.toIndex}`);
    });
    el.addEventListener("rg:carousel:slid", event => {
      seen.push(`slid:${event.detail.index}`);
    });
    el.addEventListener("rg:carousel:next", event => {
      seen.push(`next:${event.detail.index}`);
    });

    carousel.next();

    expect(seen).toEqual(["slide:0->1", "slid:1", "next:1"]);
  });

  test("Carousel slide can be cancelled", () => {
    document.body.innerHTML = `
      <div class="carousel" id="carousel2">
        <div class="carousel-inner">
          <div class="carousel-item is-active">One</div>
          <div class="carousel-item">Two</div>
        </div>
      </div>
    `;

    const el = document.getElementById("carousel2");
    const carousel = Rarog.Carousel.getOrCreate(el);

    el.addEventListener("rg:carousel:slide", event => {
      event.preventDefault();
    });

    const changed = carousel.next();

    expect(changed).toBe(false);
    expect(el.querySelectorAll('.carousel-item')[0].classList.contains('is-active')).toBe(true);
  });
});
