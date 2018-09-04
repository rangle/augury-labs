'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const dispatcher_1 = require('./dispatcher')
const probes_1 = require('./probes')
const enhancers_1 = require('./enhancers')
const reactions_1 = require('./reactions')
const commands_1 = require('./commands')
const channels_1 = require('./channels')
const plugins_1 = require('./plugins')
class AuguryCore {
  constructor(probeRegistry, enhancerRegistry, reactionRegistry, commandRegistry) {
    this.probes = new probes_1.ProbeService(probeRegistry)
    this.enhancers = new enhancers_1.EnhancerService(this.probes, enhancerRegistry)
    this.channels = new channels_1.ChannelService()
    this.reactions = new reactions_1.ReactionService(this.probes, this.channels, reactionRegistry)
    this.dispatcher = new dispatcher_1.EventDispatcher(this.enhancers, this.reactions)
    this.commands = new commands_1.CommandService(this.dispatcher, commandRegistry)
    this.plugins = new plugins_1.PluginService(this.commands)
    this.dispatcher.subscribeTo(this.probes.probeEvents)
  }
  bootstrap({ platform, ngModule, NgZone, plugins }) {
    this.plugins.add(plugins)
    const ngZone = new NgZone({ enableLongStackTrace: true })
    this.probes.beforeNgBootstrapHook({
      ngZone,
      ngModule,
      Promise,
    })
    return platform()
      .bootstrapModule(ngModule, { ngZone })
      .then(moduleRef => {
        this.probes.afterNgBootstrapHook(moduleRef)
        return moduleRef
      })
  }
}
exports.AuguryCore = AuguryCore
//# sourceMappingURL=augury-core.js.map
