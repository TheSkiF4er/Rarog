import { defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Rarog, { Dropdown, Modal, Offcanvas, dispose, init, reinit } from "@rarog/js";

function useRarogInit(ComponentClass, options) {
  const el = ref(null);
  const instance = ref(null);
  onMounted(() => {
    if (!el.value || !ComponentClass || typeof ComponentClass.getOrCreate !== "function") return;
    instance.value = ComponentClass.getOrCreate(el.value, options || {});
  });
  onBeforeUnmount(() => {
    if (instance.value && typeof instance.value.hide === "function") {
      instance.value.hide();
    }
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
    as: { type: String, default: "div" }
  },
  setup(props, { slots, attrs }) {
    const root = ref(null);
    onMounted(() => {
      if (root.value) init(root.value);
    });
    onBeforeUnmount(() => {
      if (root.value) dispose(root.value);
    });
    watch(
      () => slots.default && slots.default(),
      async () => {
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
    options: { type: Object, default: () => ({}) }
  },
  setup(props, { slots, expose, attrs }) {
    const { el, instance } = useModal(props.options);
    expose({
      element: el,
      show: () => instance.value && instance.value.show && instance.value.show(),
      hide: () => instance.value && instance.value.hide && instance.value.hide(),
      toggle: () => instance.value && instance.value.toggle && instance.value.toggle()
    });
    const id = props.id || `rg-modal-${Math.random().toString(36).slice(2, 10)}`;
    return () => h(
      "div",
      {
        ...attrs,
        id,
        ref: el,
        class: `modal ${props.className}`.trim(),
        role: "dialog",
        "aria-modal": "true",
        "aria-hidden": "true"
      },
      [
        h("div", { class: `modal-dialog ${props.dialogClassName}`.trim() }, [
          props.title || slots.header
            ? h("div", { class: `modal-header ${props.headerClassName}`.trim() }, [
                slots.header ? slots.header() : h("h2", { class: "modal-title" }, props.title),
                h("button", { type: "button", class: "btn-close", "aria-label": props.closeLabel, "data-rg-dismiss": "modal" }, "×")
              ])
            : null,
          h("div", { class: `modal-body ${props.bodyClassName}`.trim() }, slots.default ? slots.default() : []),
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
    options: { type: Object, default: () => ({}) }
  },
  setup(props, { slots, expose, attrs }) {
    const { el, instance } = useOffcanvas(props.options);
    expose({
      element: el,
      show: () => instance.value && instance.value.show && instance.value.show(),
      hide: () => instance.value && instance.value.hide && instance.value.hide(),
      toggle: () => instance.value && instance.value.toggle && instance.value.toggle()
    });
    const id = props.id || `rg-offcanvas-${Math.random().toString(36).slice(2, 10)}`;
    const placementClass = props.placement === "end" ? "offcanvas-end" : props.placement === "bottom" ? "offcanvas-bottom" : "";
    return () => h(
      "aside",
      {
        ...attrs,
        id,
        ref: el,
        class: `offcanvas ${placementClass} ${props.className}`.trim(),
        "aria-hidden": "true"
      },
      [
        h("div", { class: `offcanvas-header ${props.headerClassName}`.trim() }, [
          slots.header ? slots.header() : props.title ? h("h2", { class: "offcanvas-title" }, props.title) : null,
          h("button", { type: "button", class: "btn-close", "aria-label": props.closeLabel, "data-rg-dismiss": "offcanvas" }, "×")
        ]),
        h("div", { class: `offcanvas-body ${props.bodyClassName}`.trim() }, slots.default ? slots.default() : [])
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
    align: { type: String, default: "start" }
  },
  setup(props, { slots, attrs }) {
    const button = ref(null);
    const menuId = props.menuId || `rg-dropdown-${Math.random().toString(36).slice(2, 10)}`;
    onMounted(() => {
      if (button.value) Dropdown.getOrCreate(button.value);
    });
    return () => h(
      "div",
      { ...attrs, class: `dropdown ${props.className}`.trim() },
      [
        h("button", { type: "button", ref: button, class: props.buttonClassName, "data-rg-target": `#${menuId}` }, slots.label ? slots.label() : props.label),
        h("div", { id: menuId, class: `${props.menuClassName}${props.align === "end" ? " dropdown-menu-end" : ""}`.trim(), hidden: true }, slots.default ? slots.default() : [])
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
        const key = binding.arg || binding.value;
        const ComponentClass = rarogDirectiveMap[key];
        if (ComponentClass && typeof ComponentClass.getOrCreate === "function") {
          el.__rarogInstance = ComponentClass.getOrCreate(el, binding.modifiers || {});
        }
      },
      beforeUnmount(el) {
        if (el.__rarogInstance && typeof el.__rarogInstance.hide === "function") {
          el.__rarogInstance.hide();
        }
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
