import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("Rarog.Stepper accessibility", () => {
  test("adds tab semantics and updates panels", () => {
    document.body.innerHTML = `
      <div class="stepper" id="testStepper">
        <div class="stepper-header">
          <button class="stepper-step is-active" data-rg-step-to="0">Account</button>
          <button class="stepper-step" data-rg-step-to="1">Profile</button>
        </div>
        <div class="stepper-body">
          <section class="stepper-content is-active">A</section>
          <section class="stepper-content">B</section>
        </div>
      </div>
    `;

    const el = document.getElementById("testStepper");
    const stepper = Rarog.Stepper.getOrCreate(el);
    const steps = Array.from(el.querySelectorAll(".stepper-step"));
    const contents = Array.from(el.querySelectorAll(".stepper-content"));

    expect(el.querySelector(".stepper-header").getAttribute("role")).toBe("tablist");
    expect(steps[0].getAttribute("role")).toBe("tab");
    expect(contents[0].getAttribute("role")).toBe("tabpanel");
    expect(steps[0].getAttribute("aria-selected")).toBe("true");

    stepper.goTo(1);

    expect(steps[1].getAttribute("aria-selected")).toBe("true");
    expect(contents[1].getAttribute("aria-hidden")).toBe("false");
    expect(contents[0].getAttribute("aria-hidden")).toBe("true");
  });

  test("supports keyboard navigation between steps", () => {
    document.body.innerHTML = `
      <div class="stepper" id="kbdStepper">
        <div class="stepper-header">
          <button class="stepper-step is-active" data-rg-step-to="0">One</button>
          <button class="stepper-step" data-rg-step-to="1">Two</button>
          <button class="stepper-step" data-rg-step-to="2">Three</button>
        </div>
        <div class="stepper-body">
          <section class="stepper-content is-active">1</section>
          <section class="stepper-content">2</section>
          <section class="stepper-content">3</section>
        </div>
      </div>
    `;

    const el = document.getElementById("kbdStepper");
    Rarog.Stepper.getOrCreate(el);
    const first = el.querySelectorAll(".stepper-step")[0];
    first.focus();

    first.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(el.querySelectorAll(".stepper-step")[1].getAttribute("aria-selected")).toBe("true");
  });
});
