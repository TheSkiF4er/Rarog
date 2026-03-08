export type RarogElement = HTMLElement | Element | null;
export type RarogCtor<T = unknown> = {
  getOrCreate(element: HTMLElement, options?: Record<string, unknown>): T;
  getInstance?(element: HTMLElement): T | null;
};

export declare class Dropdown {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Dropdown;
  show(): void;
  hide(): void;
  toggle(): void;
}
export declare class Collapse {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Collapse;
  show(): void;
  hide(): void;
  toggle(): void;
}
export declare class Modal {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Modal;
  show(): void;
  hide(): void;
  toggle(): void;
}
export declare class Offcanvas {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Offcanvas;
  show(): void;
  hide(): void;
  toggle(): void;
}
export declare class Toast {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Toast;
  show(): void;
  hide(): void;
}
export declare class Tooltip {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Tooltip;
  show(): void;
  hide(): void;
}
export declare class Popover {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Popover;
  show(): void;
  hide(): void;
}
export declare class Carousel {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Carousel;
}
export declare class Stepper {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Stepper;
}
export declare class Datepicker {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Datepicker;
}
export declare class DatetimePicker {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): DatetimePicker;
}
export declare class Select {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Select;
}
export declare class Combobox {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Combobox;
}
export declare class TagsInput {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): TagsInput;
}
export declare class DataTable {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): DataTable;
}
export declare const Events: {
  on(type: string, handler: (payload: unknown) => void): void;
  off(type: string, handler: (payload: unknown) => void): void;
  emit(type: string, payload?: unknown): void;
};
export declare function initDataApi(root?: ParentNode): void;
export declare function init(root?: ParentNode): void;
export declare function dispose(root?: ParentNode): void;
export declare function reinit(root?: ParentNode): void;

declare const Rarog: {
  Dropdown: typeof Dropdown;
  Collapse: typeof Collapse;
  Modal: typeof Modal;
  Offcanvas: typeof Offcanvas;
  Toast: typeof Toast;
  Tooltip: typeof Tooltip;
  Popover: typeof Popover;
  Carousel: typeof Carousel;
  Stepper: typeof Stepper;
  Datepicker: typeof Datepicker;
  DatetimePicker: typeof DatetimePicker;
  Select: typeof Select;
  Combobox: typeof Combobox;
  TagsInput: typeof TagsInput;
  DataTable: typeof DataTable;
  Events: typeof Events;
  initDataApi: typeof initDataApi;
  init: typeof init;
  dispose: typeof dispose;
  reinit: typeof reinit;
};
export { Rarog };
export default Rarog;
