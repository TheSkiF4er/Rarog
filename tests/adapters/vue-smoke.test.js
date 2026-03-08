import { createApp, h, nextTick } from "vue";
import { afterEach, describe, expect, it } from "vitest";
import RarogPlugin, {
  RarogModal,
  RarogDropdown,
  useModal
} from "../../packages/vue/dist/index.mjs";

describe("@rarog/vue smoke", () => {
  let host;
  let app;

  afterEach(() => {
    if (app) {
      app.unmount();
    }
    if (host && host.parentNode) {
      host.parentNode.removeChild(host);
    }
    host = null;
    app = null;
  });

  it("imports the built adapter, installs the plugin, and mounts modal/dropdown output", async () => {
    const harness = { modalEl: null, modalApi: null };
    const HookHarness = {
      name: "HookHarness",
      setup() {
        const { el, instance } = useModal({});
        harness.modalEl = el;
        harness.modalApi = instance;
        return () => h("div", { ref: el, class: "hook-harness" }, "hook-mounted");
      }
    };

    host = document.createElement("div");
    document.body.appendChild(host);

    app = createApp({
      render() {
        return h("div", { "data-testid": "vue-root" }, [
          h(RarogModal, { id: "vue-modal", title: "Hello Vue" }, {
            default: () => h("p", null, "Modal body")
          }),
          h(RarogDropdown, { label: "Vue menu", menuId: "vue-dropdown-menu" }, {
            default: () => h("a", { href: "#item" }, "Item")
          }),
          h(HookHarness)
        ]);
      }
    });

    app.use(RarogPlugin);
    expect(app._context.components.RarogModal).toBeTruthy();
    expect(app._context.components.RarogDropdown).toBeTruthy();
    expect(app._context.directives.rarog).toBeTruthy();

    app.mount(host);
    await nextTick();

    const modal = host.querySelector("#vue-modal.modal");
    const dropdownButton = host.querySelector(".dropdown button[data-rg-target='#vue-dropdown-menu']");
    const dropdownMenu = host.querySelector("#vue-dropdown-menu.dropdown-menu");
    const hookHarness = host.querySelector(".hook-harness");

    expect(modal).toBeTruthy();
    expect(modal?.querySelector(".modal-title")?.textContent).toBe("Hello Vue");
    expect(dropdownButton?.textContent).toContain("Vue menu");
    expect(dropdownMenu).toBeTruthy();
    expect(hookHarness?.textContent).toBe("hook-mounted");
    expect(harness.modalEl?.value).toBeInstanceOf(HTMLElement);
    expect(harness.modalApi?.value).toBeTruthy();
    expect(typeof harness.modalApi.value.show).toBe("function");
  });
});
