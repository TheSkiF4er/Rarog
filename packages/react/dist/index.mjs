import React, {
  Children,
  cloneElement,
  createElement,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import Rarog, { Collapse, Dropdown, Modal, Offcanvas, Tooltip, dispose, init, reinit } from "@rarog/js";

const canUseDOM = typeof window !== "undefined" && typeof document !== "undefined";

function cx(...parts) {
  return parts.filter(Boolean).join(" ").trim();
}

function setRef(ref, value) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
  } else {
    ref.current = value;
  }
}

function useCombinedRef(forwardedRef) {
  const innerRef = useRef(null);
  useImperativeHandle(forwardedRef, () => innerRef.current, []);
  return [innerRef, value => {
    innerRef.current = value;
    setRef(forwardedRef, value);
  }];
}

function useLatest(value) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

function useControllableState(controlledValue, defaultValue, onChange) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const setValue = nextValue => {
    const resolved = typeof nextValue === "function" ? nextValue(value) : nextValue;
    if (!isControlled) setInternalValue(resolved);
    if (onChange) onChange(resolved);
  };
  return [value, setValue];
}

function useResolvedId(providedId, prefix) {
  const reactId = useId();
  return useMemo(() => providedId || `${prefix}-${reactId.replace(/[:]/g, "")}`, [providedId, prefix, reactId]);
}

