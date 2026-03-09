

export type RarogRemainingComponentEventName =
  | "rg:stepper:change"
  | "rg:stepper:changed"
  | "rg:datepicker:show"
  | "rg:datepicker:shown"
  | "rg:datepicker:hide"
  | "rg:datepicker:hidden"
  | "rg:datepicker:change"
  | "rg:datepicker:changed"
  | "rg:select:show"
  | "rg:select:shown"
  | "rg:select:hide"
  | "rg:select:hidden"
  | "rg:select:change"
  | "rg:select:changed"
  | "rg:combobox:show"
  | "rg:combobox:shown"
  | "rg:combobox:hide"
  | "rg:combobox:hidden"
  | "rg:combobox:change"
  | "rg:combobox:changed"
  | "rg:tagsinput:add"
  | "rg:tagsinput:added"
  | "rg:tagsinput:remove"
  | "rg:tagsinput:removed"
  | "rg:tagsinput:cleared"
  | "rg:datatable:pagechange"
  | "rg:datatable:pagechanged"
  | "rg:datatable:sortchange"
  | "rg:datatable:sortchanged";

export interface RarogRemainingComponentEventDetail<TInstance = unknown> {
  instance: TInstance;
  trigger: Element | null;
  target: Element | null;
  index?: number;
  key?: string;
  value?: string | Date | null;
}
