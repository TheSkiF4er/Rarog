export interface RarogRuntimeConfig {
  debug: boolean;
}

export interface RarogApi {
  config: RarogRuntimeConfig;
  setDebug(value: boolean): void;
  isDebugEnabled(): boolean;
  init(root?: ParentNode | Document): void;
  initDataApi(root?: ParentNode | Document): void;
  dispose(root?: ParentNode | Document): void;
  reinit(root?: ParentNode | Document): void;
  [key: string]: any;
}

export declare const Dropdown: any;
export declare const Collapse: any;
export declare const Modal: any;
export declare const Offcanvas: any;
export declare const Toast: any;
export declare const Tooltip: any;
export declare const Popover: any;
export declare const Carousel: any;
export declare const Stepper: any;
export declare const Datepicker: any;
export declare const DatetimePicker: any;
export declare const Select: any;
export declare const Combobox: any;
export declare const TagsInput: any;
export declare const DataTable: any;
export declare const InputMask: any;
export declare const Events: any;
export declare const initDataApi: (root?: ParentNode | Document) => void;
export declare const init: (root?: ParentNode | Document) => void;
export declare const dispose: (root?: ParentNode | Document) => void;
export declare const reinit: (root?: ParentNode | Document) => void;
export declare const Rarog: RarogApi;

export default Rarog;
