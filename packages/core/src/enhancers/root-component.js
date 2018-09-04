'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const probes_1 = require('../probes')
// @todo: this should be in core: event types
const COMPONENT_HOOK_EVENT = 'component_lifecycle_hook_invoked'
exports.addRootComponent = (e, probes) => {
  const ngDebugProbe = probes.get(probes_1.NgDebugProbe)
  // @todo: event names registry / enum
  if (ngDebugProbe && e.name === COMPONENT_HOOK_EVENT)
    e.payload.rootComponentInstance = ngDebugProbe.getRootComponent() // @todo: using instance
  return e
}
//# sourceMappingURL=root-component.js.map
