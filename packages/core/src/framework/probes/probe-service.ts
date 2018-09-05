import { AuguryEvent, createEvent } from '../events'
import { SyncEventEmitter } from '../utils'

import { Probe } from './probe'
import { ProbeRegistry } from './probe-registry'

export class ProbeService {
  public probeEvents = new SyncEventEmitter<AuguryEvent>()

  private probes: Probe[]

  constructor(private registry: ProbeRegistry) {
    this.probes = this.instantiateProbes(this.registry)
  }

  // @todo: typing.. Argument of type 'typeof NgDebugProbe' is not assignable to parameter of type 'typeof Probe'.
  //        had to make it type "any"
  // @todo: Return the probe instance type that is passed in as a class
  public get(ProbeClass: any): any {
    return this.probes.find(probe => probe.constructor === ProbeClass)
  }

  public beforeNgBootstrapHook(preBootstrapTargets: any) {
    this.probes.forEach(
      probe => probe.beforeNgBootstrap && probe.beforeNgBootstrap(preBootstrapTargets),
    )
  }

  public afterNgBootstrapHook(ngModuleRef: any) {
    this.probes.forEach(probe => probe.afterNgBootstrap && probe.afterNgBootstrap(ngModuleRef))
  }

  // @todo: typing
  private instantiateProbes(
    ProbeConstructors: Array<new (constructorParams: any) => Probe>,
  ): Probe[] {
    return ProbeConstructors.map(
      ProbeConstructor =>
        new ProbeConstructor((eventName: string, eventPayload?: any) =>
          this.probeEvents.emit(
            createEvent({ type: 'probe', name: ProbeConstructor.name }, eventName, eventPayload),
          ),
        ),
    )
  }
}