function getInstanceMethods(instanceRef) {
  return {
    show: () => instanceRef.current && instanceRef.current.show && instanceRef.current.show(),
    hide: () => instanceRef.current && instanceRef.current.hide && instanceRef.current.hide(),
    toggle: () => instanceRef.current && instanceRef.current.toggle && instanceRef.current.toggle(),
    dispose: () => {
      if (!instanceRef.current) return;
      if (typeof instanceRef.current.dispose === "function") instanceRef.current.dispose();
      else if (typeof instanceRef.current.destroy === "function") instanceRef.current.destroy();
    },
    destroy: () => {
      if (!instanceRef.current) return;
      if (typeof instanceRef.current.destroy === "function") instanceRef.current.destroy();
      else if (typeof instanceRef.current.dispose === "function") instanceRef.current.dispose();
    }
  };
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

function useRarogController(ComponentClass, eventPrefix, options, lifecycle = {}) {
  const ref = useRef(null);
  const instanceRef = useRef(null);
  const latest = useLatest(lifecycle);

  useEffect(() => {
    if (!canUseDOM || !ref.current || !ComponentClass || typeof ComponentClass.getOrCreate !== "function") return undefined;
    const element = ref.current;
    instanceRef.current = ComponentClass.getOrCreate(element, options || {});
    const detach = attachLifecycleListeners(element, eventPrefix, {
      onShow: event => latest.current.onShow && latest.current.onShow(event),
      onShown: event => {
        if (latest.current.onShown) latest.current.onShown(event);
        if (latest.current.onOpen) latest.current.onOpen(event);
      },
      onHide: event => latest.current.onHide && latest.current.onHide(event),
      onHidden: event => {
        if (latest.current.onHidden) latest.current.onHidden(event);
        if (latest.current.onClose) latest.current.onClose(event);
      }
    });

    if (lifecycle.defaultOpen && typeof instanceRef.current.show === "function") {
      instanceRef.current.show();
    }

    return () => {
      detach();
      if (!instanceRef.current) return;
      if (typeof instanceRef.current.dispose === "function") instanceRef.current.dispose();
      else if (typeof instanceRef.current.destroy === "function") instanceRef.current.destroy();
      else if (typeof instanceRef.current.hide === "function") instanceRef.current.hide();
      instanceRef.current = null;
    };
  }, [ComponentClass, eventPrefix, options, lifecycle.defaultOpen]);

  useEffect(() => {
    if (!instanceRef.current || lifecycle.open == null) return;
    if (lifecycle.open) {
      if (typeof instanceRef.current.show === "function") instanceRef.current.show();
    } else if (typeof instanceRef.current.hide === "function") {
      instanceRef.current.hide();
    }
  }, [lifecycle.open]);

  return { ref, instance: instanceRef, api: getInstanceMethods(instanceRef) };
}

function useRarogInit(ComponentClass, options) {
  return useRarogController(ComponentClass, "", options, {});
}

function useModal(options, lifecycle) {
  return useRarogController(Modal, "modal", options, lifecycle || {});
}

function useOffcanvas(options, lifecycle) {
  return useRarogController(Offcanvas, "offcanvas", options, lifecycle || {});
}

function useDropdown(options, lifecycle) {
  return useRarogController(Dropdown, "dropdown", options, lifecycle || {});
}

function useTooltip(options, lifecycle) {
  return useRarogController(Tooltip, "tooltip", options, lifecycle || {});
}

function useCollapse(options, lifecycle) {
  return useRarogController(Collapse, "collapse", options, lifecycle || {});
}

const RarogProvider = forwardRef(function RarogProvider(
  { as = "div", autoInit = true, reinitOnChildrenChange = true, children, ...props },
  forwardedRef
) {
  const [rootRef, attachRef] = useCombinedRef(forwardedRef);

  useEffect(() => {
    if (!canUseDOM || !autoInit || !rootRef.current) return undefined;
    init(rootRef.current);
    return () => dispose(rootRef.current);
  }, [autoInit]);

  useEffect(() => {
    if (!canUseDOM || !autoInit || !reinitOnChildrenChange || !rootRef.current) return;
    reinit(rootRef.current);
  }, [autoInit, reinitOnChildrenChange, children]);

  return createElement(as, { ...props, ref: attachRef }, children);
});

const RarogButton = forwardRef(function RarogButton(
  { as = "button", variant = "primary", size = "md", className = "", children, ...props },
  forwardedRef
) {
  const variantClass = variant === "secondary" ? "btn-secondary" : variant === "outline" ? "btn-outline" : "btn-primary";
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
  return createElement(as, { ...props, ref: forwardedRef, className: cx("btn", variantClass, sizeClass, className) }, children);
});

const RarogInput = forwardRef(function RarogInput({ className = "", invalid = false, ...props }, forwardedRef) {
  return createElement("input", { ...props, ref: forwardedRef, className: cx("input", invalid && "is-invalid", className) });
});

const RarogTextarea = forwardRef(function RarogTextarea({ className = "", invalid = false, ...props }, forwardedRef) {
  return createElement("textarea", { ...props, ref: forwardedRef, className: cx("form-control", invalid && "is-invalid", className) });
});

const RarogSelectField = forwardRef(function RarogSelectField({ className = "", invalid = false, children, ...props }, forwardedRef) {
  return createElement("select", { ...props, ref: forwardedRef, className: cx("form-control", invalid && "is-invalid", className) }, children);
});

const RarogCheckbox = forwardRef(function RarogCheckbox(
  { label, description, className = "", inputClassName = "", ...props },
  forwardedRef
) {
  return createElement(
    "label",
    { className: cx("field", className) },
    createElement("span", { className: "d-inline-flex align-items-center gap-2" }, [
      createElement("input", { key: "input", ...props, ref: forwardedRef, type: "checkbox", className: inputClassName }),
      label ? createElement("span", { key: "label" }, label) : null
    ]),
    description ? createElement("span", { className: "form-help d-block" }, description) : null
  );
});

const RarogRadio = forwardRef(function RarogRadio(
  { label, description, className = "", inputClassName = "", ...props },
  forwardedRef
) {
  return createElement(
    "label",
    { className: cx("field", className) },
    createElement("span", { className: "d-inline-flex align-items-center gap-2" }, [
      createElement("input", { key: "input", ...props, ref: forwardedRef, type: "radio", className: inputClassName }),
      label ? createElement("span", { key: "label" }, label) : null
    ]),
    description ? createElement("span", { className: "form-help d-block" }, description) : null
  );
});

const RarogSwitch = forwardRef(function RarogSwitch(
  { checked, defaultChecked = false, onCheckedChange, label, className = "", disabled = false, ...props },
  forwardedRef
) {
  const [active, setActive] = useControllableState(checked, defaultChecked, onCheckedChange);
  return createElement(
    "button",
    {
      ...props,
      ref: forwardedRef,
      type: "button",
      role: "switch",
      "aria-checked": active,
      disabled,
      className: cx("btn", active ? "btn-primary" : "btn-outline", className),
      onClick: event => {
        if (disabled) return;
        setActive(!active);
        if (props.onClick) props.onClick(event);
      }
    },
    label || (active ? "On" : "Off")
  );
});

const RarogCard = forwardRef(function RarogCard(
  { title, subtitle, footer, className = "", headerClassName = "", bodyClassName = "", footerClassName = "", children, ...props },
  forwardedRef
) {
  return createElement("article", { ...props, ref: forwardedRef, className: cx("card", className) }, [
    title || subtitle
      ? createElement("div", { key: "header", className: cx("card-header", headerClassName) }, [
          title ? createElement("div", { key: "title", className: "fw-semibold" }, title) : null,
          subtitle ? createElement("div", { key: "subtitle", className: "text-muted" }, subtitle) : null
        ])
      : null,
    createElement("div", { key: "body", className: bodyClassName || undefined }, children),
    footer ? createElement("div", { key: "footer", className: cx("card-footer", footerClassName) }, footer) : null
  ]);
});

const RarogAlert = forwardRef(function RarogAlert(
  { tone = "info", title, className = "", children, ...props },
  forwardedRef
) {
  const toneClass = tone === "success" ? "alert-success" : tone === "warning" ? "alert-warning" : tone === "danger" ? "alert-danger" : "alert-info";
  return createElement("div", { ...props, ref: forwardedRef, className: cx("alert", toneClass, className), role: "status" }, [
    title ? createElement("div", { key: "title", className: "alert-title" }, title) : null,
    createElement("div", { key: "body", className: title ? "alert-description" : undefined }, children)
  ]);
});

const RarogBadge = forwardRef(function RarogBadge(
  { tone = "primary", outline = false, className = "", children, ...props },
  forwardedRef
) {
  const toneClass = tone === "secondary" ? "badge-secondary" : "badge-primary";
  return createElement("span", { ...props, ref: forwardedRef, className: cx("badge", toneClass, outline && "badge-outline", className) }, children);
});

const RarogSpinner = forwardRef(function RarogSpinner(
  { label = "Loading", size = 16, className = "", ...props },
  forwardedRef
) {
  return createElement("span", {
    ...props,
    ref: forwardedRef,
    className: cx(className),
    role: "status",
    "aria-label": label,
    style: {
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: "999px",
      border: "2px solid currentColor",
      borderRightColor: "transparent",
      animation: "rg-spin 0.8s linear infinite",
      ...(props.style || {})
    }
  });
});

const RarogSkeleton = forwardRef(function RarogSkeleton(
  { width = "100%", height = "1rem", radius = "0.5rem", className = "", ...props },
  forwardedRef
) {
  return createElement("span", {
    ...props,
    ref: forwardedRef,
    className,
    "aria-hidden": "true",
    style: {
      display: "block",
      width,
      height,
      borderRadius: radius,
      background: "linear-gradient(90deg, rgba(148,163,184,0.12) 0%, rgba(148,163,184,0.28) 50%, rgba(148,163,184,0.12) 100%)",
      backgroundSize: "200% 100%",
      animation: "rg-skeleton 1.4s ease infinite",
      ...(props.style || {})
    }
  });
});

const RarogTabs = forwardRef(function RarogTabs(
  { items = [], value, defaultValue, onValueChange, className = "", listClassName = "", panelClassName = "", ...props },
  forwardedRef
) {
  const fallbackValue = items[0] ? items[0].value : undefined;
  const [current, setCurrent] = useControllableState(value, defaultValue || fallbackValue, onValueChange);
  const activeItem = items.find(item => item.value === current) || items[0];
  return createElement("div", { ...props, ref: forwardedRef, className }, [
    createElement("div", { key: "list", className: cx("nav nav-tabs", listClassName), role: "tablist" },
      items.map(item => createElement("button", {
        key: item.value,
        type: "button",
        role: "tab",
        className: cx("nav-link", current === item.value && "nav-link-active"),
        "aria-selected": current === item.value,
        onClick: () => setCurrent(item.value)
      }, item.label))
    ),
    activeItem
      ? createElement("div", { key: "panel", role: "tabpanel", className: panelClassName || "pt-3" }, activeItem.content)
      : null
  ]);
});

const RarogAccordion = forwardRef(function RarogAccordion(
  { items = [], value, defaultValue, onValueChange, className = "", itemClassName = "", ...props },
  forwardedRef
) {
  const [current, setCurrent] = useControllableState(value, defaultValue || null, onValueChange);
  return createElement("div", { ...props, ref: forwardedRef, className },
    items.map(item => {
      const open = current === item.value;
      return createElement("section", { key: item.value, className: cx("card", itemClassName) }, [
        createElement("button", {
          key: "button",
          type: "button",
          className: "card-header text-start w-full",
          "aria-expanded": open,
          onClick: () => setCurrent(open ? null : item.value)
        }, item.label),
        open ? createElement("div", { key: "panel", className: "p-4" }, item.content) : null
      ]);
    })
  );
});

const RarogTooltip = forwardRef(function RarogTooltip(
  { label, title, options, className = "", children, defaultOpen = false, open, onOpen, onClose, ...props },
  forwardedRef
) {
  const { ref, instance, api } = useTooltip(options, { defaultOpen, open, onOpen, onClose });
  useImperativeHandle(forwardedRef, () => ({ element: ref.current, instance: instance.current, ...api }), [api]);

  if (isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      ref,
      className: cx(children.props.className, className),
      "data-rg-title": title,
      "aria-label": children.props["aria-label"] || title
    });
  }

  return createElement("button", {
    ...props,
    ref,
    type: "button",
    className: cx("btn btn-outline", className),
    "data-rg-title": title,
    "aria-label": title
  }, children || label || title);
});

