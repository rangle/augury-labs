import { AngularClassType } from '../../probes/module-methods-probe';
import { MethodEventSupport } from './method-event-support.class';

export class MethodCompletedEvent extends MethodEventSupport {
  constructor(
    classType: AngularClassType,
    clazz: any,
    instance: any,
    methodName: string,
    public readonly returnValue: string,
  ) {
    super(classType, clazz, instance, methodName);
  }
}
