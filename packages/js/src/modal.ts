/**
 * packages/js/src/modal.ts
 * Модуль: доступный (a11y) Modal для Rarog (vanilla JS, TypeScript)
 * Автор: TheSkiF4er
 * Описание: лёгкий, zero-deps компонент модального окна с focus-trap, управлением фоном,
 * а также хуками для анимации и событиями открытие/закрытие.
 *
 * Особенности:
 * - aria поддержка: role=dialog, aria-modal
 * - focus trap (встроенная реализация, без зависимостей)
 * - возврат фокуса на триггер
 * - опциональное закрытие по клику по бекдропу и по Escape
 * - preventScroll (удержание скролла при открытом модале)
 * - события: rarog:open, rarog:close
 */

type Nullable<T> = T | null | undefined;

function uid(prefix = 'r-modal') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function isHidden(el: Element | null): boolean {
  if (!el) return true;
  if (el.hasAttribute('aria-hidden') && el.getAttribute('aria-hidden') === 'true') return true;
  const s = (el as HTMLElement).style;
  if (s && (s.display === 'none' || s.visibility === 'hidden')) return true;
  return false;
}

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

export interface ModalOptions {
  modal: HTMLElement; // основной элемент модального окна
  openClass?: string; // CSS класс для состояния открытия
  backdrop?: boolean; // добавлять затемнённый backdrop
  backdropClass?: string; // класс для backdrop
  closeSelector?: string; // селектор внутри модала для кнопок закрытия
  closeOnEsc?: boolean; // закрывать по Escape
  closeOnBackdrop?: boolean; // закрывать по клику вне модала
  preventScroll?: boolean; // блокировать прокрутку body при открытом модале
  returnFocus?: boolean; // возвращать фокус на элемент, который открыл модал
  onOpen?: (modal: HTMLElement) => void;
  onClose?: (modal: HTMLElement) => void;
}

export class Modal {
  modal: HTMLElement;
  options: Required<ModalOptions>;
  private isOpen = false;
  private previouslyFocused: Nullable<Element> = null;
  private backdropEl: Nullable<HTMLElement> = null;
  private focusTrapHandler = (e: KeyboardEvent) => this.handleFocusTrap(e);
  private escHandler = (e: KeyboardEvent) => this.handleEsc(e);

  constructor(opts: ModalOptions) {
    if (!opts || !opts.modal) throw new Error('Modal: опция modal обязательна');

    this.options = {
      openClass: 'is-open',
      backdrop: true,
      backdropClass: 'r-modal-backdrop',
      closeSelector: '[data-rarog-close]',
      closeOnEsc: true,
      closeOnBackdrop: true,
      preventScroll: true,
      returnFocus: true,
      onOpen: () => undefined,
      onClose: () => undefined,
      ...opts
    } as Required<ModalOptions>;

    this.modal = this.options.modal;
    this.init();
  }

  private init() {
    // Ensure id
    if (!this.modal.id) this.modal.id = uid('rarog-modal');

    // ARIA attributes
    this.modal.setAttribute('role', this.modal.getAttribute('role') || 'dialog');
    this.modal.setAttribute('aria-modal', 'true');
    this.modal.setAttribute('aria-hidden', 'true');
    this.modal.style.display = 'none';

    // Attach listeners for close buttons inside modal
    this.modal.addEventListener('click', (ev) => {
      const t = ev.target as HTMLElement | null;
      if (!t) return;
      if ((t.closest && t.closest(this.options.closeSelector)) || t.matches(this.options.closeSelector)) {
        this.close();
      }
    });
  }

  private buildBackdrop() {
    if (!this.options.backdrop) return;
    if (this.backdropEl && document.body.contains(this.backdropEl)) return;
    const b = document.createElement('div');
    b.className = this.options.backdropClass;
    b.setAttribute('aria-hidden', 'true');
    b.style.position = 'fixed';
    b.style.inset = '0';
    b.style.background = 'rgba(0,0,0,0.4)';
    b.style.zIndex = '9998';
    this.backdropEl = b;
  }

  private attachBackdrop() {
    if (!this.backdropEl) this.buildBackdrop();
    if (!this.backdropEl) return;
    document.body.appendChild(this.backdropEl);
    if (this.options.closeOnBackdrop) {
      this.backdropEl.addEventListener('click', () => this.close());
    }
  }

  private removeBackdrop() {
    if (!this.backdropEl) return;
    if (this.backdropEl.parentElement) this.backdropEl.parentElement.removeChild(this.backdropEl);
  }

