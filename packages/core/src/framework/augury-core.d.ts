import { ProbeRegistry } from './probes'
import { EnhancerRegistry } from './enhancers'
import { ReactionRegistry } from './reactions'
import { CommandRegistry } from './commands'
import { Plugin } from './plugins'
export interface BootstrapParams {
  platform: any
  ngModule: any
  NgZone: any
  plugins: Plugin[]
}
export declare class AuguryCore {
  private dispatcher
  private probes
  private enhancers
  private channels
  private reactions
  private commands
  private plugins
  constructor(
    probeRegistry: ProbeRegistry,
    enhancerRegistry: EnhancerRegistry,
    reactionRegistry: ReactionRegistry,
    commandRegistry: CommandRegistry,
  )
  bootstrap({ platform, ngModule, NgZone, plugins }: BootstrapParams): Promise<any>
}
