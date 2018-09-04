'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const events_1 = require('../events')
const utils_1 = require('../utils')
class ProbeService {
  constructor(registry) {
    this.registry = registry
    this.probeEvents = new utils_1.SyncEventEmitter()
    this.probes = this.instantiateProbes(this.registry)
  }
  // @todo: typing.. Argument of type 'typeof NgDebugProbe' is not assignable to parameter of type 'typeof Probe'.
  //        had to make it type "any"
  // @todo: Return the probe instance type that is passed in as a class
  get(ProbeClass) {
    return this.probes.find(probe => probe.constructor === ProbeClass)
  }
  beforeNgBootstrapHook(preBootstrapTargets) {
    this.probes.forEach(
      probe => probe.beforeNgBootstrap && probe.beforeNgBootstrap(preBootstrapTargets),
    )
  }
  afterNgBootstrapHook(ngModuleRef) {
    this.probes.forEach(probe => probe.afterNgBootstrap && probe.afterNgBootstrap(ngModuleRef))
  }
  // @todo: typing
  instantiateProbes(ProbeConstructors) {
    return ProbeConstructors.map(
      ProbeConstructor =>
        new ProbeConstructor((eventName, eventPayload) =>
          this.probeEvents.emit(
            events_1.createEvent(
              { type: 'probe', name: ProbeConstructor.name },
              eventName,
              eventPayload,
            ),
          ),
        ),
    )
  }
}
exports.ProbeService = ProbeService
//# sourceMappingURL=probe-service.js.map
