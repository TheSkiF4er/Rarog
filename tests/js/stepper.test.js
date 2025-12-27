/**
 * @file stepper.test.js
 * Минимальные тесты поведения Stepper.
 */

import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("Rarog.Stepper", () => {
  test("goTo() меняет активный шаг", () => {
    document.body.innerHTML = `
      <div class="stepper" id="testStepper">
        <div class="stepper-header">
          <button class="stepper-step is-active" data-rg-step-to="0"></button>
          <button class="stepper-step" data-rg-step-to="1"></button>
        </div>
        <div class="stepper-body">
          <section class="stepper-content is-active">A</section>
          <section class="stepper-content">B</section>
        </div>
      </div>
    `;

    const el = document.getElementById("testStepper");
    const stepper = Rarog.Stepper.getOrCreate(el);

    stepper.goTo(1);

    const steps = Array.from(el.querySelectorAll(".stepper-step"));
    const contents = Array.from(el.querySelectorAll(".stepper-content"));

    expect(steps[0].classList.contains("is-active")).toBe(false);
    expect(steps[1].classList.contains("is-active")).toBe(true);
    expect(contents[0].classList.contains("is-active")).toBe(false);
    expect(contents[1].classList.contains("is-active")).toBe(true);
  });
});
