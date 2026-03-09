export type RarogElement = HTMLElement | Element | null;
export type RarogCtor<T = unknown> = {
  getOrCreate(element: HTMLElement, options?: Record<string, unknown>): T;
  getInstance?(element: HTMLElement): T | null;
};

declare class DisposableComponent {
  dispose(): void;
  destroy(): void;
}

export declare class Dropdown extends DisposableComponent {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Dropdown;
  static getInstance(element: HTMLElement): Dropdown | null;
  show(): void;
  hide(): void;
  toggle(): void;
}
export declare class Collapse extends DisposableComponent {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Collapse;
  static getInstance(element: HTMLElement): Collapse | null;
  show(): void;
  hide(): void;
  toggle(): void;
}
export declare class Modal extends DisposableComponent {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Modal;
  static getInstance(element: HTMLElement): Modal | null;
  show(): void;
  hide(): void;
  toggle(): void;
}
export declare class Offcanvas extends DisposableComponent {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Offcanvas;
  static getInstance(element: HTMLElement): Offcanvas | null;
  show(): void;
  hide(): void;
  toggle(): void;
}
export declare class Toast extends DisposableComponent {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Toast;
  static getInstance(element: HTMLElement): Toast | null;
  show(): void;
  hide(): void;
}
export declare class Tooltip extends DisposableComponent {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Tooltip;
  static getInstance(element: HTMLElement): Tooltip | null;
  show(): void;
  hide(): void;
}
export declare class Popover extends DisposableComponent {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Popover;
  static getInstance(element: HTMLElement): Popover | null;
  show(): void;
  hide(): void;
  toggle(): void;
}
export declare class Carousel extends DisposableComponent {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Carousel;
  static getInstance(element: HTMLElement): Carousel | null;
  next(): void;
  prev(): void;
  goTo(index: number): void;
  play(): void;
  pause(): void;
}
export declare class Stepper extends DisposableComponent {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Stepper;
  static getInstance(element: HTMLElement): Stepper | null;
  next(): void;
  prev(): void;
  goTo(index: number): void;
  reset(): void;
}
export declare class Datepicker extends DisposableComponent {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Datepicker;
  static getInstance(element: HTMLElement): Datepicker | null;
  show(): void;
  hide(): void;
  toggle(): void;
}
export declare class DatetimePicker extends DisposableComponent {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): DatetimePicker;
  static getInstance(element: HTMLElement): DatetimePicker | null;
}
export declare class Select extends DisposableComponent {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Select;
  static getInstance(element: HTMLElement): Select | null;
  show(): void;
  hide(): void;
  toggle(): void;
}
export declare class Combobox extends DisposableComponent {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Combobox;
  static getInstance(element: HTMLElement): Combobox | null;
  show(): void;
  hide(): void;
  toggle(): void;
}
export declare class TagsInput extends DisposableComponent {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): TagsInput;
  static getInstance(element: HTMLElement): TagsInput | null;
  addTag(value: string): void;
  removeTag(value: string): void;
  clear(): void;
}
export declare class DataTable extends DisposableComponent {
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): DataTable;
  static getInstance(element: HTMLElement): DataTable | null;
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
