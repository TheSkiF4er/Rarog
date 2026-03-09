import type { DefineComponent, Plugin, Ref } from "vue";
import type { Dropdown, Modal, Offcanvas } from "@rarog/js";

export type RarogLifecycleEvent = Event | CustomEvent<Record<string, unknown>>;
export type RarogHookResult<T> = { el: Ref<HTMLElement | null>; instance: Ref<T | null> };
export type RarogLifecycleProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onShow?: (event: RarogLifecycleEvent) => void;
  onShown?: (event: RarogLifecycleEvent) => void;
  onHide?: (event: RarogLifecycleEvent) => void;
  onHidden?: (event: RarogLifecycleEvent) => void;
  onOpen?: (event: RarogLifecycleEvent) => void;
  onClose?: (event: RarogLifecycleEvent) => void;
};

export declare function useRarogInit<T>(ComponentClass: { getOrCreate(element: HTMLElement, options?: Record<string, unknown>): T }, options?: Record<string, unknown>): RarogHookResult<T>;
export declare function useModal(options?: Record<string, unknown>): RarogHookResult<Modal>;
export declare function useOffcanvas(options?: Record<string, unknown>): RarogHookResult<Offcanvas>;
export declare function useDropdown(options?: Record<string, unknown>): RarogHookResult<Dropdown>;

export declare const RarogProvider: DefineComponent<{
  as?: string;
  autoInit?: boolean;
  reinitOnChildrenChange?: boolean;
}>;

export declare const RarogModal: DefineComponent<{
  id?: string;
  title?: string;
  closeLabel?: string;
  className?: string;
  dialogClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  options?: Record<string, unknown>;
  open?: boolean;
  defaultOpen?: boolean;
}, {}, {}, {}, {}, {}, {}, {
  show: (event: RarogLifecycleEvent) => true;
  shown: (event: RarogLifecycleEvent) => true;
  hide: (event: RarogLifecycleEvent) => true;
  hidden: (event: RarogLifecycleEvent) => true;
  open: (event: RarogLifecycleEvent) => true;
  close: (event: RarogLifecycleEvent) => true;
  "update:open": (value: boolean) => true;
}>;

export declare const RarogOffcanvas: DefineComponent<{
  id?: string;
  title?: string;
  placement?: "start" | "end" | "bottom";
  closeLabel?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  options?: Record<string, unknown>;
  open?: boolean;
  defaultOpen?: boolean;
}, {}, {}, {}, {}, {}, {}, {
  show: (event: RarogLifecycleEvent) => true;
  shown: (event: RarogLifecycleEvent) => true;
  hide: (event: RarogLifecycleEvent) => true;
  hidden: (event: RarogLifecycleEvent) => true;
  open: (event: RarogLifecycleEvent) => true;
  close: (event: RarogLifecycleEvent) => true;
  "update:open": (value: boolean) => true;
}>;

export declare const RarogDropdown: DefineComponent<{
  label?: string;
  menuId?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  align?: "start" | "end";
  options?: Record<string, unknown>;
  open?: boolean;
  defaultOpen?: boolean;
}, {}, {}, {}, {}, {}, {}, {
  show: (event: RarogLifecycleEvent) => true;
  shown: (event: RarogLifecycleEvent) => true;
  hide: (event: RarogLifecycleEvent) => true;
  hidden: (event: RarogLifecycleEvent) => true;
  open: (event: RarogLifecycleEvent) => true;
  close: (event: RarogLifecycleEvent) => true;
  "update:open": (value: boolean) => true;
}>;

export declare const RarogPlugin: Plugin;
export declare const Rarog: unknown;
export default RarogPlugin;
