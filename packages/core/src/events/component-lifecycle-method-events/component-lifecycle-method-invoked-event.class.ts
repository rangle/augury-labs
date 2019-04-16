import { Probe } from '../../probes';
import { ComponentHookMethodName } from '../../probes/component-hooks-probe/component-hook-method-names.type';
import { AuguryEvent } from '../augury-event.class';

export class ComponentLifecycleMethodInvokedEvent extends AuguryEvent {
  constructor(
    probe: Probe,
    public hookMethod: ComponentHookMethodName,
    public componentType: any,
    public componentInstance: any,
    public rootComponentInstance: any,
    public parameters: any[],
  ) {
    super(probe);
  }
}
