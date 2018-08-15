import { AuguryEvent } from '../events'
import { ProbeService } from '../probes'
import { EnhancerRegistry } from './enhancer-registry'

export class EnhancerService {

  constructor(
    private probes: ProbeService,
    private enhancerRegistry: EnhancerRegistry
  ) { }

  enhanceEvent(event: AuguryEvent): AuguryEvent {
    return this.enhancerRegistry.reduce(
      (enhanced, enhance) => enhance(enhanced, this.probes),
      event,
    )
  }

}