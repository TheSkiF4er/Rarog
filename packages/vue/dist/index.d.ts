import type { App, ComponentPublicInstance, Directive, Plugin, Ref } from "vue";
import type { Dropdown, Modal, Offcanvas } from "@rarog/js";

export type RarogHookResult<T> = { el: Ref<HTMLElement | null>; instance: Ref<T | null> };
export declare function useRarogInit<T>(ComponentClass: { getOrCreate(element: HTMLElement, options?: Record<string, unknown>): T }, options?: Record<string, unknown>): RarogHookResult<T>;
export declare function useModal(options?: Record<string, unknown>): RarogHookResult<Modal>;
export declare function useOffcanvas(options?: Record<string, unknown>): RarogHookResult<Offcanvas>;
export declare function useDropdown(options?: Record<string, unknown>): RarogHookResult<Dropdown>;

export declare const RarogProvider: ComponentPublicInstance;
export declare const RarogModal: ComponentPublicInstance;
export declare const RarogOffcanvas: ComponentPublicInstance;
export declare const RarogDropdown: ComponentPublicInstance;
export declare const RarogPlugin: Plugin;
export default RarogPlugin;
