import { ComponentLifecycleMethodInvokedEvent } from '../../events/component-lifecycle-method-events';
import { Probe } from '../probe.class';
import * as ngModuleHelpers from '../types/ng-module.functions';
import {
  ComponentHookMethodName,
  componentHookMethodNames,
} from './component-hook-method-names.type';

declare const ng;
declare const getAllAngularRootElements;

export class ComponentHooksProbe extends Probe {
  private ngModule;
  private rootComponentInstance = null;

  public doInitialize(ngZone, ngModule) {
    this.ngModule = ngModule;
    const probe = this;

    // todo: get rid of functions
    function getAllComponentTypes(getAllFromModule: (module) => any[], module: any) {
      const allInModule = getAllFromModule(module);
      const recursiveImports = ngModuleHelpers.getImportedModulesFromModule(module);
      const allInImports = recursiveImports.reduce(
        (all, importedModule) => all.concat(getAllFromModule(importedModule)),
        [],
      );

      return new Set(allInModule.concat(allInImports));
    }

    const componentTypes = getAllComponentTypes(
      ngModuleHelpers.getComponentsFromModule,
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
                probe.getRootComponentInstance(),
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

  private getRootComponentInstance(): any {
    if (this.rootComponentInstance === null) {
      this.rootComponentInstance = ng.probe(getAllAngularRootElements()[0]).instance;
    }

    return this.rootComponentInstance;
  }
}
