import { MethodCompletedEvent, MethodInvokedEvent } from '../../events/method-events';
import { Probe } from '../probe.class';
import {
  getAllObjectsInAngularApplication,
  getComponentsFromModule,
  getServicesFromModule,
} from '../types';
import { AngularClassType } from './angular-class-type.enum';

export class ModuleMethodsProbe extends Probe {
  // actions

  // queries

  // state
  // @question: where are we going to keep the event queue?
  //            feels like it's another probe that should handle dom events
  //            and that the logic should not be part of any probe
  // private detainJobs: boolean = false

  // target
  private ngModule;

  public doInitialize(ngZone, ngModule) {
    this.ngModule = ngModule;

    const components = getAllObjectsInAngularApplication(getComponentsFromModule, this.ngModule);
    const services = getAllObjectsInAngularApplication(getServicesFromModule, this.ngModule);

    const probe = this;

    function wrapMethod(
      Class: any,
      methodName: string,
      classType: AngularClassType, // todo: there are other options
    ) {
      const originalMethod = Class.prototype[methodName];

      Class.prototype[methodName] = function(...parameters) {
        probe.emit(
          () => new MethodInvokedEvent(probe, classType, Class, this, methodName, parameters),
        );

        const returnValue = originalMethod.apply(this, parameters);

        probe.emit(
          () => new MethodCompletedEvent(probe, classType, Class, this, methodName, returnValue),
        );

        return returnValue;
      };

      Class.prototype[methodName].__augury_wrapped__ = true;
    }

    function shouldWrapMethod(Class: any, propertyName: string): boolean {
      if (propertyName === 'constructor') {
        return false;
      }

      // TODO: some prototype members use getters/setters
      const propDesc = Object.getOwnPropertyDescriptor(Class.prototype, propertyName);
      if (propDesc && propDesc.get) {
        return false;
      }

      const property = Class.prototype[propertyName];

      return (
        typeof property === 'function' &&
        !property.__added_by_augury__ &&
        !property.__augury_wrapped__
      );
    }

    function wrapClassMethods(Class: () => any, classType: AngularClassType) {
      Object.getOwnPropertyNames(Class.prototype).forEach(propertyName => {
        if (shouldWrapMethod(Class, propertyName)) {
          wrapMethod(Class, propertyName, classType);
        }
      });
    }

    services.forEach(Service => wrapClassMethods(Service, AngularClassType.Service));
    components.forEach(Component => wrapClassMethods(Component, AngularClassType.Component));
  }
}
