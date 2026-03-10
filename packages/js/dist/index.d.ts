export type RarogElement = HTMLElement | Element | null;
export type RarogTarget = HTMLElement | null;

export interface RarogConfigShape {
  debug: boolean;
}

export interface RarogBaseEventDetail<TInstance = unknown> {
  instance?: TInstance;
  trigger?: HTMLElement | null;
  target?: HTMLElement | null;
}

export interface RarogPlacementEventDetail<TInstance = unknown>
  extends RarogBaseEventDetail<TInstance> {
  placement?: string | null;
}

export interface RarogCarouselEventDetail<TInstance = unknown>
  extends RarogBaseEventDetail<TInstance> {
  index: number;
  fromIndex?: number;
  toIndex?: number;
  direction?: "next" | "prev" | "goto" | null;
}

export interface RarogValueEventDetail<TInstance = unknown, TValue = unknown>
  extends RarogBaseEventDetail<TInstance> {
  value: TValue;
}

export interface RarogTagsInputChangeDetail<TInstance = unknown>
  extends RarogBaseEventDetail<TInstance> {
  values: string[];
  added?: string | null;
  removed?: string | null;
}

export interface RarogTableEventDetail<TInstance = unknown>
  extends RarogBaseEventDetail<TInstance> {
  page?: number;
  pages?: number;
  search?: string;
  sortKey?: string | null;
  sortDir?: "asc" | "desc" | null;
  total?: number;
  visibleRows?: number;
}

export interface RarogEventMap {
  "rg:dropdown:show": RarogBaseEventDetail<Dropdown>;
  "rg:dropdown:shown": RarogBaseEventDetail<Dropdown>;
  "rg:dropdown:hide": RarogBaseEventDetail<Dropdown>;
  "rg:dropdown:hidden": RarogBaseEventDetail<Dropdown>;
  "rg:collapse:show": RarogBaseEventDetail<Collapse>;
  "rg:collapse:shown": RarogBaseEventDetail<Collapse>;
  "rg:collapse:hide": RarogBaseEventDetail<Collapse>;
  "rg:collapse:hidden": RarogBaseEventDetail<Collapse>;
  "rg:modal:show": RarogBaseEventDetail<Modal>;
  "rg:modal:shown": RarogBaseEventDetail<Modal>;
  "rg:modal:hide": RarogBaseEventDetail<Modal>;
  "rg:modal:hidden": RarogBaseEventDetail<Modal>;
  "rg:offcanvas:show": RarogBaseEventDetail<Offcanvas>;
  "rg:offcanvas:shown": RarogBaseEventDetail<Offcanvas>;
  "rg:offcanvas:hide": RarogBaseEventDetail<Offcanvas>;
  "rg:offcanvas:hidden": RarogBaseEventDetail<Offcanvas>;
  "rg:toast:show": RarogBaseEventDetail<Toast>;
  "rg:toast:shown": RarogBaseEventDetail<Toast>;
  "rg:toast:hide": RarogBaseEventDetail<Toast>;
  "rg:toast:hidden": RarogBaseEventDetail<Toast>;
  "rg:tooltip:show": RarogPlacementEventDetail<Tooltip>;
  "rg:tooltip:shown": RarogPlacementEventDetail<Tooltip>;
  "rg:tooltip:hide": RarogPlacementEventDetail<Tooltip>;
  "rg:tooltip:hidden": RarogPlacementEventDetail<Tooltip>;
  "rg:popover:show": RarogPlacementEventDetail<Popover>;
  "rg:popover:shown": RarogPlacementEventDetail<Popover>;
  "rg:popover:hide": RarogPlacementEventDetail<Popover>;
  "rg:popover:hidden": RarogPlacementEventDetail<Popover>;
  "rg:carousel:slide": RarogCarouselEventDetail<Carousel>;
  "rg:carousel:slid": RarogCarouselEventDetail<Carousel>;
  "rg:carousel:next": RarogCarouselEventDetail<Carousel>;
  "rg:carousel:prev": RarogCarouselEventDetail<Carousel>;
  "rg:carousel:goto": RarogCarouselEventDetail<Carousel>;
  "rg:carousel:play": RarogBaseEventDetail<Carousel>;
  "rg:carousel:pause": RarogBaseEventDetail<Carousel>;
  "rg:stepper:change": RarogValueEventDetail<Stepper, number>;
  "rg:stepper:changed": RarogValueEventDetail<Stepper, number>;
  "rg:stepper:next": RarogValueEventDetail<Stepper, number>;
  "rg:stepper:prev": RarogValueEventDetail<Stepper, number>;
  "rg:stepper:goto": RarogValueEventDetail<Stepper, number>;
  "rg:stepper:reset": RarogValueEventDetail<Stepper, number>;
  "rg:datepicker:show": RarogBaseEventDetail<Datepicker>;
  "rg:datepicker:shown": RarogBaseEventDetail<Datepicker>;
  "rg:datepicker:hide": RarogBaseEventDetail<Datepicker>;
  "rg:datepicker:hidden": RarogBaseEventDetail<Datepicker>;
  "rg:datepicker:select": RarogValueEventDetail<Datepicker, string | null>;
  "rg:select:show": RarogBaseEventDetail<Select>;
  "rg:select:shown": RarogBaseEventDetail<Select>;
  "rg:select:hide": RarogBaseEventDetail<Select>;
  "rg:select:hidden": RarogBaseEventDetail<Select>;
  "rg:select:change": RarogValueEventDetail<Select, string | string[] | Set<string> | null>;
  "rg:combobox:show": RarogBaseEventDetail<Combobox>;
  "rg:combobox:shown": RarogBaseEventDetail<Combobox>;
  "rg:combobox:hide": RarogBaseEventDetail<Combobox>;
  "rg:combobox:hidden": RarogBaseEventDetail<Combobox>;
  "rg:combobox:change": RarogValueEventDetail<Combobox, string | null>;
  "rg:combobox:open": RarogBaseEventDetail<Combobox>;
  "rg:combobox:close": RarogBaseEventDetail<Combobox>;
  "rg:tags-input:add": RarogValueEventDetail<TagsInput, string>;
  "rg:tags-input:remove": RarogValueEventDetail<TagsInput, string>;
  "rg:tags-input:change": RarogTagsInputChangeDetail<TagsInput>;
  "rg:table:search": RarogTableEventDetail<DataTable>;
  "rg:table:sort": RarogTableEventDetail<DataTable>;
  "rg:table:page": RarogTableEventDetail<DataTable>;
  "rg:table:update": RarogTableEventDetail<DataTable>;
  "rg:core:dispose": { root: ParentNode | Document | HTMLElement };
}

