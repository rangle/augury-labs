import { AuguryEvent } from '../events';
import { ProbeManager } from '../probes';
import { Enhancer } from './enhancer.type';

export class EnhancerService {
  constructor(private probeManager: ProbeManager, private enhancers: Enhancer[]) {}

  public enhanceEvent(event: AuguryEvent): AuguryEvent {
    return this.enhancers.reduce(
      (enhancedEvent, enhance) => enhance(enhancedEvent, this.probeManager),
      event,
    );
  }
}
