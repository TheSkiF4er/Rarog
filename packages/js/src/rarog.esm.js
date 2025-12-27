/*!
 * Rarog JS Core v1.5.0
 * Vanilla JS utilities for interactive components (dropdown, collapse, modal).
 * Author: TheSkiF4er <dev@cajeer.ru>
 * License: Apache-2.0
 */

const _dropdownInstances = new WeakMap();
const _collapseInstances = new WeakMap();
const _modalInstances = new WeakMap();
const _offcanvasInstances = new WeakMap();
const _toastInstances = new WeakMap();
const _tooltipInstances = new WeakMap();
const _popoverInstances = new WeakMap();

function _dispatchEvent(element, name, detail = {}) {
  if (!element || typeof CustomEvent === "undefined") return;
  const evt = new CustomEvent(name, {
    bubbles: true,
    cancelable: false,
    detail
  });
  element.dispatchEvent(evt);
}


function _resolveTarget(trigger, explicitTarget) {
  if (explicitTarget) return explicitTarget;
  if (!trigger || typeof document === "undefined") return null;

  const selector =
    trigger.getAttribute("data-rg-target") ||
    trigger.getAttribute("href");

  if (!selector || selector === "#" || selector === "") return null;

  try {
    return document.querySelector(selector);
  } catch (e) {
    return null;
  }
}

