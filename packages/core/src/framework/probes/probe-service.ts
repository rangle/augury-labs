import { AuguryEvent, createEvent } from '../events';
import { SyncEventEmitter } from '../utils';

import { Probe } from './probe';
import { ProbeConstructor } from './probe-constructor.interface';

export class ProbeService {
  public probeEvents = new SyncEventEmitter<AuguryEvent>();

  private probes: Probe[];

  constructor(registry: ProbeConstructor[]) {
    this.probes = this.instantiateProbes(registry);
  }

  // @todo: typing.. Argument of type 'typeof NgDebugProbe' is not assignable to parameter of type
  //  'typeof Probe'. had to make it type "any"
  // @todo: Return the probe instance type that is passed in as a class
  public get(ProbeClass: any): any {
    return this.probes.find(probe => probe.constructor === ProbeClass);
  }

  public beforeNgBootstrapHook(preBootstrapTargets: any) {
    this.probes.forEach(
      probe => probe.beforeNgBootstrap && probe.beforeNgBootstrap(preBootstrapTargets),
    );
  }

  public afterNgBootstrapHook(ngModuleRef: any) {
    this.probes.forEach(probe => probe.afterNgBootstrap && probe.afterNgBootstrap(ngModuleRef));
  }

  private instantiateProbes(constructors: ProbeConstructor[]): Probe[] {
    return constructors.map(
      constructor =>
        new constructor((eventName: string, eventPayload?: any) =>
          this.probeEvents.emit(
            createEvent({ type: 'probe', name: constructor.name }, eventName, eventPayload),
          ),
        ),
    );
  }
}
