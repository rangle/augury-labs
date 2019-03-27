import { AuguryEvent } from '../events';
import { ProbeManager } from '../probes';
import { EnhancerRegistry } from './enhancer-registry.type';

export class EnhancerService {
  constructor(private probeManager: ProbeManager, private enhancers: EnhancerRegistry) {}

  public enhanceEvent(event: AuguryEvent): AuguryEvent {
    return this.enhancers.reduce(
      (enhancedEvent, enhance) => enhance(enhancedEvent, this.probeManager),
      event,
    );
  }
}
