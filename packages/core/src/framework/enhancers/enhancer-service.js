'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
class EnhancerService {
  constructor(probes, enhancerRegistry) {
    this.probes = probes
    this.enhancerRegistry = enhancerRegistry
  }
  enhanceEvent(event) {
    return this.enhancerRegistry.reduce(
      (enhanced, enhance) => enhance(enhanced, this.probes),
      event,
    )
  }
}
exports.EnhancerService = EnhancerService
//# sourceMappingURL=enhancer-service.js.map
