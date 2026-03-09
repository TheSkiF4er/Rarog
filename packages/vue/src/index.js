import { defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Rarog, { Dropdown, Modal, Offcanvas, dispose, init, reinit } from "@rarog/js";

const canUseDOM = typeof window !== "undefined" && typeof document !== "undefined";
let runtimeId = 0;

function createResolvedId(prefix, providedId) {
  runtimeId += 1;
  return providedId || `${prefix}-${runtimeId}`;
}

function attachLifecycleListeners(target, eventPrefix, handlers) {
  if (!target || !eventPrefix) return () => {};
  const listeners = [
    ["show", handlers.onShow],
    ["shown", handlers.onShown],
    ["hide", handlers.onHide],
    ["hidden", handlers.onHidden]
  ]
    .filter(([, handler]) => typeof handler === "function")
    .map(([name, handler]) => {
      const eventName = `rg:${eventPrefix}:${name}`;
      const listener = event => handler(event);
      target.addEventListener(eventName, listener);
      return [eventName, listener];
    });
  return () => listeners.forEach(([eventName, listener]) => target.removeEventListener(eventName, listener));
}

function teardownInstance(instance) {
  if (!instance) return;
  if (typeof instance.dispose === "function") instance.dispose();
  else if (typeof instance.destroy === "function") instance.destroy();
  else if (typeof instance.hide === "function") instance.hide();
}

function useRarogInit(ComponentClass, options) {
  const el = ref(null);
  const instance = ref(null);
  onMounted(() => {
    if (!canUseDOM || !el.value || !ComponentClass || typeof ComponentClass.getOrCreate !== "function") return;
    instance.value = ComponentClass.getOrCreate(el.value, options || {});
  });
  onBeforeUnmount(() => {
    teardownInstance(instance.value);
    instance.value = null;
  });
  return { el, instance };
}

function useModal(options) {
  return useRarogInit(Modal, options);
}

function useOffcanvas(options) {
  return useRarogInit(Offcanvas, options);
}

function useDropdown(options) {
  return useRarogInit(Dropdown, options);
}

const RarogProvider = defineComponent({
  name: "RarogProvider",
  props: {
    as: { type: String, default: "div" },
    autoInit: { type: Boolean, default: true },
    reinitOnChildrenChange: { type: Boolean, default: true }
  },
  setup(props, { slots, attrs }) {
    const root = ref(null);
    onMounted(() => {
      if (canUseDOM && props.autoInit && root.value) init(root.value);
    });
    onBeforeUnmount(() => {
      if (canUseDOM && root.value) dispose(root.value);
    });
    watch(
      () => slots.default && slots.default(),
      async () => {
        if (!canUseDOM || !props.autoInit || !props.reinitOnChildrenChange) return;
        await nextTick();
        if (root.value) reinit(root.value);
      }
    );
    return () => h(props.as, { ...attrs, ref: root }, slots.default ? slots.default() : []);
  }
});

const RarogModal = defineComponent({
  name: "RarogModal",
  props: {
    id: { type: String, default: "" },
    title: { type: String, default: "" },
    closeLabel: { type: String, default: "Close" },
    className: { type: String, default: "" },
    dialogClassName: { type: String, default: "" },
    headerClassName: { type: String, default: "" },
    bodyClassName: { type: String, default: "" },
    footerClassName: { type: String, default: "" },
    options: { type: Object, default: () => ({}) },
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false }
  },
  emits: ["show", "shown", "hide", "hidden", "open", "close", "update:open"],
  setup(props, { slots, expose, attrs, emit }) {
    const { el, instance } = useModal(props.options);
    const id = createResolvedId("rg-modal", props.id);
    const titleId = `${id}-title`;
    const bodyId = `${id}-body`;
    let detach = () => {};

    onMounted(() => {
      if (!canUseDOM || !el.value) return;
      detach = attachLifecycleListeners(el.value, "modal", {
        onShow: event => emit("show", event),
        onShown: event => {
          emit("shown", event);
          emit("open", event);
          emit("update:open", true);
        },
        onHide: event => emit("hide", event),
        onHidden: event => {
          emit("hidden", event);
          emit("close", event);
          emit("update:open", false);
        }
      });
      if (props.defaultOpen && instance.value && typeof instance.value.show === "function") instance.value.show();
    });

    watch(() => props.open, value => {
      if (!instance.value || value == null) return;
      if (value && typeof instance.value.show === "function") instance.value.show();
      if (!value && typeof instance.value.hide === "function") instance.value.hide();
    });

    onBeforeUnmount(() => {
      detach();
    });

    expose({
      element: el,
      instance,
      show: () => instance.value && instance.value.show && instance.value.show(),
      hide: () => instance.value && instance.value.hide && instance.value.hide(),
      toggle: () => instance.value && instance.value.toggle && instance.value.toggle(),
      dispose: () => teardownInstance(instance.value),
      destroy: () => teardownInstance(instance.value)
    });
    return () => h(
      "div",
      {
        ...attrs,
        id,
        ref: el,
        class: `modal ${props.className}`.trim(),
        role: "dialog",
        "aria-modal": "true",
        "aria-hidden": "true",
        "aria-labelledby": props.title || slots.header ? titleId : undefined,
        "aria-describedby": bodyId
      },
      [
        h("div", { class: `modal-dialog ${props.dialogClassName}`.trim() }, [
          props.title || slots.header
            ? h("div", { class: `modal-header ${props.headerClassName}`.trim() }, [
                slots.header ? slots.header() : h("h2", { id: titleId, class: "modal-title" }, props.title),
                h("button", { type: "button", class: "btn-close", "aria-label": props.closeLabel, "data-rg-dismiss": "modal" }, "×")
              ])
            : null,
          h("div", { id: bodyId, class: `modal-body ${props.bodyClassName}`.trim() }, slots.default ? slots.default() : []),
          slots.footer
            ? h("div", { class: `modal-footer ${props.footerClassName}`.trim() }, slots.footer())
            : null
        ])
      ]
    );
  }
});

