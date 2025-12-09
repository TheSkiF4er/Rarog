/**
 * packages/js/src/dropdown.ts
 *
 * Rarog — vanilla JS компонент Dropdown (меню).
 * Автор: TheSkiF4er
 *
 * Цели:
 * - Простая, небольшая, но доступная реализация выпадающего меню.
 * - Поддерживает клавиатурную навигацию (ArrowUp/Down, Home/End, Enter/Space, Esc).
 * - Управление фокусом: при открытии фокус перемещается в первый/выбранный элемент,
 *   при закрытии — возвращается на триггер.
 * - Закрытие по клику вне элемента и по выбору пункта (configurable).
 * - ARIA: aria-haspopup, aria-expanded, role=menu/menubar/menuitem, aria-controls.
 * - Лёгкая инициализация через data-атрибуты и программный API.
 *
 * Использование (HTML):
 * <button class="r-dropdown__trigger" aria-haspopup="menu" aria-expanded="false" data-rarog-dropdown-trigger>
 *   Меню
 * </button>
 * <ul class="r-dropdown__menu" role="menu" data-rarog-dropdown-menu>
 *   <li role="menuitem" tabindex="-1">Пункт 1</li>
 *   <li role="menuitem" tabindex="-1">Пункт 2</li>
 * </ul>
 *
 * Или программно:
 * const dd = new Dropdown(triggerElement, menuElement, { closeOnSelect: true });
 *
 * Поддерживаемые опции:
 * - closeOnSelect: boolean (закрывать меню при выборе пункта) — default: true
 * - focusOnOpen: 'first' | 'selected' | 'none' — default: 'first'
 * - rovingTabIndex: boolean — если true, использует roving tabindex (табуляция только по trigger) — default: true
 * - preventScrolling: boolean — предотвращать скролл при навигации стрелками — default: true
 *
 * Примечание: компонент не зависит от CSS и не навязывает стили — лишь управляет DOM и aria.
 */

type Nullable<T> = T | null;

export interface DropdownOptions {
  closeOnSelect?: boolean;
  focusOnOpen?: 'first' | 'selected' | 'none';
  rovingTabIndex?: boolean;
  preventScrolling?: boolean;
  // Колбэки
  onOpen?: (instance: Dropdown) => void;
  onClose?: (instance: Dropdown) => void;
  onSelect?: (instance: Dropdown, item: HTMLElement) => void;
}

const DEFAULTS: Required<DropdownOptions> = {
  closeOnSelect: true,
  focusOnOpen: 'first',
  rovingTabIndex: true,
  preventScrolling: true,
  onOpen: () => {},
  onClose: () => {},
  onSelect: () => {},
};

export class Dropdown {
  trigger: HTMLElement;
  menu: HTMLElement;
  options: Required<DropdownOptions>;
  open: boolean;
  items: HTMLElement[];
  boundOnDocumentClick: (e: MouseEvent) => void;
  boundOnTriggerKeydown: (e: KeyboardEvent) => void;
  boundOnMenuKeydown: (e: KeyboardEvent) => void;
  boundOnItemClick: (e: MouseEvent) => void;
  id: string;

  /**
   * @param trigger элемент-триггер (кнопка)
   * @param menu список (ul/ol/div) с role="menu"
   * @param options опции компонента
   */
  constructor(trigger: HTMLElement, menu: HTMLElement, options?: DropdownOptions) {
    if (!trigger) throw new Error('Dropdown: trigger is required');
    if (!menu) throw new Error('Dropdown: menu is required');

    this.trigger = trigger;
    this.menu = menu;
    this.options = { ...DEFAULTS, ...(options || {}) };
    this.open = false;
    this.items = [];
    this.id = this.menu.id || `rarog-dropdown-${Math.random().toString(36).slice(2, 9)}`;

    // Bind handlers once
    this.boundOnDocumentClick = this.onDocumentClick.bind(this);
    this.boundOnTriggerKeydown = this.onTriggerKeydown.bind(this);
    this.boundOnMenuKeydown = this.onMenuKeydown.bind(this);
    this.boundOnItemClick = this.onItemClick.bind(this);

    this.setup();
  }

