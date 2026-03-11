import type { DefineComponent, Plugin, Ref } from "vue";
import type { Collapse, Dropdown, Modal, Offcanvas, Tooltip } from "@rarog/js";

export type RarogLifecycleEvent = Event | CustomEvent<Record<string, unknown>>;
export type RarogHookResult<T> = { el: Ref<HTMLElement | null>; instance: Ref<T | null> };

export declare function useRarogInit<T>(ComponentClass: { getOrCreate(element: HTMLElement, options?: Record<string, unknown>): T }, options?: Record<string, unknown>): RarogHookResult<T>;
export declare function useModal(options?: Record<string, unknown>): RarogHookResult<Modal>;
export declare function useOffcanvas(options?: Record<string, unknown>): RarogHookResult<Offcanvas>;
export declare function useDropdown(options?: Record<string, unknown>): RarogHookResult<Dropdown>;
export declare function useTooltip(options?: Record<string, unknown>): RarogHookResult<Tooltip>;
export declare function useCollapse(options?: Record<string, unknown>): RarogHookResult<Collapse>;

export declare const RarogProvider: DefineComponent<{ as?: string; autoInit?: boolean; reinitOnChildrenChange?: boolean; }>;
export declare const RarogButton: DefineComponent<{ as?: string; variant?: "primary" | "secondary" | "outline"; size?: "sm" | "md" | "lg"; }>;
export declare const RarogInput: DefineComponent<{ invalid?: boolean; }>;
export declare const RarogTextarea: DefineComponent<{ invalid?: boolean; }>;
export declare const RarogSelectField: DefineComponent<{ invalid?: boolean; }>;
export declare const RarogCheckbox: DefineComponent<{ label?: string; description?: string; inputClassName?: string; }>;
export declare const RarogRadio: DefineComponent<{ label?: string; description?: string; inputClassName?: string; }>;
export declare const RarogSwitch: DefineComponent<{ modelValue?: boolean; defaultChecked?: boolean; label?: string; disabled?: boolean; }, {}, {}, {}, {}, {}, {}, { "update:modelValue": (value: boolean) => true; change: (value: boolean) => true; }>;
export declare const RarogCard: DefineComponent<{ title?: string; subtitle?: string; footer?: string; headerClassName?: string; bodyClassName?: string; footerClassName?: string; }>;
export declare const RarogAlert: DefineComponent<{ tone?: "info" | "success" | "warning" | "danger"; title?: string; }>;
export declare const RarogBadge: DefineComponent<{ tone?: "primary" | "secondary"; outline?: boolean; }>;
export declare const RarogSpinner: DefineComponent<{ label?: string; size?: number; }>;
export declare const RarogSkeleton: DefineComponent<{ width?: string | number; height?: string | number; radius?: string | number; }>;
export declare const RarogTabs: DefineComponent<{ items?: Array<{ value: string; label: unknown; content: unknown }>; modelValue?: string; defaultValue?: string; listClassName?: string; panelClassName?: string; }, {}, {}, {}, {}, {}, {}, { "update:modelValue": (value: string) => true; change: (value: string) => true; }>;
export declare const RarogAccordion: DefineComponent<{ items?: Array<{ value: string; label: unknown; content: unknown }>; modelValue?: string; defaultValue?: string; itemClassName?: string; }, {}, {}, {}, {}, {}, {}, { "update:modelValue": (value: string) => true; change: (value: string) => true; }>;
export declare const RarogTooltip: DefineComponent<{ title: string; label?: string; className?: string; options?: Record<string, unknown>; open?: boolean; defaultOpen?: boolean; }, {}, {}, {}, {}, {}, {}, { show: (event: RarogLifecycleEvent) => true; shown: (event: RarogLifecycleEvent) => true; hide: (event: RarogLifecycleEvent) => true; hidden: (event: RarogLifecycleEvent) => true; open: (event: RarogLifecycleEvent) => true; close: (event: RarogLifecycleEvent) => true; }>;
export declare const RarogModal: DefineComponent<{ id?: string; title?: string; closeLabel?: string; className?: string; dialogClassName?: string; headerClassName?: string; bodyClassName?: string; footerClassName?: string; options?: Record<string, unknown>; open?: boolean; defaultOpen?: boolean; }, {}, {}, {}, {}, {}, {}, { show: (event: RarogLifecycleEvent) => true; shown: (event: RarogLifecycleEvent) => true; hide: (event: RarogLifecycleEvent) => true; hidden: (event: RarogLifecycleEvent) => true; open: (event: RarogLifecycleEvent) => true; close: (event: RarogLifecycleEvent) => true; "update:open": (value: boolean) => true; }>;
export declare const RarogOffcanvas: DefineComponent<{ id?: string; title?: string; placement?: "start" | "end" | "bottom"; closeLabel?: string; className?: string; headerClassName?: string; bodyClassName?: string; options?: Record<string, unknown>; open?: boolean; defaultOpen?: boolean; }, {}, {}, {}, {}, {}, {}, { show: (event: RarogLifecycleEvent) => true; shown: (event: RarogLifecycleEvent) => true; hide: (event: RarogLifecycleEvent) => true; hidden: (event: RarogLifecycleEvent) => true; open: (event: RarogLifecycleEvent) => true; close: (event: RarogLifecycleEvent) => true; "update:open": (value: boolean) => true; }>;
export declare const RarogDropdown: DefineComponent<{ label?: string; menuId?: string; className?: string; buttonClassName?: string; menuClassName?: string; align?: "start" | "end"; options?: Record<string, unknown>; open?: boolean; defaultOpen?: boolean; }, {}, {}, {}, {}, {}, {}, { show: (event: RarogLifecycleEvent) => true; shown: (event: RarogLifecycleEvent) => true; hide: (event: RarogLifecycleEvent) => true; hidden: (event: RarogLifecycleEvent) => true; open: (event: RarogLifecycleEvent) => true; close: (event: RarogLifecycleEvent) => true; "update:open": (value: boolean) => true; }>;

export declare const RarogPlugin: Plugin;
export declare const Rarog: unknown;
export default RarogPlugin;
