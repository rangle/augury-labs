'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const probe_1 = require('../framework/probes/probe')
const offsets_1 = require('./shared-helpers/dom/offsets')
class NgDebugProbe extends probe_1.Probe {
  constructor() {
    super(...arguments)
    this.debugRoots = []
  }
  getComponentTree() {
    function subtreeFromDebugElement(debugElement) {
      return {
        componentInstance: debugElement.componentInstance,
        nativeNode: debugElement.nativeNode,
        componentType: debugElement.componentInstance.constructor.name,
        domOffsets: offsets_1.addUpNodeAndChildrenOffsets(debugElement.nativeNode),
        childNodes: debugElement.childNodes
          ? [...debugElement.childNodes.map(cn => subtreeFromDebugElement(cn))]
          : [],
      }
    }
    return this.debugRoots.map(subtreeFromDebugElement)
  }
  // @todo: i guess we can have multiple root components???
  //        how does that work? (currently not supported)
  getRootComponent() {
    return ng.probe(getAllAngularRootElements()[0]).componentInstance
  }
  afterNgBootstrap() {
    this.debugRoots = getAllAngularRootElements().map(ng.probe)
  }
}
exports.NgDebugProbe = NgDebugProbe
//# sourceMappingURL=ng-app-debug-probe.js.map
