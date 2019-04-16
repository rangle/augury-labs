declare const Reflect;

// TODO: only grabbing first __annotation__, assuming that's the (only) ngmodule one
// note: module.__annotations__ seems to generally apply to user-defined modules
export const getAnnotationsFromModule = module => {
  if (Reflect && Reflect.getMetadata && Reflect.getMetadata('annotations', module)) {
    return Reflect.getMetadata('annotations', module)[0];
  } else if (module.__annotations__) {
    return module.__annotations__[0];
  } else if (module.decorators && module.decorators[0].args) {
    return module.decorators[0].args[0];
  } else {
    return {};
  }
};

// TODO: ignoring all modules not defined with an annotated class
// TODO: should consider circular module imports by leaving a flag on wrapped methods and not rewrapping
export const getImportedModulesFromModule = module => {
  return (getAnnotationsFromModule(module).imports || [])
    .reduce(
      (flattened, importedModule) =>
        flattened.concat(importedModule).concat(getImportedModulesFromModule(importedModule)),
      [],
    )
    .filter(p => typeof p === 'function');
};

// TODO: ignoring all components not declared with an annotated class
export const getComponentsFromModule = module => {
  return (getAnnotationsFromModule(module).declarations || [])
    .filter(p => typeof p === 'function') // only classes
    .map(Component => Object.assign(Component, { __m: module }));
};

// TODO: this only gets the providers declared at the module level.
// TODO: only grabbing class-defined providers
export const getServicesFromModule = module => {
  return (getAnnotationsFromModule(module).providers || [])
    .filter(p => typeof p === 'function') // only classes
    .map(Service => Object.assign(Service, { __m: module }));
};

export function getAllObjectsInAngularApplication(
  getAllFromModule: (module) => any[],
  module: any,
) {
  const allInModule = getAllFromModule(module);
  const recursiveImports = getImportedModulesFromModule(module);
  const allInImports = recursiveImports.reduce(
    (all, importedModule) => all.concat(getAllFromModule(importedModule)),
    [],
  );

  return allInModule.concat(allInImports);
}
