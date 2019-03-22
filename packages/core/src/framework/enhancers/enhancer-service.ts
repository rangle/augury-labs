import { AuguryEvent } from '../events';
import { ProbeService } from '../probes';
import { EnhancerRegistry } from './enhancer-registry';

export class EnhancerService {
  constructor(private probeService: ProbeService, private enhancerRegistry: EnhancerRegistry) {}

  public enhanceEvent(event: AuguryEvent): AuguryEvent {
    return this.enhancerRegistry.reduce(
      (enhanced, enhance) => enhance(enhanced, this.probeService),
      event,
    );
  }
}
