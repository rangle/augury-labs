import { getRootComponentInstance } from '../../utils';
import { Probe } from '../probe.class';
import * as ngModuleHelpers from './shared-helpers/ng-module';

export const HookNames = [
  'ngOnChanges',
  'ngOnInit',
  'ngDoCheck',
  'ngAfterContentInit',
  'ngAfterContentChecked',
  'ngAfterViewInit',
  'ngAfterViewChecked',
  'ngOnDestroy',
];

export class ComponentHooksProbe extends Probe {
  private ngModule;

  public doInitialize(ngZone, ngModule) {
    this.ngModule = ngModule;
    const probe = this;

    function getAllRecursively(getAllFromModule: (module) => any[], module: any) {
      const allInModule = getAllFromModule(module);
      const recursiveImports = ngModuleHelpers.getImportedModulesFromModule(module);
      const allInImports = recursiveImports.reduce(
        (all, importedModule) => all.concat(getAllFromModule(importedModule)),
        [],
      );
      return new Set(allInModule.concat(allInImports));
    }

    const components = getAllRecursively(ngModuleHelpers.getComponentsFromModule, this.ngModule);

    components.forEach(component => {
      const probeHookMethod = name => {
        const original = component.prototype[name];

        component.prototype[name] = function(...args) {
          probe.emit('component_lifecycle_hook_invoked', {
            hook: name,
            componentType: component,
            componentInstance: this,
            rootComponentInstance: getRootComponentInstance(),
            args,
          });

          if (original) {
            original.apply(this, args);
          }
        };

        if (!original) {
          component.prototype[name].__added_by_augury__ = true;
        }
      };

      HookNames.forEach(probeHookMethod);
    });
  }
}
