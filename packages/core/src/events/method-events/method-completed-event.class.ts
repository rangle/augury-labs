import { Probe } from '../../probes';
import { AngularClassType } from '../../probes/module-methods-probe/angular-class-type.enum';
import { MethodEventSupport } from './method-event-support.class';

export class MethodCompletedEvent extends MethodEventSupport {
  constructor(
    probe: Probe,
    classType: AngularClassType,
    clazz: any,
    instance: any,
    methodName: string,
    public readonly returnValue: string,
  ) {
    super(probe, classType, clazz, instance, methodName);
  }
}
