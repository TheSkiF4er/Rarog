import {
  computed,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from "vue";
import Rarog, { Collapse, Dropdown, Modal, Offcanvas, Tooltip, dispose, init, reinit } from "@rarog/js";

const canUseDOM = typeof window !== "undefined" && typeof document !== "undefined";
let globalId = 0;

function cx(...parts) {
  return parts.filter(Boolean).join(" ").trim();
}

function createResolvedId(prefix, providedId = "") {
  globalId += 1;
  return providedId || `${prefix}-${globalId}`;
}

function attachLifecycleListeners(target, eventPrefix, handlers) {
  if (!target || !eventPrefix) return () => {};
  const entries = [
    ["show", handlers.onShow],
    ["shown", handlers.onShown],
    ["hide", handlers.onHide],
    ["hidden", handlers.onHidden]
  ].filter(([, fn]) => typeof fn === "function");

  const listeners = entries.map(([name, fn]) => {
    const eventName = `rg:${eventPrefix}:${name}`;
    const listener = event => fn(event);
    target.addEventListener(eventName, listener);
    return [eventName, listener];
  });

  return () => {
    listeners.forEach(([eventName, listener]) => target.removeEventListener(eventName, listener));
  };
}

function teardownInstance(instance) {
  if (!instance) return;
  if (typeof instance.dispose === "function") instance.dispose();
  else if (typeof instance.destroy === "function") instance.destroy();
}

function useRarogController(ComponentClass, options = {}) {
  const el = ref(null);
  const instance = ref(null);

  onMounted(() => {
    if (!canUseDOM || !el.value || !ComponentClass || typeof ComponentClass.getOrCreate !== "function") return;
    instance.value = ComponentClass.getOrCreate(el.value, options);
  });

  onBeforeUnmount(() => {
    teardownInstance(instance.value);
    instance.value = null;
  });

  return { el, instance };
}

function useRarogInit(ComponentClass, options) {
  return useRarogController(ComponentClass, options);
}

function useModal(options) {
  return useRarogController(Modal, options);
}

function useOffcanvas(options) {
  return useRarogController(Offcanvas, options);
}

function useDropdown(options) {
  return useRarogController(Dropdown, options);
}

function useTooltip(options) {
  return useRarogController(Tooltip, options);
}

function useCollapse(options) {
  return useRarogController(Collapse, options);
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

const RarogButton = defineComponent({
  name: "RarogButton",
  props: {
    as: { type: String, default: "button" },
    variant: { type: String, default: "primary" },
    size: { type: String, default: "md" }
  },
  setup(props, { slots, attrs }) {
    return () => h(props.as, {
      ...attrs,
      class: cx(
        "btn",
        props.variant === "secondary" ? "btn-secondary" : props.variant === "outline" ? "btn-outline" : "btn-primary",
        props.size === "sm" ? "btn-sm" : props.size === "lg" ? "btn-lg" : "",
        attrs.class
      )
    }, slots.default ? slots.default() : []);
  }
});

const RarogInput = defineComponent({
  name: "RarogInput",
  props: { invalid: { type: Boolean, default: false } },
  setup(props, { attrs }) {
    return () => h("input", { ...attrs, class: cx("input", props.invalid && "is-invalid", attrs.class) });
  }
});

const RarogTextarea = defineComponent({
  name: "RarogTextarea",
  props: { invalid: { type: Boolean, default: false } },
  setup(props, { attrs, slots }) {
    return () => h("textarea", { ...attrs, class: cx("form-control", props.invalid && "is-invalid", attrs.class) }, slots.default ? slots.default() : []);
  }
});

const RarogSelectField = defineComponent({
  name: "RarogSelectField",
  props: { invalid: { type: Boolean, default: false } },
  setup(props, { attrs, slots }) {
    return () => h("select", { ...attrs, class: cx("form-control", props.invalid && "is-invalid", attrs.class) }, slots.default ? slots.default() : []);
  }
});

const RarogCheckbox = defineComponent({
  name: "RarogCheckbox",
  props: {
    label: { type: String, default: "" },
    description: { type: String, default: "" },
    inputClassName: { type: String, default: "" }
  },
  setup(props, { attrs, slots }) {
    return () => h("label", { class: cx("field", attrs.class) }, [
      h("span", { class: "d-inline-flex align-items-center gap-2" }, [
        h("input", { ...attrs, type: "checkbox", class: props.inputClassName }),
        slots.label ? slots.label() : props.label ? h("span", null, props.label) : null
      ]),
      slots.description ? slots.description() : props.description ? h("span", { class: "form-help d-block" }, props.description) : null
    ]);
  }
});

const RarogRadio = defineComponent({
  name: "RarogRadio",
  props: {
    label: { type: String, default: "" },
    description: { type: String, default: "" },
    inputClassName: { type: String, default: "" }
  },
  setup(props, { attrs, slots }) {
    return () => h("label", { class: cx("field", attrs.class) }, [
      h("span", { class: "d-inline-flex align-items-center gap-2" }, [
        h("input", { ...attrs, type: "radio", class: props.inputClassName }),
        slots.label ? slots.label() : props.label ? h("span", null, props.label) : null
      ]),
      slots.description ? slots.description() : props.description ? h("span", { class: "form-help d-block" }, props.description) : null
    ]);
  }
});

const RarogSwitch = defineComponent({
  name: "RarogSwitch",
  props: {
    modelValue: { type: Boolean, default: undefined },
    defaultChecked: { type: Boolean, default: false },
    label: { type: String, default: "" },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { attrs, slots, emit }) {
    const innerValue = ref(props.defaultChecked);
    const checked = computed(() => props.modelValue === undefined ? innerValue.value : props.modelValue);
    const toggle = event => {
      if (props.disabled) return;
      const nextValue = !checked.value;
      innerValue.value = nextValue;
      emit("update:modelValue", nextValue);
      emit("change", nextValue);
      if (typeof attrs.onClick === "function") attrs.onClick(event);
    };
    return () => h("button", {
      ...attrs,
      type: "button",
      role: "switch",
      "aria-checked": checked.value,
      disabled: props.disabled,
      class: cx("btn", checked.value ? "btn-primary" : "btn-outline", attrs.class),
      onClick: toggle
    }, slots.default ? slots.default({ checked: checked.value }) : (props.label || (checked.value ? "On" : "Off")));
  }
});

const RarogCard = defineComponent({
  name: "RarogCard",
  props: {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    footer: { type: String, default: "" },
    headerClassName: { type: String, default: "" },
    bodyClassName: { type: String, default: "" },
    footerClassName: { type: String, default: "" }
  },
  setup(props, { attrs, slots }) {
    return () => h("article", { ...attrs, class: cx("card", attrs.class) }, [
      props.title || props.subtitle || slots.header
        ? h("div", { class: cx("card-header", props.headerClassName) }, slots.header ? slots.header() : [
            props.title ? h("div", { class: "fw-semibold" }, props.title) : null,
            props.subtitle ? h("div", { class: "text-muted" }, props.subtitle) : null
          ])
        : null,
      h("div", { class: props.bodyClassName || undefined }, slots.default ? slots.default() : []),
      slots.footer ? h("div", { class: cx("card-footer", props.footerClassName) }, slots.footer()) : props.footer ? h("div", { class: cx("card-footer", props.footerClassName) }, props.footer) : null
    ]);
  }
});

const RarogAlert = defineComponent({
  name: "RarogAlert",
  props: {
    tone: { type: String, default: "info" },
    title: { type: String, default: "" }
  },
  setup(props, { attrs, slots }) {
    return () => h("div", {
      ...attrs,
      class: cx(
        "alert",
        props.tone === "success" ? "alert-success" : props.tone === "warning" ? "alert-warning" : props.tone === "danger" ? "alert-danger" : "alert-info",
        attrs.class
      ),
      role: "status"
    }, [
      props.title ? h("div", { class: "alert-title" }, props.title) : null,
      h("div", { class: props.title ? "alert-description" : undefined }, slots.default ? slots.default() : [])
    ]);
  }
});

const RarogBadge = defineComponent({
  name: "RarogBadge",
  props: {
    tone: { type: String, default: "primary" },
    outline: { type: Boolean, default: false }
  },
  setup(props, { attrs, slots }) {
    return () => h("span", {
      ...attrs,
      class: cx("badge", props.tone === "secondary" ? "badge-secondary" : "badge-primary", props.outline && "badge-outline", attrs.class)
    }, slots.default ? slots.default() : []);
  }
});

const RarogSpinner = defineComponent({
  name: "RarogSpinner",
  props: {
    label: { type: String, default: "Loading" },
    size: { type: Number, default: 16 }
  },
  setup(props, { attrs }) {
    return () => h("span", {
      ...attrs,
      role: "status",
      "aria-label": props.label,
      style: {
        display: "inline-block",
        width: `${props.size}px`,
        height: `${props.size}px`,
        borderRadius: "999px",
        border: "2px solid currentColor",
        borderRightColor: "transparent",
        animation: "rg-spin 0.8s linear infinite",
        ...(attrs.style || {})
      }
    });
  }
});

const RarogSkeleton = defineComponent({
  name: "RarogSkeleton",
  props: {
    width: { type: [String, Number], default: "100%" },
    height: { type: [String, Number], default: "1rem" },
    radius: { type: [String, Number], default: "0.5rem" }
  },
  setup(props, { attrs }) {
    return () => h("span", {
      ...attrs,
      "aria-hidden": "true",
      style: {
        display: "block",
        width: typeof props.width === "number" ? `${props.width}px` : props.width,
        height: typeof props.height === "number" ? `${props.height}px` : props.height,
        borderRadius: typeof props.radius === "number" ? `${props.radius}px` : props.radius,
        background: "linear-gradient(90deg, rgba(148,163,184,0.12) 0%, rgba(148,163,184,0.28) 50%, rgba(148,163,184,0.12) 100%)",
        backgroundSize: "200% 100%",
        animation: "rg-skeleton 1.4s ease infinite",
        ...(attrs.style || {})
      }
    });
  }
});

const RarogTabs = defineComponent({
  name: "RarogTabs",
  props: {
    items: { type: Array, default: () => [] },
    modelValue: { type: String, default: undefined },
    defaultValue: { type: String, default: "" },
    listClassName: { type: String, default: "" },
    panelClassName: { type: String, default: "" }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { attrs }) {
    const initial = props.defaultValue || (props.items[0] ? props.items[0].value : "");
    const innerValue = ref(initial);
    const current = computed(() => props.modelValue === undefined ? innerValue.value : props.modelValue);
    const update = value => {
      innerValue.value = value;
      props.modelValue === undefined ? innerValue.value = value : null;
    };
    return () => {
      const activeItem = props.items.find(item => item.value === current.value) || props.items[0];
      return h("div", { ...attrs }, [
        h("div", { class: cx("nav nav-tabs", props.listClassName), role: "tablist" }, props.items.map(item => h("button", {
          key: item.value,
          type: "button",
          role: "tab",
          class: cx("nav-link", current.value === item.value && "nav-link-active"),
          "aria-selected": current.value === item.value,
          onClick: () => {
            innerValue.value = item.value;
            update(item.value);
          }
        }, item.label))),
        activeItem ? h("div", { role: "tabpanel", class: props.panelClassName || "pt-3" }, activeItem.content) : null
      ]);
    };
  }
});

const RarogAccordion = defineComponent({
  name: "RarogAccordion",
  props: {
    items: { type: Array, default: () => [] },
    modelValue: { type: String, default: undefined },
    defaultValue: { type: String, default: "" },
    itemClassName: { type: String, default: "" }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { attrs }) {
    const innerValue = ref(props.defaultValue || "");
    const current = computed(() => props.modelValue === undefined ? innerValue.value : props.modelValue);
    const setValue = value => {
      innerValue.value = value;
    };
    return () => h("div", { ...attrs }, props.items.map(item => {
      const open = current.value === item.value;
      return h("section", { key: item.value, class: cx("card", props.itemClassName) }, [
        h("button", {
          type: "button",
          class: "card-header text-start w-full",
          "aria-expanded": open,
          onClick: () => setValue(open ? "" : item.value)
        }, item.label),
        open ? h("div", { class: "p-4" }, item.content) : null
      ]);
    }));
  }
});

const RarogTooltip = defineComponent({
  name: "RarogTooltip",
  props: {
    title: { type: String, required: true },
    label: { type: String, default: "" },
    className: { type: String, default: "" },
    options: { type: Object, default: () => ({}) },
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false }
  },
  emits: ["show", "shown", "hide", "hidden", "open", "close"],
  setup(props, { slots, attrs, emit, expose }) {
    const { el, instance } = useTooltip(props.options);
    let detach = () => {};

    onMounted(() => {
      if (!canUseDOM || !el.value) return;
      detach = attachLifecycleListeners(el.value, "tooltip", {
        onShow: event => emit("show", event),
        onShown: event => {
          emit("shown", event);
          emit("open", event);
        },
        onHide: event => emit("hide", event),
        onHidden: event => {
          emit("hidden", event);
          emit("close", event);
        }
      });
      if (props.defaultOpen && instance.value && typeof instance.value.show === "function") instance.value.show();
    });

    watch(() => props.open, value => {
      if (!instance.value || value == null) return;
      if (value && typeof instance.value.show === "function") instance.value.show();
      if (!value && typeof instance.value.hide === "function") instance.value.hide();
    });

    onBeforeUnmount(() => detach());

    expose({
      element: el,
      instance,
      show: () => instance.value && instance.value.show && instance.value.show(),
      hide: () => instance.value && instance.value.hide && instance.value.hide(),
      toggle: () => instance.value && instance.value.toggle && instance.value.toggle(),
      dispose: () => teardownInstance(instance.value),
      destroy: () => teardownInstance(instance.value)
    });

    return () => h("button", {
      ...attrs,
      ref: el,
      type: "button",
      class: cx("btn btn-outline", props.className, attrs.class),
      "data-rg-title": props.title,
      "aria-label": props.title
    }, slots.default ? slots.default() : props.label || props.title);
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
        class: cx("modal", props.className, attrs.class),
        role: "dialog",
        "aria-modal": "true",
        "aria-hidden": "true",
        "aria-labelledby": props.title || slots.header ? titleId : undefined,
        "aria-describedby": bodyId
      },
      [
        h("div", { class: cx("modal-dialog", props.dialogClassName) }, [
          h("div", { class: "modal-content" }, [
            props.title || slots.header
              ? h("div", { class: cx("modal-header", props.headerClassName) }, [
                  slots.header ? slots.header() : h("h2", { id: titleId, class: "modal-title" }, props.title),
                  h("button", { type: "button", class: "btn-close", "aria-label": props.closeLabel, "data-rg-dismiss": "modal" }, "×")
                ])
              : null,
            h("div", { id: bodyId, class: cx("modal-body", props.bodyClassName) }, slots.default ? slots.default() : []),
            slots.footer
              ? h("div", { class: cx("modal-footer", props.footerClassName) }, slots.footer())
              : null
          ])
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

    return () => h("div", {
      ...attrs,
      id,
      ref: el,
      class: cx("offcanvas", placementClass, props.className, attrs.class),
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": props.title ? titleId : undefined,
      "aria-describedby": bodyId
    }, [
      props.title || slots.header
        ? h("div", { class: cx("offcanvas-header", props.headerClassName) }, [
            slots.header ? slots.header() : h("h2", { id: titleId, class: "offcanvas-title" }, props.title),
            h("button", { type: "button", class: "btn-close", "aria-label": props.closeLabel, "data-rg-dismiss": "offcanvas" }, "×")
          ])
        : null,
      h("div", { id: bodyId, class: cx("offcanvas-body", props.bodyClassName) }, slots.default ? slots.default() : [])
    ]);
  }
});

const RarogDropdown = defineComponent({
  name: "RarogDropdown",
  props: {
    label: { type: String, default: "Toggle menu" },
    menuId: { type: String, default: "" },
    className: { type: String, default: "" },
    buttonClassName: { type: String, default: "btn btn-primary dropdown-toggle" },
    menuClassName: { type: String, default: "dropdown-menu" },
    align: { type: String, default: "start" },
    options: { type: Object, default: () => ({}) },
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false }
  },
  emits: ["show", "shown", "hide", "hidden", "open", "close", "update:open"],
  setup(props, { slots, expose, attrs, emit }) {
    const root = ref(null);
    const button = ref(null);
    const instance = ref(null);
    const menuId = createResolvedId("rg-dropdown-menu", props.menuId);
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
    });

    expose({
      element: button,
      instance,
      show: () => instance.value && instance.value.show && instance.value.show(),
      hide: () => instance.value && instance.value.hide && instance.value.hide(),
      toggle: () => instance.value && instance.value.toggle && instance.value.toggle(),
      dispose: () => teardownInstance(instance.value),
      destroy: () => teardownInstance(instance.value)
    });

    return () => h(
      "div",
      { ...attrs, ref: root, class: cx("dropdown", props.className, attrs.class) },
      [
        h("button", {
          type: "button",
          ref: button,
          class: props.buttonClassName,
          "data-rg-target": `#${menuId}`,
          "aria-controls": menuId,
          "aria-haspopup": "menu"
        }, slots.label ? slots.label() : props.label),
        h("div", { id: menuId, class: cx(props.menuClassName, props.align === "end" && "dropdown-menu-end"), hidden: true, role: "menu", "aria-hidden": "true" }, slots.default ? slots.default() : [])
      ]
    );
  }
});

