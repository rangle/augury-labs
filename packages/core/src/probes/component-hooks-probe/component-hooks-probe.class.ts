import { Probe } from '../probe.class';
import * as ngModuleHelpers from '../types/ng-module.functions';

declare const ng;
declare const getAllAngularRootElements;

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
  private rootComponentInstance = null;

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
          probe.emit('component_lifecycle_hook_invoked', () => ({
            hook: name,
            componentType: component,
            componentInstance: this,
            rootComponentInstance: probe.getRootComponentInstance(),
            args,
          }));

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

  private getRootComponentInstance(): any {
    if (this.rootComponentInstance === null) {
      this.rootComponentInstance = ng.probe(getAllAngularRootElements()[0]).instance;
    }

    return this.rootComponentInstance;
  }
}
