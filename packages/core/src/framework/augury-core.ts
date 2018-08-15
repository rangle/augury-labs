import { EventDispatcher } from './dispatcher'
import { ProbeService, ProbeRegistry } from './probes'
import { EnhancerService, EnhancerRegistry } from './enhancers'
import { ReactionService, ReactionRegistry } from './reactions' 
import { CommandService, CommandRegistry, Command } from './commands'
import { ChannelService } from './channels'
import { PluginService, Plugin } from './plugins'

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

  constructor(
    probeRegistry: ProbeRegistry,
    enhancerRegistry: EnhancerRegistry,
    reactionRegistry: ReactionRegistry,
    commandRegistry: CommandRegistry
  ){
    this.probes = new ProbeService(probeRegistry)
    this.enhancers = new EnhancerService(this.probes, enhancerRegistry)
    this.channels = new ChannelService()
    this.reactions = new ReactionService(this.probes, this.channels, reactionRegistry)
    this.dispatcher = new EventDispatcher(this.enhancers, this.reactions)
    this.commands = new CommandService(this.dispatcher, commandRegistry)
    this.plugins = new PluginService(this.commands)

    this.dispatcher.subscribeTo(this.probes.probeEvents)
  }

  bootstrap(
    { platform, ngModule, NgZone, plugins }: BootstrapParams
  ): Promise<any> {

    this.plugins.add(plugins)

    const ngZone = new NgZone({ enableLongStackTrace: true })

    this.probes.beforeNgBootstrapHook({
      ngZone,
      ngModule,
      Promise
    })

    return platform().bootstrapModule(ngModule, { ngZone })
      .then((moduleRef: any) => {
        
        this.probes.afterNgBootstrapHook(moduleRef)

        return moduleRef

      })
  }

}