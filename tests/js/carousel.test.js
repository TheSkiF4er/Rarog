/**
 * @file carousel.test.js
 * Простейшие behavior-тесты Carousel (MVP).
 */

import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("Rarog.Carousel", () => {
  test("getOrCreate возвращает один и тот же инстанс", () => {
    document.body.innerHTML = `
      <div class="carousel" id="testCarousel">
        <div class="carousel-inner">
          <div class="carousel-item is-active">1</div>
          <div class="carousel-item">2</div>
        </div>
      </div>
    `;

    const el = document.getElementById("testCarousel");
    const a = Rarog.Carousel.getOrCreate(el);
    const b = Rarog.Carousel.getOrCreate(el);

    expect(a).toBe(b);
  });

  test("next() переключает активный слайд", () => {
    document.body.innerHTML = `
      <div class="carousel" id="testCarousel">
        <div class="carousel-inner">
          <div class="carousel-item is-active">1</div>
          <div class="carousel-item">2</div>
        </div>
      </div>
    `;

    const el = document.getElementById("testCarousel");
    const carousel = Rarog.Carousel.getOrCreate(el);

    carousel.next();

    const items = Array.from(el.querySelectorAll(".carousel-item"));
    expect(items[0].classList.contains("is-active")).toBe(false);
    expect(items[1].classList.contains("is-active")).toBe(true);
  });
});
