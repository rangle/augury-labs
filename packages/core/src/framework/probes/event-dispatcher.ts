import { AuguryEvent } from '../events';

import { EventEmitter } from '../event-emitters';
import { ProbeConstructor } from './probe-constructor.interface';
import { Probe } from './probe.class';

export class EventDispatcher extends EventEmitter<AuguryEvent> {
  private readonly probes: Map<string, Probe>;

  constructor(probes: Probe[]) {
    super();

    this.probes = this.initializeProbes(probes);
  }

  public get(constructor: ProbeConstructor): Probe | undefined {
    return this.probes.get(constructor.name);
  }

  public initialize(ngZone, ngModule) {
    this.probes.forEach(probe => probe.initialize && probe.initialize(ngZone, ngModule));
  }

  private initializeProbes(probes: Probe[]): Map<string, Probe> {
    return probes.reduce((probesMap, probe) => {
      probe.setProbeManager(this);

      probesMap.set(probe.constructor.name, probe);

      return probesMap;
    }, new Map<string, Probe>());
  }
}
