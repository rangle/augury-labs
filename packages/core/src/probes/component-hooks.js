'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const probe_1 = require('../framework/probes/probe')
const ngModuleHelpers = require('./shared-helpers/ng-module')
exports.HookNames = [
  'ngOnChanges',
  'ngOnInit',
  'ngDoCheck',
  'ngAfterContentInit',
  'ngAfterContentChecked',
  'ngAfterViewInit',
  'ngAfterViewChecked',
  'ngOnDestroy',
]
class ComponentHooksProbe extends probe_1.Probe {
  beforeNgBootstrap({ ngModule }) {
    this.ngModule = ngModule
    const probe = this
    function getAllRecursively(getAllFromModule, module) {
      const allInModule = getAllFromModule(module)
      const recursiveImports = ngModuleHelpers.getImportedModulesFromModule(module)
      const allInImports = recursiveImports.reduce(
        (all, importedModule) => all.concat(getAllFromModule(importedModule)),
        [],
      )
      return new Set(allInModule.concat(allInImports))
    }
    const components = getAllRecursively(ngModuleHelpers.getComponentsFromModule, this.ngModule)
    components.forEach(component => {
      const probeHookMethod = name => {
        const original = component.prototype[name]
        component.prototype[name] = function(...args) {
          probe.emit('component_lifecycle_hook_invoked', {
            hook: name,
            componentType: component,
            componentInstance: this,
            args,
          })
          if (original) original.apply(this, args)
        }
        if (!original) component.prototype[name].__added_by_augury__ = true
      }
      exports.HookNames.forEach(probeHookMethod)
    })
  }
}
exports.ComponentHooksProbe = ComponentHooksProbe
//# sourceMappingURL=component-hooks.js.map
