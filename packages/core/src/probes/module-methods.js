'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const probe_1 = require('../framework/probes/probe')
const helpers = require('./shared-helpers/ng-module')
class ModuleMethodsProbe extends probe_1.Probe {
  beforeNgBootstrap({ ngModule }) {
    this.ngModule = ngModule
    function getAllRecursively(getAllFromModule, module) {
      const allInModule = getAllFromModule(module)
      const recursiveImports = helpers.getImportedModulesFromModule(module)
      const allInImports = recursiveImports.reduce(
        (all, importedModule) => all.concat(getAllFromModule(importedModule)),
        [],
      )
      return allInModule.concat(allInImports)
    }
    const components = getAllRecursively(helpers.getComponentsFromModule, this.ngModule)
    const services = getAllRecursively(helpers.getServicesFromModule, this.ngModule)
    const probe = this
    function wrapMethod(Class, methodName, classType) {
      const original = Class.prototype[methodName]
      Class.prototype[methodName] = function(...args) {
        probe.emit('method_invoked', {
          perfstamp: performance.now(),
          methodName,
          classType,
          Class,
          instance: this,
          args,
          module: Class.__m,
        })
        const retVal = original.apply(this, args)
        probe.emit('method_completed', {
          perfstamp: performance.now(),
          hook: methodName,
          classType,
          Class,
          instance: this,
          args,
          retVal,
          module: Class.__m,
        })
        return retVal
      }
      Class.prototype[methodName].__augury_wrapped__ = true
    }
    function shouldWrapMethod(Class, propertyName) {
      if (propertyName === 'constructor') return false
      // TODO: some prototype members use getters/setters
      const propDesc = Object.getOwnPropertyDescriptor(Class.prototype, propertyName)
      if (propDesc && propDesc.get) return false
      const property = Class.prototype[propertyName]
      if (typeof property !== 'function') return false
      if (property.__added_by_augury__) return false
      if (property.__augury_wrapped__) return false
      if (typeof property !== 'function') return false
      return true
    }
    function wrapClassMethods(Class, classType) {
      Object.getOwnPropertyNames(Class.prototype).forEach(propertyName => {
        if (shouldWrapMethod(Class, propertyName)) wrapMethod(Class, propertyName, classType)
      })
    }
    services.forEach(Service => wrapClassMethods(Service, 'service'))
    components.forEach(Component => wrapClassMethods(Component, 'component'))
  }
}
exports.ModuleMethodsProbe = ModuleMethodsProbe
//# sourceMappingURL=module-methods.js.map
