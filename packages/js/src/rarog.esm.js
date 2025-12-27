/*!
 * Rarog JS Core v1.5.0
 * Vanilla JS utilities for interactive components (dropdown, collapse, modal).
 * Author: TheSkiF4er <dev@cajeer.ru>
 * License: Apache-2.0
 */

const _dropdownInstances = new WeakMap();
const _collapseInstances = new WeakMap();
const _modalInstances = new WeakMap();

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
/* Data API                                                                   */
/* -------------------------------------------------------------------------- */

let _dataApiInitialized = false;

function initDataApi(root = document) {
  if (typeof document === "undefined") return;
  if (!root || _dataApiInitialized) return;

  _dataApiInitialized = true;

  document.addEventListener("click", event => {
    const toggle = event.target.closest("[data-rg-toggle]");
    if (!toggle || !root.contains(toggle)) return;

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
    }
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
  initDataApi
};

export { Dropdown, Collapse, Modal, initDataApi, Rarog };
export default Rarog;