const RarogModal = forwardRef(function RarogModal(
  {
    id,
    title,
    children,
    footer = null,
    closeLabel = "Close",
    className = "",
    dialogClassName = "",
    headerClassName = "",
    bodyClassName = "",
    footerClassName = "",
    open,
    defaultOpen = false,
    options,
    onOpen,
    onClose,
    onShow,
    onShown,
    onHide,
    onHidden,
    ...domProps
  },
  forwardedRef
) {
  const modalId = useResolvedId(id, "rg-modal");
  const titleId = `${modalId}-title`;
  const bodyId = `${modalId}-body`;
  const { ref, instance, api } = useModal(options, { open, defaultOpen, onOpen, onClose, onShow, onShown, onHide, onHidden });

  useImperativeHandle(forwardedRef, () => ({ element: ref.current, instance: instance.current, ...api }), [api]);

  return createElement(
    "div",
    {
      ...domProps,
      id: modalId,
      ref,
      className: cx("modal", className),
      role: "dialog",
      "aria-modal": "true",
      "aria-hidden": "true",
      "aria-labelledby": title ? titleId : undefined,
      "aria-describedby": bodyId
    },
    createElement(
      "div",
      { className: cx("modal-dialog", dialogClassName) },
      createElement("div", { className: "modal-content" }, [
        title !== undefined && title !== null
          ? createElement(
              "div",
              { key: "header", className: cx("modal-header", headerClassName) },
              createElement("h2", { id: titleId, className: "modal-title" }, title),
              createElement(
                "button",
                {
                  type: "button",
                  className: "btn-close",
                  "aria-label": closeLabel,
                  "data-rg-dismiss": "modal"
                },
                "×"
              )
            )
          : null,
        createElement("div", { key: "body", id: bodyId, className: cx("modal-body", bodyClassName) }, children),
        footer !== null ? createElement("div", { key: "footer", className: cx("modal-footer", footerClassName) }, footer) : null
      ])
    )
  );
});

