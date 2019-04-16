import { Probe } from '../../probes';
import { AngularClassType } from '../../probes/module-methods-probe/angular-class-type.enum';
import { AuguryEvent } from '../augury-event.class';

export abstract class MethodEventSupport extends AuguryEvent {
  public readonly timestamp: number;

  protected constructor(
    probe: Probe,
    public classType: AngularClassType,
    public clazz: any,
    public instance: any,
    public methodName: string,
  ) {
    super(probe);

    this.timestamp = performance.now();
  }
}
