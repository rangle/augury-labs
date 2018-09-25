import { ChannelService } from './channels'
import { CommandRegistry, CommandService } from './commands'
import { EventDispatcher } from './dispatcher'
import { EnhancerRegistry, EnhancerService } from './enhancers'
import { HistoryService } from './history'
import { Plugin, PluginService } from './plugins'
import { ProbeRegistry, ProbeService } from './probes'
import { ReactionRegistry, ReactionService } from './reactions'

export interface BootstrapParams {
  platform: any
  ngModule: any
  NgZone: any
  plugins: Plugin[]
}

export class AuguryCore {
  private dispatcher: EventDispatcher

  private probes: ProbeService
  private enhancers: EnhancerService
  private channels: ChannelService
  private reactions: ReactionService
  private commands: CommandService
  private plugins: PluginService
  private history: HistoryService

  constructor(
    probeRegistry: ProbeRegistry,
    enhancerRegistry: EnhancerRegistry,
    reactionRegistry: ReactionRegistry,
    commandRegistry: CommandRegistry,
  ) {
    this.probes = new ProbeService(probeRegistry)
    this.enhancers = new EnhancerService(this.probes, enhancerRegistry)
    this.channels = new ChannelService()
    this.history = new HistoryService()
    this.reactions = new ReactionService(this.probes, this.channels, reactionRegistry, this.history)
    this.dispatcher = new EventDispatcher(this.enhancers, this.reactions, this.history)
    this.commands = new CommandService(this.dispatcher, commandRegistry)
    this.plugins = new PluginService(this.commands)

    this.dispatcher.subscribeTo(this.probes.probeEvents)
  }

  public bootstrap({ platform, ngModule, NgZone, plugins }: BootstrapParams): Promise<any> {
    this.plugins.add(plugins)

    const ngZone = new NgZone({ enableLongStackTrace: true })

    this.probes.beforeNgBootstrapHook({
      ngZone,
      ngModule,
      Promise,
    })

    return platform()
      .bootstrapModule(ngModule, { ngZone })
      .then((moduleRef: any) => {
        this.probes.afterNgBootstrapHook(moduleRef)

        return moduleRef
      })
  }
}