const RarogOffcanvas = forwardRef(function RarogOffcanvas(
  {
    id,
    title,
    children,
    placement = "start",
    closeLabel = "Close",
    className = "",
    headerClassName = "",
    bodyClassName = "",
    open,
    defaultOpen = false,
    options,
    onOpen,
    onClose,
    onShow,
    onShown,
    onHide,
    onHidden,
    ...domProps
  },
  forwardedRef
) {
  const offcanvasId = useResolvedId(id, "rg-offcanvas");
  const titleId = `${offcanvasId}-title`;
  const bodyId = `${offcanvasId}-body`;
  const placementClass = placement === "end" ? "offcanvas-end" : placement === "bottom" ? "offcanvas-bottom" : "";
  const { ref, instance, api } = useOffcanvas(options, { open, defaultOpen, onOpen, onClose, onShow, onShown, onHide, onHidden });

  useImperativeHandle(forwardedRef, () => ({ element: ref.current, instance: instance.current, ...api }), [api]);

  return createElement("div", {
    ...domProps,
    id: offcanvasId,
    ref,
    className: cx("offcanvas", placementClass, className),
    tabIndex: -1,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": title ? titleId : undefined,
    "aria-describedby": bodyId
  }, [
    title !== undefined && title !== null
      ? createElement("div", { key: "header", className: cx("offcanvas-header", headerClassName) }, [
          createElement("h2", { key: "title", id: titleId, className: "offcanvas-title" }, title),
          createElement("button", {
            key: "close",
            type: "button",
            className: "btn-close",
            "aria-label": closeLabel,
            "data-rg-dismiss": "offcanvas"
          }, "×")
        ])
      : null,
    createElement("div", { key: "body", id: bodyId, className: cx("offcanvas-body", bodyClassName) }, children)
  ]);
});

