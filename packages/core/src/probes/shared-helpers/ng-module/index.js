'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
// TODO: only grabbing first __annotation__, assuming that's the (only) ngmodule one
// note: module.__annotations__ seems to generally apply to user-defined modules
exports.getAnnotationsFromModule = module => {
  if (Reflect && Reflect.getMetadata && Reflect.getMetadata('annotations', module))
    return Reflect.getMetadata('annotations', module)[0]
  if (module.__annotations__) return module.__annotations__[0]
  if (module.decorators) return module.decorators[0].args[0]
  else return {}
}
// TODO: ignoring all modules not defined with an annotated class
// TODO: should consider circular module imports by leaving a flag on wrapped methods and not rewrapping
exports.getImportedModulesFromModule = module => {
  return (exports.getAnnotationsFromModule(module).imports || [])
    .reduce(
      (flattened, importedModule) =>
        flattened
          .concat(importedModule)
          .concat(exports.getImportedModulesFromModule(importedModule)),
      [],
    )
    .filter(p => typeof p === 'function')
}
// TODO: ignoring all components not declared with an annotated class
exports.getComponentsFromModule = module => {
  return (exports.getAnnotationsFromModule(module).declarations || [])
    .filter(p => typeof p === 'function') // only classes
    .map(Component => Object.assign(Component, { __m: module }))
}
// TODO: this only gets the providers declared at the module level.
// TODO: only grabbing class-defined providers
exports.getServicesFromModule = module => {
  return (exports.getAnnotationsFromModule(module).providers || [])
    .filter(p => typeof p === 'function') // only classes
    .map(Service => Object.assign(Service, { __m: module }))
}
//# sourceMappingURL=index.js.map
