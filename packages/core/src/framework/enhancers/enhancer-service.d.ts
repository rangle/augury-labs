import { AuguryEvent } from '../events'
import { ProbeService } from '../probes'
import { EnhancerRegistry } from './enhancer-registry'
export declare class EnhancerService {
  private probes
  private enhancerRegistry
  constructor(probes: ProbeService, enhancerRegistry: EnhancerRegistry)
  enhanceEvent(event: AuguryEvent): AuguryEvent
}
