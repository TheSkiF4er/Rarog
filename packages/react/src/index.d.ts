import * as React from "react";
import type { Dropdown, Modal, Offcanvas } from "@rarog/js";

export type RarogInstanceRef<T> = React.MutableRefObject<T | null>;
export type RarogLifecycleEvent = Event | CustomEvent<Record<string, unknown>>;
export type RarogHookLifecycle = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpen?: (event: RarogLifecycleEvent) => void;
  onClose?: (event: RarogLifecycleEvent) => void;
  onShow?: (event: RarogLifecycleEvent) => void;
  onShown?: (event: RarogLifecycleEvent) => void;
  onHide?: (event: RarogLifecycleEvent) => void;
  onHidden?: (event: RarogLifecycleEvent) => void;
};
export type RarogHookResult<T> = {
  ref: React.MutableRefObject<HTMLElement | null>;
  instance: RarogInstanceRef<T>;
  api: {
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
    destroy(): void;
  };
};

export declare function useRarogInit<T>(
  ComponentClass: { getOrCreate(element: HTMLElement, options?: Record<string, unknown>): T },
  options?: Record<string, unknown>
): RarogHookResult<T>;
export declare function useModal(options?: Record<string, unknown>, lifecycle?: RarogHookLifecycle): RarogHookResult<Modal>;
export declare function useOffcanvas(options?: Record<string, unknown>, lifecycle?: RarogHookLifecycle): RarogHookResult<Offcanvas>;
export declare function useDropdown(options?: Record<string, unknown>, lifecycle?: RarogHookLifecycle): RarogHookResult<Dropdown>;

export interface RarogProviderProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof React.JSX.IntrinsicElements;
  autoInit?: boolean;
  reinitOnChildrenChange?: boolean;
  children?: React.ReactNode;
}
export declare const RarogProvider: React.ForwardRefExoticComponent<RarogProviderProps & React.RefAttributes<HTMLElement>>;

export interface RarogComponentHandle<T = unknown> {
  element: HTMLElement | null;
  instance: T | null;
  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
  destroy(): void;
}
export interface RarogModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onShow" | "onHide">, RarogHookLifecycle {
  id?: string;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  closeLabel?: string;
  dialogClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  options?: Record<string, unknown>;
  children?: React.ReactNode;
}
export declare const RarogModal: React.ForwardRefExoticComponent<RarogModalProps & React.RefAttributes<RarogComponentHandle<Modal>>>;

export interface RarogOffcanvasProps extends Omit<React.HTMLAttributes<HTMLElement>, "onShow" | "onHide">, RarogHookLifecycle {
  id?: string;
  title?: React.ReactNode;
  placement?: "start" | "end" | "bottom";
  closeLabel?: string;
  headerClassName?: string;
  bodyClassName?: string;
  options?: Record<string, unknown>;
  children?: React.ReactNode;
}
export declare const RarogOffcanvas: React.ForwardRefExoticComponent<RarogOffcanvasProps & React.RefAttributes<RarogComponentHandle<Offcanvas>>>;

export interface RarogDropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onShow" | "onHide">, RarogHookLifecycle {
  label?: React.ReactNode;
  menuId?: string;
  buttonClassName?: string;
  menuClassName?: string;
  align?: "start" | "end";
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  options?: Record<string, unknown>;
  children?: React.ReactNode;
}
export declare const RarogDropdown: React.ForwardRefExoticComponent<RarogDropdownProps & React.RefAttributes<RarogComponentHandle<Dropdown>>>;

export declare const Rarog: unknown;

declare const _default: {
  RarogProvider: typeof RarogProvider;
  RarogModal: typeof RarogModal;
  RarogOffcanvas: typeof RarogOffcanvas;
  RarogDropdown: typeof RarogDropdown;
  useRarogInit: typeof useRarogInit;
  useModal: typeof useModal;
  useOffcanvas: typeof useOffcanvas;
  useDropdown: typeof useDropdown;
};
export default _default;
