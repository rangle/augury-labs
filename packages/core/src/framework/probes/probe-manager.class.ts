import { AuguryEvent } from '../events';

import { SyncEventEmitter } from '../event-emitters';
import { ProbeConstructor } from './probe-constructor.interface';
import { Probe } from './probe.class';

export class ProbeManager extends SyncEventEmitter<AuguryEvent> {
  private readonly probes: Map<string, Probe>;

  constructor(probes: Probe[]) {
    super();

    this.probes = this.initializeProbes(probes);
  }

  public get(constructor: ProbeConstructor): Probe | undefined {
    return this.probes.get(constructor.name);
  }

  public beforeNgBootstrapHook(preBootstrapTargets: any) {
    this.probes.forEach(
      probe => probe.beforeNgBootstrap && probe.beforeNgBootstrap(preBootstrapTargets),
    );
  }

  public afterNgBootstrapHook(ngModuleRef: any) {
    this.probes.forEach(probe => probe.afterNgBootstrap && probe.afterNgBootstrap(ngModuleRef));
  }

  private initializeProbes(probes: Probe[]): Map<string, Probe> {
    return probes.reduce((probesMap, probe) => {
      probe.setProbeManager(this);

      probesMap.set(probe.constructor.name, probe);

      return probesMap;
    }, new Map<string, Probe>());
  }
}
