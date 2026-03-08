import * as React from "react";
import type { Dropdown, Modal, Offcanvas } from "@rarog/js";

export type RarogInstanceRef<T> = React.MutableRefObject<T | null>;
export type RarogHookResult<T> = { ref: React.MutableRefObject<HTMLElement | null>; instance: RarogInstanceRef<T> };

export declare function useRarogInit<T>(ComponentClass: { getOrCreate(element: HTMLElement, options?: Record<string, unknown>): T }, options?: Record<string, unknown>): RarogHookResult<T>;
export declare function useModal(options?: Record<string, unknown>): RarogHookResult<Modal>;
export declare function useOffcanvas(options?: Record<string, unknown>): RarogHookResult<Offcanvas>;
export declare function useDropdown(options?: Record<string, unknown>): RarogHookResult<Dropdown>;

export interface RarogProviderProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}
export declare const RarogProvider: React.ForwardRefExoticComponent<RarogProviderProps & React.RefAttributes<HTMLElement>>;

export interface RarogModalHandle {
  element: HTMLElement | null;
  show(): void;
  hide(): void;
  toggle(): void;
}
export interface RarogModalProps extends React.HTMLAttributes<HTMLDivElement> {
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
export declare const RarogModal: React.ForwardRefExoticComponent<RarogModalProps & React.RefAttributes<RarogModalHandle>>;

export interface RarogOffcanvasHandle {
  element: HTMLElement | null;
  show(): void;
  hide(): void;
  toggle(): void;
}
export interface RarogOffcanvasProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  title?: React.ReactNode;
  placement?: "start" | "end" | "bottom";
  closeLabel?: string;
  headerClassName?: string;
  bodyClassName?: string;
  options?: Record<string, unknown>;
  children?: React.ReactNode;
}
export declare const RarogOffcanvas: React.ForwardRefExoticComponent<RarogOffcanvasProps & React.RefAttributes<RarogOffcanvasHandle>>;

export interface RarogDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  menuId?: string;
  buttonClassName?: string;
  menuClassName?: string;
  align?: "start" | "end";
  children?: React.ReactNode;
}
export declare const RarogDropdown: React.ForwardRefExoticComponent<RarogDropdownProps & React.RefAttributes<HTMLDivElement>>;

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
