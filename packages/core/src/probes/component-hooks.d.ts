import { Probe } from '../framework/probes/probe'
export declare const HookNames: string[]
export declare class ComponentHooksProbe extends Probe {
  private ngModule
  beforeNgBootstrap({ ngModule }: { ngModule: any }): void
}
