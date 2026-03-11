import * as React from "react";
import type { Collapse, Dropdown, Modal, Offcanvas, Tooltip } from "@rarog/js";

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
export declare function useTooltip(options?: Record<string, unknown>, lifecycle?: RarogHookLifecycle): RarogHookResult<Tooltip>;
export declare function useCollapse(options?: Record<string, unknown>, lifecycle?: RarogHookLifecycle): RarogHookResult<Collapse>;

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

export interface RarogButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: keyof React.JSX.IntrinsicElements;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}
export declare const RarogButton: React.ForwardRefExoticComponent<RarogButtonProps & React.RefAttributes<HTMLElement>>;

export interface RarogInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}
export declare const RarogInput: React.ForwardRefExoticComponent<RarogInputProps & React.RefAttributes<HTMLInputElement>>;

export interface RarogTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}
export declare const RarogTextarea: React.ForwardRefExoticComponent<RarogTextareaProps & React.RefAttributes<HTMLTextAreaElement>>;

export interface RarogSelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}
export declare const RarogSelectField: React.ForwardRefExoticComponent<RarogSelectFieldProps & React.RefAttributes<HTMLSelectElement>>;

export interface RarogCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  inputClassName?: string;
}
export declare const RarogCheckbox: React.ForwardRefExoticComponent<RarogCheckboxProps & React.RefAttributes<HTMLInputElement>>;

export interface RarogRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  inputClassName?: string;
}
export declare const RarogRadio: React.ForwardRefExoticComponent<RarogRadioProps & React.RefAttributes<HTMLInputElement>>;

export interface RarogSwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (value: boolean) => void;
  label?: React.ReactNode;
}
export declare const RarogSwitch: React.ForwardRefExoticComponent<RarogSwitchProps & React.RefAttributes<HTMLButtonElement>>;

export interface RarogCardProps extends React.HTMLAttributes<HTMLElement> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  footer?: React.ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}
export declare const RarogCard: React.ForwardRefExoticComponent<RarogCardProps & React.RefAttributes<HTMLElement>>;

export interface RarogAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "info" | "success" | "warning" | "danger";
  title?: React.ReactNode;
}
export declare const RarogAlert: React.ForwardRefExoticComponent<RarogAlertProps & React.RefAttributes<HTMLDivElement>>;

export interface RarogBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "primary" | "secondary";
  outline?: boolean;
}
export declare const RarogBadge: React.ForwardRefExoticComponent<RarogBadgeProps & React.RefAttributes<HTMLSpanElement>>;

export interface RarogSpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
  size?: number;
}
export declare const RarogSpinner: React.ForwardRefExoticComponent<RarogSpinnerProps & React.RefAttributes<HTMLSpanElement>>;

export interface RarogSkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
}
export declare const RarogSkeleton: React.ForwardRefExoticComponent<RarogSkeletonProps & React.RefAttributes<HTMLSpanElement>>;

export interface RarogTabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
}
export interface RarogTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: RarogTabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  listClassName?: string;
  panelClassName?: string;
}
export declare const RarogTabs: React.ForwardRefExoticComponent<RarogTabsProps & React.RefAttributes<HTMLDivElement>>;

export interface RarogAccordionItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
}
export interface RarogAccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: RarogAccordionItem[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  itemClassName?: string;
}
export declare const RarogAccordion: React.ForwardRefExoticComponent<RarogAccordionProps & React.RefAttributes<HTMLDivElement>>;

export interface RarogTooltipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title">, RarogHookLifecycle {
  title: string;
  label?: React.ReactNode;
  options?: Record<string, unknown>;
  children?: React.ReactElement | React.ReactNode;
}
export declare const RarogTooltip: React.ForwardRefExoticComponent<RarogTooltipProps & React.RefAttributes<RarogComponentHandle<Tooltip>>>;

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
  options?: Record<string, unknown>;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  children?: React.ReactNode;
}
export declare const RarogDropdown: React.ForwardRefExoticComponent<RarogDropdownProps & React.RefAttributes<RarogComponentHandle<Dropdown>>>;

export declare const Rarog: unknown;
export default {
  RarogProvider: typeof RarogProvider;
  RarogButton: typeof RarogButton;
  RarogInput: typeof RarogInput;
  RarogTextarea: typeof RarogTextarea;
  RarogSelectField: typeof RarogSelectField;
  RarogCheckbox: typeof RarogCheckbox;
  RarogRadio: typeof RarogRadio;
  RarogSwitch: typeof RarogSwitch;
  RarogCard: typeof RarogCard;
  RarogAlert: typeof RarogAlert;
  RarogBadge: typeof RarogBadge;
  RarogSpinner: typeof RarogSpinner;
  RarogSkeleton: typeof RarogSkeleton;
  RarogTabs: typeof RarogTabs;
  RarogAccordion: typeof RarogAccordion;
  RarogTooltip: typeof RarogTooltip;
  RarogModal: typeof RarogModal;
  RarogOffcanvas: typeof RarogOffcanvas;
  RarogDropdown: typeof RarogDropdown;
  useRarogInit: typeof useRarogInit;
  useModal: typeof useModal;
  useOffcanvas: typeof useOffcanvas;
  useDropdown: typeof useDropdown;
  useTooltip: typeof useTooltip;
  useCollapse: typeof useCollapse;
};
