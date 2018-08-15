export type EmitFn =
  (eventType: string, eventPayload?: any) => void // @todo: how to type event payload here?

export abstract class Probe {

  constructor( 
    public emit: EmitFn // @note: public because we need to call it from the targets
  ) { }

  // @todo: how are we handling / exposing errors during attachment?
  public beforeNgBootstrap?(preBootstrapTargets: any): void
  public afterNgBootstrap?(ngModuleRef: any): void

}