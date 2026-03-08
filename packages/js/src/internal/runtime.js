const registries = {
  dropdownInstances: new WeakMap(),
  collapseInstances: new WeakMap(),
  modalInstances: new WeakMap(),
  offcanvasInstances: new WeakMap(),
  toastInstances: new WeakMap(),
  tooltipInstances: new WeakMap(),
  popoverInstances: new WeakMap(),
  datepickerInstances: new WeakMap(),
  datetimePickerInstances: new WeakMap(),
  selectInstances: new WeakMap(),
  comboboxInstances: new WeakMap(),
  tagsInputInstances: new WeakMap(),
  dataTableInstances: new WeakMap(),
  carouselInstances: new WeakMap(),
  stepperInstances: new WeakMap()
};

const maskHandlers = Object.create(null);
const eventBusListeners = new Map();

const RarogConfig = {
  debug:
    typeof window !== "undefined" &&
    !!(window.RAROG_DEBUG || window.RAROG_DEV || window.RAROG_DEBUG_MODE)
};

function debugLog(...args) {
  if (!RarogConfig.debug || typeof console === "undefined") return;
  console.log("[Rarog]", ...args);
}

function debugWarn(...args) {
  if (!RarogConfig.debug || typeof console === "undefined") return;
  console.warn("[Rarog]", ...args);
}

function emitOnBus(type, payload) {
  const set = eventBusListeners.get(type);
  if (!set || set.size === 0) return;
  set.forEach(handler => {
    try {
      handler(payload);
    } catch (error) {
      if (RarogConfig.debug && typeof console !== "undefined") {
        console.error("[Rarog Events]", error);
      }
    }
  });
}

const Events = {
  on(type, handler) {
    if (!type || typeof handler !== "function") return;
    let set = eventBusListeners.get(type);
    if (!set) {
      set = new Set();
      eventBusListeners.set(type, set);
    }
    set.add(handler);
  },
  off(type, handler) {
    const set = eventBusListeners.get(type);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) {
      eventBusListeners.delete(type);
    }
  },
  emit(type, payload = {}) {
    debugLog("event", type, payload);
    emitOnBus(type, payload);
  }
};

function dispatchEvent(element, name, detail = {}) {
  if (!element || typeof CustomEvent === "undefined") return;
  const evt = new CustomEvent(name, {
    bubbles: true,
    cancelable: false,
    detail
  });
  element.dispatchEvent(evt);
  emitOnBus(name, { element, detail });
}

function resolveTarget(trigger, explicitTarget) {
  if (explicitTarget) return explicitTarget;
  if (!trigger || typeof document === "undefined") return null;

  const selector =
    trigger.getAttribute("data-rg-target") ||
    trigger.getAttribute("href");

  if (!selector || selector === "#" || selector === "") return null;

  try {
    return document.querySelector(selector);
  } catch {
    return null;
  }
}

function getFocusableElements(container) {
  if (!container) return [];
  const selectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled]):not([type='hidden'])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ];
  return Array.from(container.querySelectorAll(selectors.join(","))).filter(
    el => el.offsetParent !== null || el === document.activeElement
  );
}

export {
  registries,
  maskHandlers,
  RarogConfig,
  debugLog,
  debugWarn,
  Events,
  dispatchEvent,
  resolveTarget,
  getFocusableElements
};
