export type RarogComponentLifecycleEventName =
  | "rg:dropdown:show"
  | "rg:dropdown:shown"
  | "rg:dropdown:hide"
  | "rg:dropdown:hidden"
  | "rg:collapse:show"
  | "rg:collapse:shown"
  | "rg:collapse:hide"
  | "rg:collapse:hidden"
  | "rg:modal:show"
  | "rg:modal:shown"
  | "rg:modal:hide"
  | "rg:modal:hidden"
  | "rg:offcanvas:show"
  | "rg:offcanvas:shown"
  | "rg:offcanvas:hide"
  | "rg:offcanvas:hidden"
  | "rg:toast:show"
  | "rg:toast:shown"
  | "rg:toast:hide"
  | "rg:toast:hidden"
  | "rg:tooltip:show"
  | "rg:tooltip:shown"
  | "rg:tooltip:hide"
  | "rg:tooltip:hidden"
  | "rg:popover:show"
  | "rg:popover:shown"
  | "rg:popover:hide"
  | "rg:popover:hidden"
  | "rg:carousel:slide"
  | "rg:carousel:slid"
  | "rg:carousel:next"
  | "rg:carousel:prev"
  | "rg:carousel:goto";

export interface RarogLifecycleEventDetail<TInstance = unknown> {
  instance: TInstance;
  trigger: Element | null;
  target: Element | null;
  placement?: string;
  index?: number;
  fromIndex?: number;
  toIndex?: number;
  direction?: "next" | "prev" | "goto";
}
