import { createApp, h, nextTick, ref } from "vue";
import { afterEach, describe, expect, it } from "vitest";
import RarogPlugin, {
  RarogModal,
  RarogDropdown,
  RarogButton,
  RarogInput,
  RarogTabs,
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

  it("installs the plugin and mounts wrapped primitives, modal/dropdown output with imperative exposes", async () => {
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
          h(RarogButton, null, { default: () => "Action" }),
          h(RarogInput, { placeholder: "Search" }),
          h(RarogTabs, {
            items: [
              { value: "one", label: "One", content: "Panel one" },
              { value: "two", label: "Two", content: "Panel two" }
            ],
            defaultValue: "one"
          }),
          h(RarogModal, { id: "vue-modal", title: "Hello Vue", defaultOpen: true }, {
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
    expect(app._context.components.RarogButton).toBeTruthy();
    expect(app._context.directives.rarog).toBeTruthy();

    app.mount(host);
    await nextTick();

    const modal = host.querySelector("#vue-modal.modal");
    const dropdownButton = host.querySelector(".dropdown button[data-rg-target='#vue-dropdown-menu']");
    const dropdownMenu = host.querySelector("#vue-dropdown-menu.dropdown-menu");
    const hookHarness = host.querySelector(".hook-harness");
    const button = host.querySelector(".btn.btn-primary");
    const input = host.querySelector("input.input");
    const tab = host.querySelector('[role="tab"][aria-selected="true"]');

    expect(modal).toBeTruthy();
    expect(button?.textContent).toContain("Action");
    expect(input?.getAttribute("placeholder")).toBe("Search");
    expect(tab?.textContent).toContain("One");
    expect(modal?.querySelector(".modal-title")?.textContent).toBe("Hello Vue");
    expect(dropdownButton?.textContent).toContain("Vue menu");
    expect(dropdownMenu?.getAttribute("role")).toBe("menu");
    expect(hookHarness?.textContent).toBe("hook-mounted");
    expect(harness.modalEl?.value).toBeInstanceOf(HTMLElement);
    expect(harness.modalApi?.value).toBeTruthy();
    expect(typeof harness.modalApi.value.show).toBe("function");
  });

  it("supports controlled open state and emits update:open", async () => {
    const open = ref(false);
    const updates = [];

    host = document.createElement("div");
    document.body.appendChild(host);

    app = createApp({
      setup() {
        return () => h(RarogModal, {
          id: "vue-controlled-modal",
          title: "Controlled Vue",
          open: open.value,
          "onUpdate:open": value => updates.push(value)
        }, { default: () => h("p", null, "Body") });
      }
    });

    app.use(RarogPlugin);
    app.mount(host);
    await nextTick();

    const modal = host.querySelector("#vue-controlled-modal");
    modal.dispatchEvent(new CustomEvent("rg:modal:shown", { bubbles: true }));
    modal.dispatchEvent(new CustomEvent("rg:modal:hidden", { bubbles: true }));

    expect(updates).toEqual([true, false]);
  });
});
