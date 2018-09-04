'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const framework_1 = require('../framework')
const probes_1 = require('../probes')
const enhancers_1 = require('../enhancers')
const reactions_1 = require('../reactions')
const commands_1 = require('../commands')
function auguryBootstrap(bootstrapParams) {
  const auguryCore = new framework_1.AuguryCore(
    probes_1.probeRegistry,
    enhancers_1.enhancerRegistry,
    reactions_1.reactionRegistry,
    commands_1.commandRegistry,
  )
  window.augury = auguryCore
  return auguryCore.bootstrap(bootstrapParams)
}
exports.auguryBootstrap = auguryBootstrap
//# sourceMappingURL=augury-bootstrap.js.map
