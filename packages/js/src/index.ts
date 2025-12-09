/*
 * Rarog — core JS utilities
 * packages/js/src/index.ts
 *
 * Автор: TheSkiF4er
 * Назначение: компактная, безопасная и доступная библиотека vanilla‑JS утилит для Rarog:
 * - Dropdown (accessible)
 * - Modal (focus trap, a11y)
 * - Utils: event delegation, unique id, aria helpers
 *
 * Никаких внешних зависимостей, компактен и аккуратно типизирован для TS
 */

type Nullable<T> = T | null | undefined;

/* ==========================
   UTILS
   ========================== */

export const uid = (prefix = 'r') => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export function on<T extends EventTarget>(
  root: EventTarget,
  type: string,
  selectorOrHandler: string | ((ev: Event) => void),
  handlerMaybe?: (ev: Event) => void,
  options?: AddEventListenerOptions
) {
  if (typeof selectorOrHandler === 'string') {
    const selector = selectorOrHandler;
    const handler = handlerMaybe as (ev: Event) => void;
    const delegator = (ev: Event) => {
      const target = ev.target as Element | null;
      if (!target) return;
      const el = (target.closest && target.closest(selector)) as Element | null;
      if (el) handler.call(el, ev);
    };
    (root as Element | Document).addEventListener(type, delegator as EventListener, options);
    return () => (root as Element | Document).removeEventListener(type, delegator as EventListener);
  }

  const handler = selectorOrHandler as (ev: Event) => void;
  (root as Element | Document).addEventListener(type, handler as EventListener, options);
  return () => (root as Element | Document).removeEventListener(type, handler as EventListener);
}

export function attr(el: Element, name: string, value?: string | null) {
  if (value === undefined) return el.getAttribute(name);
  if (value === null) el.removeAttribute(name);
  else el.setAttribute(name, value);
}

export function toBoolean(v: any) {
  if (v === 'false' || v === '0' || v === 0) return false;
  return Boolean(v);
}

/* ==========================
   ARIA HELPERS
   ========================== */

export function setAriaExpanded(el: Element, expanded: boolean) {
  attr(el, 'aria-expanded', expanded ? 'true' : 'false');
}

export function isHidden(el: Element | null): boolean {
  if (!el) return true;
  // consider aria-hidden or display:none
  if (el.hasAttribute('aria-hidden') && attr(el, 'aria-hidden') === 'true') return true;
  const style = (el as HTMLElement).style;
  if (style && (style.display === 'none' || style.visibility === 'hidden')) return true;
  return false;
}

/* ==========================
   FOCUS TRAP
   ========================== */

interface FocusTrap {
  activate(): void;
  deactivate(): void;
}

