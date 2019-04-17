import { ComponentHookMethodName } from '../../probes/component-hooks-probe';
import { AuguryEvent } from '../augury-event.class';

export class ComponentLifecycleMethodInvokedEvent extends AuguryEvent {
  constructor(
    public hookMethod: ComponentHookMethodName,
    public componentType: any,
    public componentInstance: any,
    public parameters: any[],
  ) {
    super();
  }
}