const RarogOffcanvas = defineComponent({
  name: "RarogOffcanvas",
  props: {
    id: { type: String, default: "" },
    title: { type: String, default: "" },
    placement: { type: String, default: "start" },
    closeLabel: { type: String, default: "Close" },
    className: { type: String, default: "" },
    headerClassName: { type: String, default: "" },
    bodyClassName: { type: String, default: "" },
    options: { type: Object, default: () => ({}) },
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false }
  },
  emits: ["show", "shown", "hide", "hidden", "open", "close", "update:open"],
  setup(props, { slots, expose, attrs, emit }) {
    const { el, instance } = useOffcanvas(props.options);
    const id = createResolvedId("rg-offcanvas", props.id);
    const titleId = `${id}-title`;
    const bodyId = `${id}-body`;
    const placementClass = props.placement === "end" ? "offcanvas-end" : props.placement === "bottom" ? "offcanvas-bottom" : "";
    let detach = () => {};

    onMounted(() => {
      if (!canUseDOM || !el.value) return;
      detach = attachLifecycleListeners(el.value, "offcanvas", {
        onShow: event => emit("show", event),
        onShown: event => {
          emit("shown", event);
          emit("open", event);
          emit("update:open", true);
        },
        onHide: event => emit("hide", event),
        onHidden: event => {
          emit("hidden", event);
          emit("close", event);
          emit("update:open", false);
        }
      });
      if (props.defaultOpen && instance.value && typeof instance.value.show === "function") instance.value.show();
    });

    watch(() => props.open, value => {
      if (!instance.value || value == null) return;
      if (value && typeof instance.value.show === "function") instance.value.show();
      if (!value && typeof instance.value.hide === "function") instance.value.hide();
    });

    onBeforeUnmount(() => {
      detach();
    });

    expose({
      element: el,
      instance,
      show: () => instance.value && instance.value.show && instance.value.show(),
      hide: () => instance.value && instance.value.hide && instance.value.hide(),
      toggle: () => instance.value && instance.value.toggle && instance.value.toggle(),
      dispose: () => teardownInstance(instance.value),
      destroy: () => teardownInstance(instance.value)
    });
    return () => h(
      "aside",
      {
        ...attrs,
        id,
        ref: el,
        class: `offcanvas ${placementClass} ${props.className}`.trim(),
        role: "dialog",
        "aria-modal": "true",
        "aria-hidden": "true",
        "aria-labelledby": props.title || slots.header ? titleId : undefined,
        "aria-describedby": bodyId
      },
      [
        h("div", { class: `offcanvas-header ${props.headerClassName}`.trim() }, [
          slots.header ? slots.header() : props.title ? h("h2", { id: titleId, class: "offcanvas-title" }, props.title) : null,
          h("button", { type: "button", class: "btn-close", "aria-label": props.closeLabel, "data-rg-dismiss": "offcanvas" }, "×")
        ]),
        h("div", { id: bodyId, class: `offcanvas-body ${props.bodyClassName}`.trim() }, slots.default ? slots.default() : [])
      ]
    );
  }
});

