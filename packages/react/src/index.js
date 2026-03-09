import React, {
  createElement,
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef
} from "react";
import Rarog, { Dropdown, Modal, Offcanvas, dispose, init, reinit } from "@rarog/js";

const canUseDOM = typeof window !== "undefined" && typeof document !== "undefined";

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
  }, [ComponentClass, eventPrefix]);

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
      className: `modal ${className}`.trim(),
      role: "dialog",
      "aria-modal": "true",
      "aria-hidden": "true",
      "aria-labelledby": title ? titleId : undefined,
      "aria-describedby": bodyId
    },
    createElement(
      "div",
      { className: `modal-dialog ${dialogClassName}`.trim() },
      title !== undefined && title !== null
        ? createElement(
            "div",
            { className: `modal-header ${headerClassName}`.trim() },
            createElement("h2", { id: titleId, className: "modal-title" }, title),
            createElement(
              "button",
              { type: "button", className: "btn-close", "aria-label": closeLabel, "data-rg-dismiss": "modal" },
              "×"
            )
          )
        : null,
      createElement("div", { id: bodyId, className: `modal-body ${bodyClassName}`.trim() }, children),
      footer
        ? createElement("div", { className: `modal-footer ${footerClassName}`.trim() }, footer)
        : null
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
  const panelId = useResolvedId(id, "rg-offcanvas");
  const titleId = `${panelId}-title`;
  const bodyId = `${panelId}-body`;
  const { ref, instance, api } = useOffcanvas(options, { open, defaultOpen, onOpen, onClose, onShow, onShown, onHide, onHidden });
  const placementClass = placement === "end" ? "offcanvas-end" : placement === "bottom" ? "offcanvas-bottom" : "";

  useImperativeHandle(forwardedRef, () => ({ element: ref.current, instance: instance.current, ...api }), [api]);

  return createElement(
    "aside",
    {
      ...domProps,
      id: panelId,
      ref,
      className: `offcanvas ${placementClass} ${className}`.trim(),
      role: "dialog",
      "aria-modal": "true",
      "aria-hidden": "true",
      "aria-labelledby": title ? titleId : undefined,
      "aria-describedby": bodyId
    },
    createElement(
      "div",
      { className: `offcanvas-header ${headerClassName}`.trim() },
      title ? createElement("h2", { id: titleId, className: "offcanvas-title" }, title) : null,
      createElement(
        "button",
        { type: "button", className: "btn-close", "aria-label": closeLabel, "data-rg-dismiss": "offcanvas" },
        "×"
      )
    ),
    createElement("div", { id: bodyId, className: `offcanvas-body ${bodyClassName}`.trim() }, children)
  );
});

const RarogDropdown = forwardRef(function RarogDropdown(
  {
    label = "Toggle dropdown",
    children,
    menuId,
    className = "",
    buttonClassName = "btn btn-secondary dropdown-toggle",
    menuClassName = "dropdown-menu",
    align = "start",
    buttonProps,
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
  const buttonRef = useRef(null);
  const [, attachRef] = useCombinedRef(forwardedRef);
  const resolvedMenuId = useResolvedId(menuId, "rg-dropdown");
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
    { ...domProps, className: `dropdown ${className}`.trim(), ref: attachRef },
    createElement(
      "button",
      {
        type: "button",
        ...buttonProps,
        ref: buttonRef,
        className: `${buttonClassName}${buttonProps && buttonProps.className ? ` ${buttonProps.className}` : ""}`.trim(),
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
        className: `${menuClassName}${align === "end" ? " dropdown-menu-end" : ""}`.trim(),
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
  RarogModal,
  RarogOffcanvas,
  RarogDropdown,
  useRarogInit,
  useModal,
  useOffcanvas,
  useDropdown,
  Rarog
};

export default {
  RarogProvider,
  RarogModal,
  RarogOffcanvas,
  RarogDropdown,
  useRarogInit,
  useModal,
  useOffcanvas,
  useDropdown
};