const rarogDirectiveMap = {
  modal: Modal,
  offcanvas: Offcanvas,
  dropdown: Dropdown,
  tooltip: Tooltip,
  collapse: Collapse
};

const RarogPlugin = {
  install(app) {
    app.component("RarogProvider", RarogProvider);
    app.component("RarogButton", RarogButton);
    app.component("RarogInput", RarogInput);
    app.component("RarogTextarea", RarogTextarea);
    app.component("RarogSelectField", RarogSelectField);
    app.component("RarogCheckbox", RarogCheckbox);
    app.component("RarogRadio", RarogRadio);
    app.component("RarogSwitch", RarogSwitch);
    app.component("RarogCard", RarogCard);
    app.component("RarogAlert", RarogAlert);
    app.component("RarogBadge", RarogBadge);
    app.component("RarogSpinner", RarogSpinner);
    app.component("RarogSkeleton", RarogSkeleton);
    app.component("RarogTabs", RarogTabs);
    app.component("RarogAccordion", RarogAccordion);
    app.component("RarogTooltip", RarogTooltip);
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
  RarogButton,
  RarogInput,
  RarogTextarea,
  RarogSelectField,
  RarogCheckbox,
  RarogRadio,
  RarogSwitch,
  RarogCard,
  RarogAlert,
  RarogBadge,
  RarogSpinner,
  RarogSkeleton,
  RarogTabs,
  RarogAccordion,
  RarogTooltip,
  RarogModal,
  RarogOffcanvas,
  RarogDropdown,
  useRarogInit,
  useModal,
  useOffcanvas,
  useDropdown,
  useTooltip,
  useCollapse,
  Rarog
};

export default RarogPlugin;