  /** Инициализация: ARIA, поиск элементов, вешаем слушатели */
  private setup() {
    // Ensure menu has id (for aria-controls)
    if (!this.menu.id) this.menu.id = this.id;
    // ARIA attributes on trigger
    this.trigger.setAttribute('aria-haspopup', 'menu');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.setAttribute('aria-controls', this.menu.id);
    this.trigger.setAttribute('type', this.trigger.getAttribute('type') || 'button');

    // Menu role
    if (!this.menu.hasAttribute('role')) this.menu.setAttribute('role', 'menu');
    // Hide menu visually for screen readers until opened
    this.menu.setAttribute('aria-hidden', 'true');

    // Collect items: direct descendants with role=menuitem (or elements)
    this.refreshItems();

    // Setup initial tabindex strategy
    if (this.options.rovingTabIndex) {
      // Make all items tabindex -1 (not focusable by tab), user navigates with arrows
      this.items.forEach((it) => it.setAttribute('tabindex', '-1'));
      // Only trigger is tabbable
      this.trigger.setAttribute('tabindex', '0');
    }

    // Event listeners
    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });
    this.trigger.addEventListener('keydown', this.boundOnTriggerKeydown);

    // Keyboard inside menu
    this.menu.addEventListener('keydown', this.boundOnMenuKeydown);

    // Click on items
    this.items.forEach((it) => it.addEventListener('click', this.boundOnItemClick));

    // Ensure menu is hidden initially (CSS libs may override)
    this.menu.setAttribute('hidden', ''); // semantic hide; consumer can style [hidden] as display:none
  }

  /** Обновить список пунктов (если меню меняется динамически) */
  refreshItems() {
    const nodeList = Array.from(this.menu.querySelectorAll<HTMLElement>('[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], li, a, button')) as HTMLElement[];
    // Filter out elements that are not visible
    this.items = nodeList.filter((el) => el.offsetParent !== null || el.getAttribute('aria-hidden') !== 'true');
    // Ensure semantic roles
    this.items.forEach((it) => {
      if (!it.getAttribute('role')) it.setAttribute('role', 'menuitem');
    });
  }

  /** Открыть меню */
  openMenu() {
    if (this.open) return;
    this.refreshItems();
    this.open = true;
    this.trigger.setAttribute('aria-expanded', 'true');
    this.menu.removeAttribute('hidden');
    this.menu.setAttribute('aria-hidden', 'false');
    // add document click capture to close on outside click
    document.addEventListener('click', this.boundOnDocumentClick);
    // focus management
    if (this.options.focusOnOpen === 'first') {
      const first = this.items[0];
      if (first) this.focusItem(first);
    } else if (this.options.focusOnOpen === 'selected') {
      const sel = this.items.find((it) => it.classList.contains('is-selected'));
      if (sel) this.focusItem(sel);
      else if (this.items[0]) this.focusItem(this.items[0]);
    } // 'none' => focus stays on trigger

    // Optional callback
    try { this.options.onOpen(this); } catch (e) { /* ignore */ }
  }

  /** Закрыть меню */
  closeMenu(returnFocus = true) {
    if (!this.open) return;
    this.open = false;
    this.trigger.setAttribute('aria-expanded', 'false');
    this.menu.setAttribute('aria-hidden', 'true');
    this.menu.setAttribute('hidden', '');
    document.removeEventListener('click', this.boundOnDocumentClick);

    // возвращаем фокус на триггер, если нужно
    if (returnFocus) {
      try {
        this.trigger.focus();
      } catch (e) { /* ignore */ }
    }

    try { this.options.onClose(this); } catch (e) { /* ignore */ }
  }

  /** Переключить состояние */
  toggle() {
    if (this.open) this.closeMenu(true);
    else this.openMenu();
  }

  /** Обработчик клика вне компонента — закрываем меню */
  private onDocumentClick(e: MouseEvent) {
    const target = e.target as Node;
    if (!this.menu.contains(target) && !this.trigger.contains(target)) {
      this.closeMenu(true);
    }
  }

  /** Обработка клавиш на триггере (когда фокус на кнопке) */
  private onTriggerKeydown(e: KeyboardEvent) {
    const key = e.key;
    if (key === 'ArrowDown' || key === 'Down') {
      e.preventDefault();
      this.openMenu();
      // focus will move to first item by openMenu
    } else if (key === 'ArrowUp' || key === 'Up') {
      e.preventDefault();
      this.openMenu();
      // focus last item
      const last = this.items[this.items.length - 1];
      if (last) this.focusItem(last);
    } else if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
      e.preventDefault();
      this.toggle();
    }
  }

  /** Обработка клавиш внутри меню */
  private onMenuKeydown(e: KeyboardEvent) {
    const key = e.key;
    const target = e.target as HTMLElement;
    if (!target) return;

    const idx = this.items.indexOf(target);
    const lastIndex = this.items.length - 1;

    switch (key) {
      case 'ArrowDown':
      case 'Down': {
        e.preventDefault();
        const next = this.items[(idx + 1) > lastIndex ? 0 : (idx + 1)];
        if (next) this.focusItem(next);
        if (this.options.preventScrolling) e.preventDefault();
        break;
      }
      case 'ArrowUp':
      case 'Up': {
        e.preventDefault();
        const prev = this.items[(idx - 1) < 0 ? lastIndex : (idx - 1)];
        if (prev) this.focusItem(prev);
        if (this.options.preventScrolling) e.preventDefault();
        break;
      }
      case 'Home': {
        e.preventDefault();
        const first = this.items[0];
        if (first) this.focusItem(first);
        break;
      }
      case 'End': {
        e.preventDefault();
        const last = this.items[lastIndex];
        if (last) this.focusItem(last);
        break;
      }
      case 'Escape':
      case 'Esc': {
        e.preventDefault();
        this.closeMenu(true);
        break;
      }
      case 'Enter':
      case ' ':
      case 'Spacebar': {
        // simulate click/select
        e.preventDefault();
        this.activateItem(target);
        break;
      }
      case 'Tab': {
        // allow tab to close menu and move focus naturally
        this.closeMenu(false);
        break;
      }
      default:
        break;
    }
  }

  /** Обработка клика по элементу меню */
  private onItemClick(e: MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    if (!target) return;
    this.activateItem(target);
  }

  /** Активировать (выбрать) пункт — вызываем колбэк, возможно закрываем */
  private activateItem(item: HTMLElement) {
    try { this.options.onSelect(this, item); } catch (e) { /* ignore */ }

    if (this.options.closeOnSelect) {
      this.closeMenu(true);
    } else {
      // при необходимости выделяем как выбранный
      this.items.forEach((it) => it.classList.remove('is-selected'));
      item.classList.add('is-selected');
      // оставляем фокус на пункте
      try { item.focus(); } catch (e) { /* ignore */ }
    }
  }

  /** Установить фокус на элемент меню (и если rovingTabIndex — управлять tabindex'ами) */
  private focusItem(item: HTMLElement) {
    if (!item) return;
    if (this.options.rovingTabIndex) {
      // все элементы tabindex -1, целевой — 0
      this.items.forEach((it) => it.setAttribute('tabindex', '-1'));
      item.setAttribute('tabindex', '0');
    }
    try { item.focus(); } catch (e) { /* ignore */ }
  }

  /** Программно выбирать пункт по индексу */
  selectIndex(index: number) {
    if (index < 0 || index >= this.items.length) return;
    this.activateItem(this.items[index]);
  }

  /** Деинициализация (снять слушатели) */
  destroy() {
    document.removeEventListener('click', this.boundOnDocumentClick);
    this.trigger.removeEventListener('keydown', this.boundOnTriggerKeydown);
    this.menu.removeEventListener('keydown', this.boundOnMenuKeydown);
    this.items.forEach((it) => it.removeEventListener('click', this.boundOnItemClick));
    // restore attributes?
    this.trigger.removeAttribute('aria-haspopup');
    this.trigger.removeAttribute('aria-expanded');
    this.trigger.removeAttribute('aria-controls');
    this.menu.removeAttribute('aria-hidden');
    if (this.menu.hasAttribute('hidden')) this.menu.removeAttribute('hidden');
  }

  // --- Статические утилиты для автоинициализации ---

  /**
   * Инициализировать все dropdown'ы на странице по data-атрибутам:
   * data-rarog-dropdown-trigger и data-rarog-dropdown-menu (или data-rarog-dropdown target-id)
   */
  static initAll(root: ParentNode = document) {
    const triggers = Array.from(root.querySelectorAll<HTMLElement>('[data-rarog-dropdown-trigger]'));
    const instances: Dropdown[] = [];
    triggers.forEach((trigger) => {
      // Try to find menu:
      const menuSelector = trigger.getAttribute('data-rarog-dropdown') || trigger.getAttribute('data-rarog-dropdown-target');
      let menu: Nullable<HTMLElement> = null;
      if (menuSelector) {
        menu = document.querySelector<HTMLElement>(menuSelector);
      } else {
        // find sibling menu
        menu = trigger.nextElementSibling as HTMLElement;
        if (menu && !menu.hasAttribute('data-rarog-dropdown-menu')) {
          // try to find within parent
          const parent = trigger.parentElement;
          if (parent) menu = parent.querySelector<HTMLElement>('[data-rarog-dropdown-menu]') || menu;
        }
      }
      if (!menu) {
        // fallback: try attribute on menu element
        menu = document.querySelector<HTMLElement>('[data-rarog-dropdown-menu]');
      }
      if (menu) {
        const opts: DropdownOptions = {};
        const closeAttr = trigger.getAttribute('data-rarog-dropdown-close');
        if (closeAttr === 'false') opts.closeOnSelect = false;
        const focusAttr = trigger.getAttribute('data-rarog-dropdown-focus');
        if (focusAttr === 'none') opts.focusOnOpen = 'none';
        else if (focusAttr === 'selected') opts.focusOnOpen = 'selected';
        else opts.focusOnOpen = 'first';
        const inst = new Dropdown(trigger, menu, opts);
        instances.push(inst);
      }
    });
    return instances;
  }
}

/* Auto-init на DOMContentLoaded (опционально) */
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Dropdown.initAll(document));
  } else {
    // already loaded
    Dropdown.initAll(document);
  }
}
