export type RarogElement = HTMLElement | Element | null;
export type RarogCtor<T = unknown> = {
  getOrCreate(element: HTMLElement, options?: Record<string, unknown>): T;
  getInstance?(element: HTMLElement): T | null;
};

export declare class Dropdown {
  static getInstance(element: HTMLElement): Dropdown | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Dropdown;
  show(): void;
  hide(): void;
  toggle(): void;
}
export declare class Collapse {
  static getInstance(element: HTMLElement): Collapse | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Collapse;
  show(): void;
  hide(): void;
  toggle(): void;
}
export declare class Modal {
  static getInstance(element: HTMLElement): Modal | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Modal;
  show(): void;
  hide(): void;
  toggle(): void;
}
export declare class Offcanvas {
  static getInstance(element: HTMLElement): Offcanvas | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Offcanvas;
  show(): void;
  hide(): void;
  toggle(): void;
}
export declare class Toast {
  static getInstance(element: HTMLElement): Toast | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Toast;
  show(): void;
  hide(): void;
}
export declare class Tooltip {
  static getInstance(element: HTMLElement): Tooltip | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Tooltip;
  show(): void;
  hide(): void;
}
export declare class Popover {
  static getInstance(element: HTMLElement): Popover | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Popover;
  show(): void;
  hide(): void;
}
export declare class Carousel {
  static getInstance(element: HTMLElement): Carousel | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Carousel;
}
export declare class Stepper {
  static getInstance(element: HTMLElement): Stepper | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Stepper;
}
export declare class Datepicker {
  static getInstance(element: HTMLElement): Datepicker | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Datepicker;
}
export declare class DatetimePicker {
  static getInstance(element: HTMLElement): DatetimePicker | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): DatetimePicker;
}
export declare class Select {
  static getInstance(element: HTMLElement): Select | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Select;
}
export declare class Combobox {
  static getInstance(element: HTMLElement): Combobox | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Combobox;
}
export declare class TagsInput {
  static getInstance(element: HTMLElement): TagsInput | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): TagsInput;
}
export declare class DataTable {
  static getInstance(element: HTMLElement): DataTable | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): DataTable;
}
export declare const VERSION: "3.5.0";
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
  VERSION: typeof VERSION;
  config: { debug: boolean };
  setDebug(value: unknown): void;
  isDebugEnabled(): boolean;
  initDataApi: typeof initDataApi;
  init: typeof init;
  dispose: typeof dispose;
  reinit: typeof reinit;
};
export { Rarog };
export default Rarog;
