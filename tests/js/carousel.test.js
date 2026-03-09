import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("Rarog.Carousel accessibility", () => {
  test("adds carousel semantics and updates aria-hidden", () => {
    document.body.innerHTML = `
      <div class="carousel" id="testCarousel">
        <div class="carousel-inner">
          <div class="carousel-item is-active">1</div>
          <div class="carousel-item">2</div>
        </div>
        <button type="button" data-rg-target="#testCarousel" data-rg-slide-to="0"></button>
        <button type="button" data-rg-target="#testCarousel" data-rg-slide-to="1"></button>
      </div>
    `;

    const el = document.getElementById("testCarousel");
    const carousel = Rarog.Carousel.getOrCreate(el);
    const items = Array.from(el.querySelectorAll(".carousel-item"));

    expect(el.getAttribute("role")).toBe("region");
    expect(el.getAttribute("aria-roledescription")).toBe("carousel");
    expect(items[0].getAttribute("role")).toBe("group");
    expect(items[0].getAttribute("aria-hidden")).toBe(null);
    expect(items[1].getAttribute("aria-hidden")).toBe("true");

    carousel.next();
    expect(items[0].getAttribute("aria-hidden")).toBe("true");
    expect(items[1].getAttribute("aria-hidden")).toBe(null);
  });

  test("supports arrow-key navigation", () => {
    document.body.innerHTML = `
      <div class="carousel" id="kbdCarousel">
        <div class="carousel-inner">
          <div class="carousel-item is-active">1</div>
          <div class="carousel-item">2</div>
          <div class="carousel-item">3</div>
        </div>
      </div>
    `;

    const el = document.getElementById("kbdCarousel");
    Rarog.Carousel.getOrCreate(el);

    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(el.querySelectorAll(".carousel-item")[1].classList.contains("is-active")).toBe(true);
  });
});