function _getFocusableElements(container) {
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

/* -------------------------------------------------------------------------- */
/* Dropdown                                                                   */
/* -------------------------------------------------------------------------- */

class Dropdown {
  constructor(trigger, options = {}) {
    if (!trigger) {
      throw new Error("Rarog.Dropdown: trigger element is required");
    }
    this._trigger = trigger;
    this._menu = _resolveTarget(trigger, options.target);

    this._isOpen = false;
    this._onDocumentClick = this._handleDocumentClick.bind(this);
    this._onKeydown = this._handleKeydown.bind(this);

    this._initA11y();

    _dropdownInstances.set(trigger, this);
  }

  _initA11y() {
    if (!this._trigger) return;
    this._trigger.setAttribute("aria-haspopup", "menu");
    this._trigger.setAttribute("aria-expanded", "false");

    if (this._menu && this._menu.id) {
      this._trigger.setAttribute("aria-controls", this._menu.id);
    }
    if (this._menu && !this._menu.hasAttribute("role")) {
      this._menu.setAttribute("role", "menu");
    }
  }

  _handleDocumentClick(event) {
    if (!this._isOpen) return;
    const target = event.target;
    if (
      !this._trigger.contains(target) &&
      (!this._menu || !this._menu.contains(target))
    ) {
      this.hide();
    }
  }

  _handleKeydown(event) {
    if (!this._isOpen || !this._menu) return;

    if (event.key === "Escape") {
      event.preventDefault();
      this.hide();
      this._trigger.focus();
      return;
    }

    const items = _getFocusableElements(this._menu);
    if (!items.length) return;

    let index = items.indexOf(document.activeElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      index = index === -1 ? 0 : (index + 1) % items.length;
      items[index].focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (index === -1) {
        items[items.length - 1].focus();
      } else {
        index = (index - 1 + items.length) % items.length;
        items[index].focus();
      }
    }
  }

  show() {
    if (this._isOpen) return;
    this._isOpen = true;

    if (this._menu) {
      this._menu.removeAttribute("hidden");
      this._menu.classList.add("rg-open");
    }
    this._trigger.setAttribute("aria-expanded", "true");

    if (typeof document !== "undefined") {
      document.addEventListener("click", this._onDocumentClick);
      document.addEventListener("keydown", this._onKeydown);
    }
  }

  hide() {
    if (!this._isOpen) return;
    this._isOpen = false;

    if (this._menu) {
      this._menu.setAttribute("hidden", "");
      this._menu.classList.remove("rg-open");
    }
    this._trigger.setAttribute("aria-expanded", "false");

    if (typeof document !== "undefined") {
      document.removeEventListener("click", this._onDocumentClick);
      document.removeEventListener("keydown", this._onKeydown);
    }
  }

  toggle() {
    if (this._isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  static getInstance(trigger) {
    return _dropdownInstances.get(trigger) || null;
  }

  static getOrCreate(trigger, options) {
    return this.getInstance(trigger) || new Dropdown(trigger, options);
  }
}

/* -------------------------------------------------------------------------- */
/* Collapse / Accordion                                                       */
/* -------------------------------------------------------------------------- */

class Collapse {
  constructor(trigger, options = {}) {
    if (!trigger) {
      throw new Error("Rarog.Collapse: trigger element is required");
    }
    this._trigger = trigger;
    this._target = _resolveTarget(trigger, options.target);

    this._isOpen = !(
      this._target &&
      (this._target.hasAttribute("hidden") ||
        this._target.getAttribute("aria-hidden") === "true")
    );

    this._initA11y();

    _collapseInstances.set(trigger, this);
  }

  _initA11y() {
    if (!this._trigger || !this._target) return;

    if (!this._target.id) {
      this._target.id = `rg-collapse-${Math.random().toString(36).slice(2, 8)}`;
    }

    this._trigger.setAttribute("aria-controls", this._target.id);
    this._trigger.setAttribute("aria-expanded", String(this._isOpen));
    this._trigger.setAttribute("role", "button");

    this._target.setAttribute("role", "region");
    this._target.setAttribute("aria-hidden", String(!this._isOpen));
  }

  show() {
    if (this._isOpen) return;
    this._isOpen = true;

    if (this._target) {
      this._target.removeAttribute("hidden");
      this._target.setAttribute("aria-hidden", "false");
      this._target.classList.add("rg-collapse-open");
    }
    this._trigger.setAttribute("aria-expanded", "true");
  }

  hide() {
    if (!this._isOpen) return;
    this._isOpen = false;

    if (this._target) {
      this._target.setAttribute("hidden", "");
      this._target.setAttribute("aria-hidden", "true");
      this._target.classList.remove("rg-collapse-open");
    }
    this._trigger.setAttribute("aria-expanded", "false");
  }

  toggle() {
    if (this._isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  static getInstance(trigger) {
    return _collapseInstances.get(trigger) || null;
  }

  static getOrCreate(trigger, options) {
    return this.getInstance(trigger) || new Collapse(trigger, options);
  }
}

/* -------------------------------------------------------------------------- */
/* Modal                                                                      */
/* -------------------------------------------------------------------------- */

let _openModal = null;

class Modal {
  constructor(element, options = {}) {
    if (!element) {
      throw new Error("Rarog.Modal: element is required");
    }
    this._element = element;
    this._options = Object.assign(
      {
        backdrop: true,
        keyboard: true
      },
      options
    );

    this._isOpen = false;
    this._previouslyFocused = null;
    this._onKeydown = this._handleKeydown.bind(this);
    this._onClick = this._handleClick.bind(this);

    this._initA11y();

    _modalInstances.set(element, this);
  }

  _initA11y() {
    if (!this._element) return;

    this._element.setAttribute("role", "dialog");
    this._element.setAttribute("aria-modal", "true");
    if (!this._element.hasAttribute("aria-hidden")) {
      this._element.setAttribute("aria-hidden", "true");
    }
  }

  _handleKeydown(event) {
    if (!this._isOpen) return;

    if (event.key === "Escape" && this._options.keyboard) {
      event.preventDefault();
      this.hide();
      return;
    }

    if (event.key === "Tab") {
      const focusables = _getFocusableElements(this._element);
      if (!focusables.length) {
        event.preventDefault();
        return;
      }

      const currentIndex = focusables.indexOf(document.activeElement);
      let nextIndex = currentIndex;

      if (event.shiftKey) {
        nextIndex = currentIndex <= 0 ? focusables.length - 1 : currentIndex - 1;
      } else {
        nextIndex = currentIndex === focusables.length - 1 ? 0 : currentIndex + 1;
      }

      event.preventDefault();
      focusables[nextIndex].focus();
    }
  }

  _handleClick(event) {
    if (!this._isOpen) return;

    const target = event.target;

    // backdrop click (клик по самому .modal, а не по контенту внутри)
    if (this._options.backdrop && target === this._element) {
      this.hide();
      return;
    }

    // элементы с data-rg-dismiss="modal"
    const dismiss = target.closest("[data-rg-dismiss='modal']");
    if (dismiss && this._element.contains(dismiss)) {
      event.preventDefault();
      this.hide();
    }
  }

  _lockScroll() {
    if (typeof document === "undefined") return;
    const body = document.body;
    if (!body) return;

    if (body.getAttribute("data-rg-scroll-locked") === "true") return;

    const originalOverflow = body.style.overflow || "";
    body.setAttribute("data-rg-original-overflow", originalOverflow);
    body.style.overflow = "hidden";
    body.setAttribute("data-rg-scroll-locked", "true");
  }

  _unlockScroll() {
    if (typeof document === "undefined") return;
    const body = document.body;
    if (!body) return;

    if (body.getAttribute("data-rg-scroll-locked") !== "true") return;

    const originalOverflow = body.getAttribute("data-rg-original-overflow") || "";
    body.style.overflow = originalOverflow;
    body.removeAttribute("data-rg-original-overflow");
    body.removeAttribute("data-rg-scroll-locked");
  }

  show() {
    if (this._isOpen) return;

    if (_openModal && _openModal !== this) {
      _openModal.hide();
    }

    this._isOpen = true;
    _openModal = this;

    if (typeof document !== "undefined") {
      this._previouslyFocused = document.activeElement;
      document.addEventListener("keydown", this._onKeydown);
      document.addEventListener("click", this._onClick);
    }

    this._element.removeAttribute("aria-hidden");
    this._element.classList.add("rg-modal-open");

    this._lockScroll();

    // focus trap start
    const focusables = _getFocusableElements(this._element);
    if (focusables.length) {
      focusables[0].focus();
    } else {
      this._element.setAttribute("tabindex", "-1");
      this._element.focus();
    }
  }

  hide() {
    if (!this._isOpen) return;

    this._isOpen = false;
    _openModal = null;

    if (typeof document !== "undefined") {
      document.removeEventListener("keydown", this._onKeydown);
      document.removeEventListener("click", this._onClick);
    }

    this._element.setAttribute("aria-hidden", "true");
    this._element.classList.remove("rg-modal-open");

    this._unlockScroll();

    if (this._previouslyFocused && typeof this._previouslyFocused.focus === "function") {
      this._previouslyFocused.focus();
    }
  }

  toggle() {
    if (this._isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  static getInstance(element) {
    return _modalInstances.get(element) || null;
  }

  static getOrCreate(element, options) {
    return this.getInstance(element) || new Modal(element, options);
  }
}

/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Offcanvas / Drawer                                                         */
/* -------------------------------------------------------------------------- */

class Offcanvas {
  constructor(element, options = {}) {
    if (!element) {
      throw new Error("Rarog.Offcanvas: element is required");
    }
    this._element = element;
    this._isOpen = element.classList.contains("is-open");
    this._backdrop = null;
    this._options = Object.assign(
      {
        backdrop: true,
        scroll: false
      },
      options
    );
    this._onKeydown = this._handleKeydown.bind(this);

    _offcanvasInstances.set(element, this);
  }

  show() {
    if (typeof document === "undefined") return;
    if (this._isOpen) return;

    this._isOpen = true;

    if (this._options.backdrop) {
      this._createBackdrop();
    }

    if (!this._options.scroll) {
      document.body.classList.add("rg-offcanvas-open");
    }

    this._element.classList.add("is-open");
    this._element.removeAttribute("aria-hidden");
    this._element.setAttribute("aria-modal", "true");
    this._element.setAttribute("role", "dialog");

    document.addEventListener("keydown", this._onKeydown);
    _dispatchEvent(this._element, "rg:offcanvas:show", { instance: this });
  }

  hide() {
    if (typeof document === "undefined") return;
    if (!this._isOpen) return;

    this._isOpen = false;

    this._element.classList.remove("is-open");
    this._element.setAttribute("aria-hidden", "true");
    this._element.removeAttribute("aria-modal");

    document.removeEventListener("keydown", this._onKeydown);

    if (!this._options.scroll) {
      document.body.classList.remove("rg-offcanvas-open");
    }

    this._removeBackdrop();
    _dispatchEvent(this._element, "rg:offcanvas:hide", { instance: this });
  }

  toggle() {
    if (this._isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  _createBackdrop() {
    if (this._backdrop || typeof document === "undefined") return;

    const backdrop = document.createElement("div");
    backdrop.className = "offcanvas-backdrop";
    document.body.appendChild(backdrop);

    requestAnimationFrame(() => {
      backdrop.classList.add("is-visible");
    });

    backdrop.addEventListener("click", () => {
      this.hide();
    });

    this._backdrop = backdrop;
  }

  _removeBackdrop() {
    const backdrop = this._backdrop;
    if (!backdrop) return;

    backdrop.classList.remove("is-visible");
    const remove = () => {
      if (backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
    };

    backdrop.addEventListener("transitionend", remove, { once: true });
    this._backdrop = null;
  }

  _handleKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      this.hide();
    }
  }

  static getInstance(element) {
    return _offcanvasInstances.get(element) || null;
  }

  static getOrCreate(element, options) {
    return this.getInstance(element) || new Offcanvas(element, options);
  }
}

/* -------------------------------------------------------------------------- */
/* Toast                                                                      */
/* -------------------------------------------------------------------------- */

class Toast {
  constructor(element, options = {}) {
    if (!element) {
      throw new Error("Rarog.Toast: element is required");
    }
    this._element = element;
    this._isVisible = element.classList.contains("is-visible");
    this._options = Object.assign(
      {
        autoHide: true,
        delay: 5000
      },
      options
    );
    this._timeoutId = null;

    _toastInstances.set(element, this);
  }

  show() {
    if (this._isVisible) return;

    this._isVisible = true;
    this._element.classList.add("is-visible");
    this._element.setAttribute("role", "status");
    this._element.setAttribute("aria-live", "polite");

    _dispatchEvent(this._element, "rg:toast:show", { instance: this });

    if (this._options.autoHide) {
      this._clearTimer();
      this._timeoutId = setTimeout(() => {
        this.hide();
      }, this._options.delay);
    }
  }

  hide() {
    if (!this._isVisible) return;

    this._isVisible = false;
    this._element.classList.remove("is-visible");
    this._element.removeAttribute("aria-live");

    this._clearTimer();
    _dispatchEvent(this._element, "rg:toast:hide", { instance: this });
  }

  _clearTimer() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  }

  static getInstance(element) {
    return _toastInstances.get(element) || null;
  }

  static getOrCreate(element, options) {
    return this.getInstance(element) || new Toast(element, options);
  }
}

/* -------------------------------------------------------------------------- */
/* Tooltip                                                                    */
/* -------------------------------------------------------------------------- */

class Tooltip {
  constructor(trigger, options = {}) {
    if (!trigger) {
      throw new Error("Rarog.Tooltip: trigger element is required");
    }

    this._trigger = trigger;
    this._options = Object.assign(
      {
        placement: trigger.getAttribute("data-rg-placement") || "top"
      },
      options
    );

    this._tooltip = null;
    this._isVisible = false;
    this._originalTitle =
      trigger.getAttribute("data-rg-title") || trigger.getAttribute("title") || "";

    if (this._originalTitle) {
      trigger.setAttribute("data-rg-original-title", this._originalTitle);
      trigger.removeAttribute("title");
    }

    this._onMouseEnter = () => this.show();
    this._onMouseLeave = () => this.hide();
    this._onFocus = () => this.show();
    this._onBlur = () => this.hide();

    trigger.addEventListener("mouseenter", this._onMouseEnter);
    trigger.addEventListener("mouseleave", this._onMouseLeave);
    trigger.addEventListener("focus", this._onFocus);
    trigger.addEventListener("blur", this._onBlur);

    _tooltipInstances.set(trigger, this);
  }

  _createTooltip() {
    if (this._tooltip || typeof document === "undefined") return;
    const text = this._originalTitle || this._trigger.getAttribute("aria-label");
    if (!text) return;

    const el = document.createElement("div");
    el.className = "tooltip";
    el.dataset.rgPlacement = this._options.placement;

    const inner = document.createElement("div");
    inner.className = "tooltip-inner";
    inner.textContent = text;
    el.appendChild(inner);

    document.body.appendChild(el);
    this._tooltip = el;
  }

  show() {
    if (this._isVisible || typeof document === "undefined") return;

    this._createTooltip();
    if (!this._tooltip) return;

    this._position();
    this._tooltip.classList.add("is-visible");
    this._trigger.setAttribute("aria-describedby", this._tooltip.id || "");
    this._isVisible = true;

    _dispatchEvent(this._tooltip, "rg:tooltip:show", { instance: this });
  }

  hide() {
    if (!this._isVisible) return;
    if (!this._tooltip) return;

    this._tooltip.classList.remove("is-visible");
    this._trigger.removeAttribute("aria-describedby");
    this._isVisible = false;

    _dispatchEvent(this._tooltip, "rg:tooltip:hide", { instance: this });
  }

  _position() {
    if (!this._tooltip || typeof window === "undefined") return;

    const triggerRect = this._trigger.getBoundingClientRect();
    const tooltipRect = this._tooltip.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    let top = 0;
    let left = 0;

    if (this._options.placement === "bottom") {
      top = triggerRect.bottom + 8 + scrollY;
      left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollX;
    } else {
      // top (default)
      top = triggerRect.top - tooltipRect.height - 8 + scrollY;
      left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollX;
    }

    this._tooltip.style.top = `${Math.round(top)}px`;
    this._tooltip.style.left = `${Math.round(left)}px`;
  }

  static getInstance(trigger) {
    return _tooltipInstances.get(trigger) || null;
  }

  static getOrCreate(trigger, options) {
    return this.getInstance(trigger) || new Tooltip(trigger, options);
  }
}

/* -------------------------------------------------------------------------- */
/* Popover                                                                    */
/* -------------------------------------------------------------------------- */

class Popover {
  constructor(trigger, options = {}) {
    if (!trigger) {
      throw new Error("Rarog.Popover: trigger element is required");
    }

    this._trigger = trigger;
    this._options = Object.assign(
      {
        placement: trigger.getAttribute("data-rg-placement") || "top",
        title: trigger.getAttribute("data-rg-popover-title") || "",
        content: trigger.getAttribute("data-rg-popover-content") || ""
      },
      options
    );

    this._popover = null;
    this._isVisible = false;

    this._onClick = event => {
      event.preventDefault();
      this.toggle();
    };

    trigger.addEventListener("click", this._onClick);
    _popoverInstances.set(trigger, this);
  }

  _createPopover() {
    if (this._popover || typeof document === "undefined") return;

    const el = document.createElement("div");
    el.className = "popover";
    el.dataset.rgPlacement = this._options.placement;

    if (this._options.title) {
      const header = document.createElement("div");
      header.className = "popover-header";
      header.textContent = this._options.title;
      el.appendChild(header);
    }

    const body = document.createElement("div");
    body.className = "popover-body";
    body.textContent = this._options.content;
    el.appendChild(body);

    document.body.appendChild(el);
    this._popover = el;
  }

  show() {
    if (this._isVisible) return;

    this._createPopover();
    if (!this._popover) return;

    this._position();
    this._popover.classList.add("is-visible");
    this._trigger.setAttribute("aria-expanded", "true");

    this._isVisible = true;
    _dispatchEvent(this._popover, "rg:popover:show", { instance: this });
  }

  hide() {
    if (!this._isVisible || !this._popover) return;

    this._popover.classList.remove("is-visible");
    this._trigger.setAttribute("aria-expanded", "false");

    this._isVisible = false;
    _dispatchEvent(this._popover, "rg:popover:hide", { instance: this });
  }

  toggle() {
    if (this._isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  _position() {
    if (!this._popover || typeof window === "undefined") return;

    const triggerRect = this._trigger.getBoundingClientRect();
    const popRect = this._popover.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    let top = 0;
    let left = 0;

    if (this._options.placement === "bottom") {
      top = triggerRect.bottom + 8 + scrollY;
      left = triggerRect.left + triggerRect.width / 2 - popRect.width / 2 + scrollX;
    } else {
      // top (default)
      top = triggerRect.top - popRect.height - 8 + scrollY;
      left = triggerRect.left + triggerRect.width / 2 - popRect.width / 2 + scrollX;
    }

    this._popover.style.top = `${Math.round(top)}px`;
    this._popover.style.left = `${Math.round(left)}px`;
  }

  static getInstance(trigger) {
    return _popoverInstances.get(trigger) || null;
  }

  static getOrCreate(trigger, options) {
    return this.getInstance(trigger) || new Popover(trigger, options);
  }
}

/* -------------------------------------------------------------------------- */
/* Event wrappers for existing components                                     */
/* -------------------------------------------------------------------------- */

function _attachEventsForClass(klass, getElement, name) {
  if (!klass || typeof klass.prototype !== "object") return;

  ["show", "hide"].forEach(methodName => {
    const original = klass.prototype[methodName];
    if (typeof original !== "function") return;

    klass.prototype[methodName] = function (...args) {
      const el = getElement(this);
      if (methodName === "show") {
        _dispatchEvent(el, `rg:${name}:show`, { instance: this });
      }

      const result = original.apply(this, args);

      if (methodName === "hide") {
        _dispatchEvent(el, `rg:${name}:hide`, { instance: this });
      }

      return result;
    };
  });
}

// Подвязываем события для Dropdown/Collapse/Modal
_attachEventsForClass(Dropdown, inst => inst._menu || inst._trigger, "dropdown");
_attachEventsForClass(Collapse, inst => inst._target, "collapse");
_attachEventsForClass(Modal, inst => inst._element, "modal");
/* Data API                                                                   */
/* -------------------------------------------------------------------------- */

let _dataApiInitialized = false;

function initDataApi(root = document) {
  if (typeof document === "undefined") return;
  if (!root || _dataApiInitialized) return;

  _dataApiInitialized = true;

  document.addEventListener("click", event => {
    const toggle = event.target.closest("[data-rg-toggle]");
    const dismiss = event.target.closest("[data-rg-dismiss]");

    // toggle handlers
    if (toggle && root.contains(toggle)) {
      const type = toggle.getAttribute("data-rg-toggle");
      if (!type) return;

      if (type === "dropdown") {
        event.preventDefault();
        const instance = Dropdown.getOrCreate(toggle);
        instance.toggle();
      } else if (type === "collapse") {
        event.preventDefault();
        const instance = Collapse.getOrCreate(toggle);
        instance.toggle();
      } else if (type === "modal") {
        event.preventDefault();
        const target = _resolveTarget(toggle);
        if (!target) return;
        const instance = Modal.getOrCreate(target);
        instance.toggle();
      } else if (type === "offcanvas") {
        event.preventDefault();
        const target = _resolveTarget(toggle);
        if (!target) return;
        const instance = Offcanvas.getOrCreate(target);
        instance.toggle();
      } else if (type === "toast") {
        event.preventDefault();
        const target = _resolveTarget(toggle);
        if (!target) return;
        const instance = Toast.getOrCreate(target);
        instance.show();
      } else if (type === "tooltip") {
        event.preventDefault();
        Tooltip.getOrCreate(toggle);
      } else if (type === "popover") {
        event.preventDefault();
        Popover.getOrCreate(toggle).toggle();
      }

      return;
    }

    // dismiss handlers
    if (dismiss && root.contains(dismiss)) {
      const type = dismiss.getAttribute("data-rg-dismiss");
      if (!type) return;

      if (type === "modal") {
        const target = dismiss.closest(".modal");
        if (!target) return;
        const instance = Modal.getOrCreate(target);
        instance.hide();
      } else if (type === "offcanvas") {
        const target = dismiss.closest(".offcanvas");
        if (!target) return;
        const instance = Offcanvas.getOrCreate(target);
        instance.hide();
      } else if (type === "toast") {
        const target = dismiss.closest(".toast");
        if (!target) return;
        const instance = Toast.getOrCreate(target);
        instance.hide();
      }
    }
  });

  // Инициализация tooltip/popover по data-атрибутам
  const tooltipTriggers = root.querySelectorAll("[data-rg-toggle='tooltip']");
  tooltipTriggers.forEach(trigger => {
    Tooltip.getOrCreate(trigger);
  });

  const popoverTriggers = root.querySelectorAll("[data-rg-toggle='popover']");
  popoverTriggers.forEach(trigger => {
    Popover.getOrCreate(trigger);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initDataApi(document));
  } else {
    initDataApi(document);
  }
}

const Rarog = {
  Dropdown,
  Collapse,
  Modal,
  Offcanvas,
  Toast,
  Tooltip,
  Popover,
  initDataApi
};

export { Dropdown, Collapse, Modal, Offcanvas, Toast, Tooltip, Popover, initDataApi, Rarog };
export default Rarog;
