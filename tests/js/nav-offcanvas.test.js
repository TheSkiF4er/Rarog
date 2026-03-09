import { Rarog } from "../../packages/js/src/rarog.esm.js";

describe("Rarog.Offcanvas accessibility", () => {
  test("adds dialog semantics, traps focus, dismisses, and restores focus", () => {
    document.body.innerHTML = `
      <button type="button" id="launcher">Launch</button>
      <aside class="offcanvas" id="drawer" aria-hidden="true">
        <h2 class="offcanvas-title">Navigation</h2>
        <div class="offcanvas-body">Menu body</div>
        <button type="button" id="drawerAction">Action</button>
        <button type="button" data-rg-dismiss="offcanvas">Close</button>
      </aside>
    `;

    const launcher = document.getElementById("launcher");
    const el = document.getElementById("drawer");
    launcher.focus();

    const offcanvas = Rarog.Offcanvas.getOrCreate(el);
    offcanvas.show();

    expect(el.getAttribute("role")).toBe("dialog");
    expect(el.getAttribute("aria-modal")).toBe("true");
    expect(el.getAttribute("aria-hidden")).toBe("false");
    expect(el.getAttribute("aria-labelledby")).toBeTruthy();
    expect(el.getAttribute("aria-describedby")).toBeTruthy();
    expect(document.activeElement.id).toBe("drawerAction");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    expect(document.activeElement.getAttribute("data-rg-dismiss")).toBe("offcanvas");

    offcanvas.hide();
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(document.activeElement.id).toBe("launcher");
  });
});
