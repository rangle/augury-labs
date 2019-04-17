import { AngularClassType } from '../../probes/module-methods-probe';
import { AuguryEvent } from '../augury-event.class';

export abstract class MethodEventSupport extends AuguryEvent {
  public readonly timestamp: number;

  protected constructor(
    public classType: AngularClassType,
    public clazz: any,
    public instance: any,
    public methodName: string,
  ) {
    super();

    this.timestamp = performance.now();
  }
}
