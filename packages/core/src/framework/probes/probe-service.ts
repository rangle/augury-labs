import { AuguryEvent, createEvent } from '../events';
import { SyncEventEmitter } from '../utils';

import { Probe } from './probe';
import { ProbeConstructor } from './probe-constructor.interface';

export class ProbeService {
  public probeEvents = new SyncEventEmitter<AuguryEvent>();

  private readonly probes: Map<string, Probe>;

  constructor(constructors: ProbeConstructor[]) {
    this.probes = this.instantiateProbes(constructors);
  }

  // @todo: Return the probe instance type that is passed in as a class
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

  private instantiateProbes(constructors: ProbeConstructor[]): Map<string, Probe> {
    return constructors.reduce((probes, constructor) => {
      probes.set(
        constructor.name,
        new constructor((eventName: string, eventPayload?: any) =>
          this.probeEvents.emit(
            createEvent({ type: 'probe', name: constructor.name }, eventName, eventPayload),
          ),
        ),
      );

      return probes;
    }, new Map<string, Probe>());
  }
}