const RarogDropdown = forwardRef(function RarogDropdown(
  {
    label = "Toggle menu",
    menuId,
    className = "",
    buttonClassName = "btn btn-primary dropdown-toggle",
    menuClassName = "dropdown-menu",
    align = "start",
    options,
    open,
    defaultOpen = false,
    onOpen,
    onClose,
    onShow,
    onShown,
    onHide,
    onHidden,
    buttonProps,
    children,
    ...domProps
  },
  forwardedRef
) {
  const resolvedMenuId = useResolvedId(menuId, "rg-dropdown-menu");
  const buttonRef = useRef(null);
  const [rootRef, attachRef] = useCombinedRef(forwardedRef);
  const instanceRef = useRef(null);
  const latest = useLatest({ onOpen, onClose, onShow, onShown, onHide, onHidden });

  useEffect(() => {
    if (!canUseDOM || !buttonRef.current) return undefined;
    const button = buttonRef.current;
    instanceRef.current = Dropdown.getOrCreate(button, options || {});
    const detach = attachLifecycleListeners(button, "dropdown", {
      onShow: event => latest.current.onShow && latest.current.onShow(event),
      onShown: event => {
        if (latest.current.onShown) latest.current.onShown(event);
        if (latest.current.onOpen) latest.current.onOpen(event);
      },
      onHide: event => latest.current.onHide && latest.current.onHide(event),
      onHidden: event => {
        if (latest.current.onHidden) latest.current.onHidden(event);
        if (latest.current.onClose) latest.current.onClose(event);
      }
    });
    if (defaultOpen && instanceRef.current && typeof instanceRef.current.show === "function") {
      instanceRef.current.show();
    }
    return () => {
      detach();
      if (!instanceRef.current) return;
      if (typeof instanceRef.current.dispose === "function") instanceRef.current.dispose();
      else if (typeof instanceRef.current.destroy === "function") instanceRef.current.destroy();
      else if (typeof instanceRef.current.hide === "function") instanceRef.current.hide();
      instanceRef.current = null;
    };
  }, [defaultOpen, options]);

  useEffect(() => {
    if (!instanceRef.current || open == null) return;
    if (open && typeof instanceRef.current.show === "function") instanceRef.current.show();
    if (!open && typeof instanceRef.current.hide === "function") instanceRef.current.hide();
  }, [open]);

  useImperativeHandle(forwardedRef, () => ({
    element: buttonRef.current,
    instance: instanceRef.current,
    ...getInstanceMethods(instanceRef)
  }), []);

  return createElement(
    "div",
    { ...domProps, className: cx("dropdown", className), ref: attachRef },
    createElement(
      "button",
      {
        type: "button",
        ...buttonProps,
        ref: buttonRef,
        className: cx(buttonClassName, buttonProps && buttonProps.className),
        "data-rg-target": `#${resolvedMenuId}`,
        "aria-controls": resolvedMenuId,
        "aria-haspopup": "menu"
      },
      label
    ),
    createElement(
      "div",
      {
        id: resolvedMenuId,
        className: cx(menuClassName, align === "end" && "dropdown-menu-end"),
        hidden: true,
        role: "menu",
        "aria-hidden": "true"
      },
      children
    )
  );
});

export {
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

export default {
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
  useCollapse
};
