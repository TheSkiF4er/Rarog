import React, {
  createElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from "react";
import Rarog, { Dropdown, Modal, Offcanvas, dispose, init, reinit } from "@rarog/js";

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

function useRarogInit(ComponentClass, options) {
  const ref = useRef(null);
  const instanceRef = useRef(null);
  useEffect(() => {
    if (!ref.current || !ComponentClass || typeof ComponentClass.getOrCreate !== "function") return;
    instanceRef.current = ComponentClass.getOrCreate(ref.current, options || {});
    return () => {
      if (instanceRef.current && typeof instanceRef.current.hide === "function") {
        instanceRef.current.hide();
      }
    };
  }, [ComponentClass, options]);
  return { ref, instance: instanceRef };
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

const RarogProvider = forwardRef(function RarogProvider(
  { as = "div", children, ...props },
  forwardedRef
) {
  const [rootRef, attachRef] = useCombinedRef(forwardedRef);
  useEffect(() => {
    if (!rootRef.current) return;
    init(rootRef.current);
    return () => dispose(rootRef.current);
  }, []);
  useEffect(() => {
    if (!rootRef.current) return;
    reinit(rootRef.current);
  }, [children]);
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
    ...props
  },
  forwardedRef
) {
  const modalId = useMemo(() => id || `rg-modal-${Math.random().toString(36).slice(2, 10)}`, [id]);
  const { ref, instance } = useModal(props.options);
  useImperativeHandle(forwardedRef, () => ({
    element: ref.current,
    show: () => instance.current && instance.current.show && instance.current.show(),
    hide: () => instance.current && instance.current.hide && instance.current.hide(),
    toggle: () => instance.current && instance.current.toggle && instance.current.toggle()
  }), []);
  return createElement(
    "div",
    {
      ...props,
      id: modalId,
      ref,
      className: `modal ${className}`.trim(),
      role: "dialog",
      "aria-modal": "true",
      "aria-hidden": "true"
    },
    createElement(
      "div",
      { className: `modal-dialog ${dialogClassName}`.trim() },
      title !== undefined && title !== null
        ? createElement(
            "div",
            { className: `modal-header ${headerClassName}`.trim() },
            createElement("h2", { className: "modal-title" }, title),
            createElement(
              "button",
              { type: "button", className: "btn-close", "aria-label": closeLabel, "data-rg-dismiss": "modal" },
              "×"
            )
          )
        : null,
      createElement("div", { className: `modal-body ${bodyClassName}`.trim() }, children),
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
    ...props
  },
  forwardedRef
) {
  const panelId = useMemo(() => id || `rg-offcanvas-${Math.random().toString(36).slice(2, 10)}`, [id]);
  const { ref, instance } = useOffcanvas(props.options);
  const placementClass = placement === "end" ? "offcanvas-end" : placement === "bottom" ? "offcanvas-bottom" : "";
  useImperativeHandle(forwardedRef, () => ({
    element: ref.current,
    show: () => instance.current && instance.current.show && instance.current.show(),
    hide: () => instance.current && instance.current.hide && instance.current.hide(),
    toggle: () => instance.current && instance.current.toggle && instance.current.toggle()
  }), []);
  return createElement(
    "aside",
    {
      ...props,
      id: panelId,
      ref,
      className: `offcanvas ${placementClass} ${className}`.trim(),
      "aria-hidden": "true"
    },
    createElement(
      "div",
      { className: `offcanvas-header ${headerClassName}`.trim() },
      title ? createElement("h2", { className: "offcanvas-title" }, title) : null,
      createElement(
        "button",
        { type: "button", className: "btn-close", "aria-label": closeLabel, "data-rg-dismiss": "offcanvas" },
        "×"
      )
    ),
    createElement("div", { className: `offcanvas-body ${bodyClassName}`.trim() }, children)
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
    ...props
  },
  forwardedRef
) {
  const buttonRef = useRef(null);
  const [, attachRef] = useCombinedRef(forwardedRef);
  const resolvedMenuId = useMemo(() => menuId || `rg-dropdown-${Math.random().toString(36).slice(2, 10)}`, [menuId]);
  useEffect(() => {
    if (!buttonRef.current) return;
    const instance = Dropdown.getOrCreate(buttonRef.current);
    return () => {
      if (instance && typeof instance.hide === "function") instance.hide();
    };
  }, []);
  return createElement(
    "div",
    { ...props, className: `dropdown ${className}`.trim(), ref: attachRef },
    createElement(
      "button",
      {
        type: "button",
        ref: buttonRef,
        className: buttonClassName,
        "data-rg-target": `#${resolvedMenuId}`
      },
      label
    ),
    createElement(
      "div",
      {
        id: resolvedMenuId,
        className: `${menuClassName}${align === "end" ? " dropdown-menu-end" : ""}`.trim(),
        hidden: true
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
