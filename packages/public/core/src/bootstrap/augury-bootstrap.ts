import { commandRegistry } from '../commands'
import { enhancerRegistry } from '../enhancers'
import { AuguryCore, BootstrapParams } from '../framework'
import { probeRegistry } from '../probes'
import { reactionRegistry } from '../reactions'

export function auguryBootstrap(bootstrapParams: BootstrapParams) {
  const auguryCore = new AuguryCore(
    probeRegistry,
    enhancerRegistry,
    reactionRegistry,
    commandRegistry,
  )
  ;(window as any).augury = auguryCore

  return auguryCore.bootstrap(bootstrapParams)
}
