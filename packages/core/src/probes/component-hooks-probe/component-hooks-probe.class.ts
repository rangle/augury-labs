import { ComponentLifecycleMethodInvokedEvent } from '../../events/component-lifecycle-method-events';
import { Probe } from '../probe.class';
import { getAllObjectsInAngularApplication, getComponentsFromModule } from '../types';
import {
  ComponentHookMethodName,
  componentHookMethodNames,
} from './component-hook-method-names.type';

export class ComponentHooksProbe extends Probe {
  private ngModule;

  public doInitialize(ngZone, ngModule) {
    this.ngModule = ngModule;
    const probe = this;

    const componentTypes = getAllObjectsInAngularApplication(
      getComponentsFromModule,
      this.ngModule,
    );

    componentTypes.forEach(componentType => {
      const probeHookMethod = (hookMethod: ComponentHookMethodName) => {
        const original = componentType.prototype[hookMethod];

        componentType.prototype[hookMethod] = function(...parameters) {
          const componentInstance = this;

          probe.emit(
            () =>
              new ComponentLifecycleMethodInvokedEvent(
                probe,
                hookMethod,
                componentType,
                componentInstance,
                parameters,
              ),
          );

          if (original) {
            original.apply(this, parameters);
          }
        };

        if (!original) {
          componentType.prototype[hookMethod].__added_by_augury__ = true;
        }
      };

      componentHookMethodNames.forEach(probeHookMethod);
    });
  }
}
