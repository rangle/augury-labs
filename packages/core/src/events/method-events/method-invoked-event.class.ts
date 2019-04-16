import { Probe } from '../../probes';
import { AngularClassType } from '../../probes/module-methods-probe/angular-class-type.enum';
import { MethodEventSupport } from './method-event-support.class';

export class MethodInvokedEvent extends MethodEventSupport {
  constructor(
    probe: Probe,
    classType: AngularClassType,
    clazz: any,
    instance: any,
    methodName: string,
    public readonly parameters: any[],
  ) {
    super(probe, classType, clazz, instance, methodName);
  }
}
