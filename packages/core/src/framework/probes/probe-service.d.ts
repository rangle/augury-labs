import { AuguryEvent } from '../events'
import { SyncEventEmitter } from '../utils'
import { ProbeRegistry } from './probe-registry'
export declare class ProbeService {
  probeEvents: SyncEventEmitter<AuguryEvent>
  private registry
  private probes
  private instantiateProbes
  constructor(registry: ProbeRegistry)
  get(ProbeClass: any): any
  beforeNgBootstrapHook(preBootstrapTargets: any): void
  afterNgBootstrapHook(ngModuleRef: any): void
}
