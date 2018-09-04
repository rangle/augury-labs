import { Probe } from '../framework/probes/probe'
export declare class ModuleMethodsProbe extends Probe {
  private ngModule
  beforeNgBootstrap({ ngModule }: { ngModule: any }): void
}
