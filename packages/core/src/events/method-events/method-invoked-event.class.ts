import { AngularClassType } from '../../probes/module-methods-probe';
import { MethodEventSupport } from './method-event-support.class';

export class MethodInvokedEvent extends MethodEventSupport {
  constructor(
    classType: AngularClassType,
    clazz: any,
    instance: any,
    methodName: string,
    public readonly parameters: any[],
  ) {
    super(classType, clazz, instance, methodName);
  }
}