export function createFocusTrap(container: HTMLElement): FocusTrap {
  let active = false;
  let previousActive: Nullable<Element> = null;

  function focusableElements(root: HTMLElement) {
    const sel = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable] :not([contenteditable="false"])',
      '[tabindex]:not([tabindex^="-"] )'
    ].join(',');
    return Array.from(root.querySelectorAll<HTMLElement>(sel)).filter(e => e.tabIndex !== -1 && !isHidden(e));
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    const items = focusableElements(container);
    if (!items.length) {
      e.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const activeEl = document.activeElement as HTMLElement | null;
    if (e.shiftKey) {
      if (activeEl === first || activeEl === container) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  return {
    activate() {
      if (active) return;
      previousActive = document.activeElement || null;
      const items = focusableElements(container);
      if (items.length) items[0].focus();
      document.addEventListener('keydown', handleKey, true);
      active = true;
    },
    deactivate() {
      if (!active) return;
      document.removeEventListener('keydown', handleKey, true);
      if (previousActive && (previousActive as HTMLElement).focus) (previousActive as HTMLElement).focus();
      previousActive = null;
      active = false;
    }
  };
}

/* ==========================
   DROPDOWN
   ========================== */

export interface DropdownOptions {
  trigger: Element;
  panel: HTMLElement;
  placement?: 'bottom' | 'top' | 'left' | 'right';
  autoClose?: boolean; // close on outside click
  focusTrap?: boolean; // trap focus inside panel
  returnFocus?: boolean; // return focus to trigger when closed
}

export class Dropdown {
  public trigger: Element;
  public panel: HTMLElement;
  private opts: Required<DropdownOptions>;
  private open = false;
  private documentClickRem?: () => void;
  private keyListener?: () => void;
  private focusTrap?: FocusTrap;

  constructor(opts: DropdownOptions) {
    if (!opts.trigger) throw new Error('Dropdown: trigger is required');
    if (!opts.panel) throw new Error('Dropdown: panel is required');
    this.opts = {
      placement: 'bottom',
      autoClose: true,
      focusTrap: false,
      returnFocus: true,
      ...opts
    } as Required<DropdownOptions>;
    this.trigger = this.opts.trigger;
    this.panel = this.opts.panel;

    this.init();
  }

  private init() {
    // ensure ARIA attributes
    if (!this.trigger.hasAttribute('aria-controls')) {
      const id = this.panel.id || (this.panel.id = uid('rarog-panel'));
      attr(this.trigger, 'aria-controls', id);
    }
    attr(this.trigger, 'aria-haspopup', 'true');
    setAriaExpanded(this.trigger, false);
    this.panel.setAttribute('role', this.panel.getAttribute('role') || 'menu');
    this.panel.setAttribute('aria-hidden', 'true');

    // listeners
    this.trigger.addEventListener('click', this.onTriggerClick);
    this.trigger.addEventListener('keydown', this.onTriggerKeydown);
    // close when an item selected
    this.panel.addEventListener('click', this.onPanelClick);
  }

  private onTriggerClick = (ev: Event) => {
    ev.preventDefault();
    this.toggle();
  };

  private onTriggerKeydown = (ev: KeyboardEvent) => {
    if (ev.key === 'ArrowDown' || ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.openDropdown();
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      this.openDropdown();
    }
  };

  private onPanelClick = (ev: Event) => {
    const t = ev.target as HTMLElement | null;
    if (!t) return;
    // if click on menu item with role=menuitem, close
    if (t.getAttribute('role') === 'menuitem' || t.closest('[role="menuitem"]')) {
      if (this.opts.autoClose) this.closeDropdown();
    }
  };

  private handleDocClick = (ev: Event) => {
    const target = ev.target as Node | null;
    if (!target) return;
    if (this.trigger.contains(target) || this.panel.contains(target)) return;
    this.closeDropdown();
  };

  private handleKey = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      this.closeDropdown();
    }
  };

  private position() {
    // Basic positioning: below trigger; full-featured popper-like not included to keep zero-deps
    const rect = (this.trigger as Element).getBoundingClientRect();
    const panel = this.panel;
    panel.style.position = 'absolute';
    const top = rect.bottom + window.scrollY;
    const left = rect.left + window.scrollX;
    panel.style.top = `${top}px`;
    panel.style.left = `${left}px`;
    // ensure visible
    panel.style.minWidth = `${rect.width}px`;
  }

  public openDropdown() {
    if (this.open) return;
    this.open = true;
    setAriaExpanded(this.trigger, true);
    this.panel.setAttribute('aria-hidden', 'false');
    this.panel.style.display = 'block';
    this.position();

    if (this.opts.focusTrap) {
      this.focusTrap = createFocusTrap(this.panel);
      this.focusTrap.activate();
    }

    // global listeners
    if (this.opts.autoClose) this.documentClickRem = on(document, 'click', this.handleDocClick as any);
    this.keyListener = () => document.addEventListener('keydown', this.handleKey);
    this.keyListener();
  }

  public closeDropdown() {
    if (!this.open) return;
    this.open = false;
    setAriaExpanded(this.trigger, false);
    this.panel.setAttribute('aria-hidden', 'true');
    this.panel.style.display = 'none';

    if (this.focusTrap) {
      this.focusTrap.deactivate();
      this.focusTrap = undefined;
    }

    if (this.documentClickRem) {
      this.documentClickRem();
      this.documentClickRem = undefined;
    }
    document.removeEventListener('keydown', this.handleKey);
    if (this.opts.returnFocus && (this.trigger as HTMLElement).focus) (this.trigger as HTMLElement).focus();
  }

  public toggle() {
    if (this.open) this.closeDropdown();
    else this.openDropdown();
  }

  public destroy() {
    this.closeDropdown();
    this.trigger.removeEventListener('click', this.onTriggerClick);
    this.trigger.removeEventListener('keydown', this.onTriggerKeydown);
    this.panel.removeEventListener('click', this.onPanelClick);
  }
}

