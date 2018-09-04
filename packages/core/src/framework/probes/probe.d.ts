export declare type EmitFn = (eventType: string, eventPayload?: any) => void
export abstract class Probe {
  emit: EmitFn
  constructor(emit: EmitFn)
  beforeNgBootstrap?(preBootstrapTargets: any): void
  afterNgBootstrap?(ngModuleRef: any): void
}