  private stopScroll() {
    if (!this.options.preventScroll) return;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    document.documentElement.style.top = `-${scrollY}px`;
    document.documentElement.style.position = 'fixed';
    document.documentElement.style.width = '100%';
    document.documentElement.setAttribute('data-rarog-scroll', String(scrollY));
  }

  private restoreScroll() {
    if (!this.options.preventScroll) return;
    const val = document.documentElement.getAttribute('data-rarog-scroll');
    const scrollY = val ? parseInt(val, 10) : 0;
    document.documentElement.style.position = '';
    document.documentElement.style.top = '';
    document.documentElement.style.width = '';
    document.documentElement.removeAttribute('data-rarog-scroll');
    window.scrollTo(0, scrollY);
  }

  private handleEsc(e: KeyboardEvent) {
    if (!this.options.closeOnEsc) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
  }

  private handleFocusTrap(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    const focusables = focusableElements(this.modal);
    if (!focusables.length) {
      e.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey) {
      if (active === first || active === this.modal) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  public open() {
    if (this.isOpen) return;
    this.isOpen = true;

    this.previouslyFocused = document.activeElement || null;

    // show backdrop
    if (this.options.backdrop) this.attachBackdrop();

    // show modal
    this.modal.style.display = '';
    this.modal.classList.add(this.options.openClass);
    this.modal.setAttribute('aria-hidden', 'false');
    this.modal.style.zIndex = '9999';

    // prevent scroll
    this.stopScroll();

    // focus management
    const focusables = focusableElements(this.modal);
    if (focusables.length) focusables[0].focus();
    else (this.modal as HTMLElement).focus && (this.modal as HTMLElement).focus();

    // add listeners
    document.addEventListener('keydown', this.focusTrapHandler, true);
    if (this.options.closeOnEsc) document.addEventListener('keydown', this.escHandler, true);

    // dispatch event
    this.dispatchEvent('rarog:open');
    this.options.onOpen(this.modal);
  }

  public close() {
    if (!this.isOpen) return;
    this.isOpen = false;

    // remove listeners
    document.removeEventListener('keydown', this.focusTrapHandler, true);
    if (this.options.closeOnEsc) document.removeEventListener('keydown', this.escHandler, true);

    // hide modal
    this.modal.classList.remove(this.options.openClass);
    this.modal.setAttribute('aria-hidden', 'true');
    this.modal.style.display = 'none';

    // remove backdrop
    this.removeBackdrop();

    // restore scroll
    this.restoreScroll();

    // return focus
    if (this.options.returnFocus && this.previouslyFocused && (this.previouslyFocused as HTMLElement).focus) {
      try { (this.previouslyFocused as HTMLElement).focus(); } catch (e) { /* ignore */ }
    }

    // dispatch
    this.dispatchEvent('rarog:close');
    this.options.onClose(this.modal);
  }

  public toggle() {
    if (this.isOpen) this.close(); else this.open();
  }

  public destroy() {
    this.close();
    this.removeBackdrop();
    // cleanup attributes
    this.modal.removeAttribute('aria-hidden');
    this.modal.removeAttribute('aria-modal');
    this.modal.removeAttribute('role');
  }

  private dispatchEvent(name: string) {
    try {
      const ev = new CustomEvent(name, { bubbles: true, detail: { modal: this.modal } });
      this.modal.dispatchEvent(ev);
    } catch (e) {
      // ignore in older browsers
    }
  }
}

/**
 * Утилита для инициализации всех модалей на странице по атрибуту data-rarog-modal
 * Возвращает список созданных экземпляров Modal
 */
export function initModals(root: ParentNode = document): Modal[] {
  const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-rarog-modal]'));
  const created: Modal[] = [];
  for (const n of nodes) {
    const backdrop = n.getAttribute('data-rarog-backdrop') !== 'false';
    const closeOnBackdrop = n.getAttribute('data-rarog-close-on-backdrop') !== 'false';
    const closeOnEsc = n.getAttribute('data-rarog-close-on-esc') !== 'false';
    const preventScroll = n.getAttribute('data-rarog-prevent-scroll') !== 'false';

    const m = new Modal({
      modal: n,
      backdrop,
      closeOnBackdrop,
      closeOnEsc,
      preventScroll,
      closeSelector: n.getAttribute('data-rarog-close-selector') || '[data-rarog-close]'
    });
    created.push(m);
  }
  return created;
}

export default Modal;