/* ==========================
   MODAL (simple accessible modal)
   ========================== */

export interface ModalOptions {
  modal: HTMLElement;
  openClass?: string;
  closeSelector?: string; // selector inside modal to close
  onOpen?: () => void;
  onClose?: () => void;
}

export class Modal {
  public modal: HTMLElement;
  private openClass: string;
  private closeSelector: string;
  private onOpen?: () => void;
  private onClose?: () => void;
  private trap: FocusTrap;
  private isOpen = false;

  constructor(opts: ModalOptions) {
    if (!opts.modal) throw new Error('Modal: modal element required');
    this.modal = opts.modal;
    this.openClass = opts.openClass || 'is-open';
    this.closeSelector = opts.closeSelector || '[data-rarog-close]';
    this.onOpen = opts.onOpen;
    this.onClose = opts.onClose;

    this.trap = createFocusTrap(this.modal);
    this.init();
  }

  private init() {
    // hide initially
    this.modal.setAttribute('role', this.modal.getAttribute('role') || 'dialog');
    this.modal.setAttribute('aria-modal', 'true');
    this.modal.setAttribute('aria-hidden', 'true');
    this.modal.style.display = 'none';

    // close buttons
    this.modal.addEventListener('click', (ev) => {
      const t = ev.target as Element | null;
      if (!t) return;
      if (t.closest && t.closest(this.closeSelector)) {
        this.close();
      }
    });

    // escape
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && this.isOpen) this.close();
    });
  }

  public open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.modal.style.display = '';
    this.modal.classList.add(this.openClass);
    this.modal.setAttribute('aria-hidden', 'false');
    this.trap.activate();
    this.onOpen && this.onOpen();
    // set inert on siblings (simple approach)
    this.setSiblingsInert(true);
  }

  public close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.modal.style.display = 'none';
    this.modal.classList.remove(this.openClass);
    this.modal.setAttribute('aria-hidden', 'true');
    this.trap.deactivate();
    this.onClose && this.onClose();
    this.setSiblingsInert(false);
  }

  private setSiblingsInert(value: boolean) {
    // mark other direct children of body as inert (basic)
    const children = Array.from(document.body.children);
    for (const c of children) {
      if (c === this.modal) continue;
      try {
        if (value) c.setAttribute('aria-hidden', 'true');
        else c.removeAttribute('aria-hidden');
      } catch (e) {
        // ignore
      }
    }
  }

  public destroy() {
    this.close();
    // remove attributes set (best-effort)
    this.modal.removeAttribute('aria-hidden');
    this.modal.removeAttribute('aria-modal');
    this.modal.removeAttribute('role');
  }
}

/* ==========================
   EXPORTS: small helpers for progressive enhancement
   ========================== */

export function initDropdowns(root: ParentNode = document) {
  const created: Dropdown[] = [];
  const triggers = Array.from(root.querySelectorAll<HTMLElement>('[data-rarog-dropdown-trigger]'));
  triggers.forEach((t) => {
    const panelSelector = attr(t, 'data-rarog-dropdown-panel') as string | null;
    if (!panelSelector) return;
    const panel = document.querySelector<HTMLElement>(panelSelector);
    if (!panel) return;
    const autoClose = toBoolean(attr(t, 'data-rarog-autoclose')) ?? true;
    const focusTrap = toBoolean(attr(t, 'data-rarog-focustrap')) ?? false;
    const dr = new Dropdown({ trigger: t, panel, autoClose, focusTrap });
    created.push(dr);
  });
  return created;
}

export function initModals(root: ParentNode = document) {
  const created: Modal[] = [];
  const modals = Array.from(root.querySelectorAll<HTMLElement>('[data-rarog-modal]'));
  modals.forEach((m) => {
    const closeSel = m.getAttribute('data-rarog-modal-close') || '[data-rarog-close]';
    const cls = m.getAttribute('data-rarog-modal-open-class') || 'is-open';
    const modal = new Modal({ modal: m, closeSelector: closeSel, openClass: cls });
    created.push(modal);
  });
  return created;
}

/* ==========================
   DEFAULT EXPORTS
   ========================== */

export default {
  uid,
  on,
  attr,
  initDropdowns,
  initModals,
  Dropdown,
  Modal,
  createFocusTrap
};
