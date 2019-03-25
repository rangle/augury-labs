import { AuguryEvent } from '../events';
import { ProbeService } from '../probes';
import { EnhancerRegistry } from './enhancer-registry.type';

export class EnhancerService {
  constructor(private probeService: ProbeService, private enhancers: EnhancerRegistry) {}

  public enhanceEvent(event: AuguryEvent): AuguryEvent {
    return this.enhancers.reduce(
      (enhancedEvent, enhance) => enhance(enhancedEvent, this.probeService),
      event,
    );
  }
}