const RarogDropdown = defineComponent({
  name: "RarogDropdown",
  props: {
    label: { type: String, default: "Toggle dropdown" },
    menuId: { type: String, default: "" },
    className: { type: String, default: "" },
    buttonClassName: { type: String, default: "btn btn-secondary dropdown-toggle" },
    menuClassName: { type: String, default: "dropdown-menu" },
    align: { type: String, default: "start" },
    options: { type: Object, default: () => ({}) },
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false }
  },
  emits: ["show", "shown", "hide", "hidden", "open", "close", "update:open"],
  setup(props, { slots, attrs, expose, emit }) {
    const root = ref(null);
    const button = ref(null);
    const instance = ref(null);
    const menuId = createResolvedId("rg-dropdown", props.menuId);
    let detach = () => {};

    onMounted(() => {
      if (!canUseDOM || !button.value) return;
      instance.value = Dropdown.getOrCreate(button.value, props.options || {});
      detach = attachLifecycleListeners(button.value, "dropdown", {
        onShow: event => emit("show", event),
        onShown: event => {
          emit("shown", event);
          emit("open", event);
          emit("update:open", true);
        },
        onHide: event => emit("hide", event),
        onHidden: event => {
          emit("hidden", event);
          emit("close", event);
          emit("update:open", false);
        }
      });
      if (props.defaultOpen && instance.value && typeof instance.value.show === "function") instance.value.show();
    });

    watch(() => props.open, value => {
      if (!instance.value || value == null) return;
      if (value && typeof instance.value.show === "function") instance.value.show();
      if (!value && typeof instance.value.hide === "function") instance.value.hide();
    });

    onBeforeUnmount(() => {
      detach();
      teardownInstance(instance.value);
      instance.value = null;
    });

    expose({
      element: root,
      trigger: button,
      instance,
      show: () => instance.value && instance.value.show && instance.value.show(),
      hide: () => instance.value && instance.value.hide && instance.value.hide(),
      toggle: () => instance.value && instance.value.toggle && instance.value.toggle(),
      dispose: () => teardownInstance(instance.value),
      destroy: () => teardownInstance(instance.value)
    });

    return () => h(
      "div",
      { ...attrs, ref: root, class: `dropdown ${props.className}`.trim() },
      [
        h("button", {
          type: "button",
          ref: button,
          class: props.buttonClassName,
          "data-rg-target": `#${menuId}`,
          "aria-controls": menuId,
          "aria-haspopup": "menu"
        }, slots.label ? slots.label() : props.label),
        h("div", { id: menuId, class: `${props.menuClassName}${props.align === "end" ? " dropdown-menu-end" : ""}`.trim(), hidden: true, role: "menu", "aria-hidden": "true" }, slots.default ? slots.default() : [])
      ]
    );
  }
});

const rarogDirectiveMap = {
  modal: Modal,
  offcanvas: Offcanvas,
  dropdown: Dropdown
};

const RarogPlugin = {
  install(app) {
    app.component("RarogProvider", RarogProvider);
    app.component("RarogModal", RarogModal);
    app.component("RarogOffcanvas", RarogOffcanvas);
    app.component("RarogDropdown", RarogDropdown);
    app.directive("rarog", {
      mounted(el, binding) {
        if (!canUseDOM) return;
        const key = binding.arg || binding.value;
        const ComponentClass = rarogDirectiveMap[key];
        if (ComponentClass && typeof ComponentClass.getOrCreate === "function") {
          el.__rarogInstance = ComponentClass.getOrCreate(el, binding.modifiers || {});
        }
      },
      beforeUnmount(el) {
        teardownInstance(el.__rarogInstance);
        delete el.__rarogInstance;
      }
    });
  }
};

export {
  RarogPlugin,
  RarogProvider,
  RarogModal,
  RarogOffcanvas,
  RarogDropdown,
  useRarogInit,
  useModal,
  useOffcanvas,
  useDropdown,
  Rarog
};

export default RarogPlugin;