export type RarogEventName = keyof RarogEventMap;
export type RarogEventDetail<TName extends RarogEventName> = RarogEventMap[TName];
export type RarogCustomEvent<TName extends RarogEventName> = CustomEvent<RarogEventMap[TName]>;

export declare class Dropdown {
  constructor(element: HTMLElement, options?: Record<string, unknown>);
  static getInstance(element: HTMLElement): Dropdown | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Dropdown;
  show(): void;
  hide(): void;
  toggle(): void;
}

export declare class Collapse {
  constructor(element: HTMLElement, options?: Record<string, unknown>);
  static getInstance(element: HTMLElement): Collapse | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Collapse;
  show(): void;
  hide(): void;
  toggle(): void;
}

export declare class Modal {
  constructor(element: HTMLElement, options?: Record<string, unknown>);
  static getInstance(element: HTMLElement): Modal | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Modal;
  show(): void;
  hide(): void;
  toggle(): void;
}

export declare class Offcanvas {
  constructor(element: HTMLElement, options?: Record<string, unknown>);
  static getInstance(element: HTMLElement): Offcanvas | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Offcanvas;
  show(): void;
  hide(): void;
  toggle(): void;
}

export declare class Toast {
  constructor(element: HTMLElement, options?: Record<string, unknown>);
  static getInstance(element: HTMLElement): Toast | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Toast;
  show(): void;
  hide(): void;
}

export declare class Tooltip {
  constructor(element: HTMLElement, options?: Record<string, unknown>);
  static getInstance(element: HTMLElement): Tooltip | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Tooltip;
  show(): void;
  hide(): void;
  toggle(): void;
}

export declare class Popover {
  constructor(element: HTMLElement, options?: Record<string, unknown>);
  static getInstance(element: HTMLElement): Popover | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Popover;
  show(): void;
  hide(): void;
  toggle(): void;
}

export declare class Carousel {
  constructor(element: HTMLElement, options?: Record<string, unknown>);
  static getInstance(element: HTMLElement): Carousel | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Carousel;
  next(): void;
  prev(): void;
  goTo(index: number): void;
  play(): void;
  pause(): void;
  destroy(): void;
}

export declare class Stepper {
  constructor(element: HTMLElement, options?: Record<string, unknown>);
  static getInstance(element: HTMLElement): Stepper | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Stepper;
  next(): void;
  prev(): void;
  goTo(index: number): void;
  reset(): void;
  destroy(): void;
}

export declare class Datepicker {
  constructor(element: HTMLElement, options?: Record<string, unknown>);
  static getInstance(element: HTMLElement): Datepicker | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Datepicker;
  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}

export declare class DatetimePicker extends Datepicker {
  constructor(element: HTMLElement, options?: Record<string, unknown>);
  static getInstance(element: HTMLElement): DatetimePicker | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): DatetimePicker;
}

export declare class Select {
  constructor(element: HTMLElement, options?: Record<string, unknown>);
  static getInstance(element: HTMLElement): Select | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Select;
  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}

export declare class Combobox {
  constructor(element: HTMLElement, options?: Record<string, unknown>);
  static getInstance(element: HTMLElement): Combobox | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): Combobox;
  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}

export declare class TagsInput {
  constructor(element: HTMLElement, options?: Record<string, unknown>);
  static getInstance(element: HTMLElement): TagsInput | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): TagsInput;
  addTag(value: string): void;
  removeTag(value: string): void;
  clear(): void;
  dispose(): void;
}

export declare class DataTable {
  constructor(element: HTMLElement, options?: Record<string, unknown>);
  static getInstance(element: HTMLElement): DataTable | null;
  static getOrCreate(element: HTMLElement, options?: Record<string, unknown>): DataTable;
  dispose(): void;
}

export declare class InputMask {
  constructor(element: HTMLInputElement, pattern: string);
  static apply(element: HTMLInputElement, pattern: string): void;
  static remove(element: HTMLInputElement): void;
}

export declare const Events: {
  on<TName extends RarogEventName>(
    type: TName,
    handler: (payload: RarogEventMap[TName]) => void
  ): void;
  off<TName extends RarogEventName>(
    type: TName,
    handler: (payload: RarogEventMap[TName]) => void
  ): void;
  emit<TName extends RarogEventName>(
    type: TName,
    payload?: RarogEventMap[TName]
  ): void;
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
  InputMask: typeof InputMask;
  Events: typeof Events;
  config: RarogConfigShape;
  setDebug(value: boolean): void;
  isDebugEnabled(): boolean;
  initDataApi: typeof initDataApi;
  init: typeof init;
  dispose: typeof dispose;
  reinit: typeof reinit;
};

export { Rarog };
export default Rarog;

export declare const VERSION: "3.5.0";
