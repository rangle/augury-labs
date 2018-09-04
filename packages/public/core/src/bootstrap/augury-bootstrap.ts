import { AuguryCore, BootstrapParams } from '../framework'
import { probeRegistry } from '../probes'
import { enhancerRegistry } from '../enhancers'
import { reactionRegistry } from '../reactions'
import { commandRegistry } from '../commands'

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
