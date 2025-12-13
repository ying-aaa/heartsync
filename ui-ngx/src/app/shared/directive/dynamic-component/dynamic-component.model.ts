import { Type } from '@angular/core';

export type ComponentEvent = {
  name: string;
  handler: (args?: any) => void;
};

export interface componentConfig {
  component: Type<any>;
  props: Record<string, any>;
  events: ComponentEvent[];
  styles: Record<string, string>;
  showCondition?: boolean | (() => boolean);
}
