import { AuguryEvent } from '../events';

import { EventEmitter } from '../event-emitters';
import { Probe } from './probe.class';

export class ProbeManager extends EventEmitter<AuguryEvent> {
  private readonly probes: Map<string, Probe>;

  constructor(probes: Probe[], ngZone, ngModule) {
    super();

    this.probes = this.initializeProbes(probes, ngZone, ngModule);
  }

  private initializeProbes(probes: Probe[], ngZone, ngModule): Map<string, Probe> {
    return probes.reduce((probesMap, probe) => {
      probe.initialize(this, ngZone, ngModule);

      probesMap.set(probe.constructor.name, probe);

      return probesMap;
    }, new Map<string, Probe>());
  }
}
