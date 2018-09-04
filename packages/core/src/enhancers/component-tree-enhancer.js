'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const probes_1 = require('../probes')
exports.addComponentTree = (e, probes) => {
  const ngDebugProbe = probes.get(probes_1.NgDebugProbe)
  // @todo: event names registry / enum
  if (ngDebugProbe && e.name === 'onStable')
    e.payload.componentTree = ngDebugProbe.getComponentTree()
  return e
}
//# sourceMappingURL=component-tree-enhancer.js.map
