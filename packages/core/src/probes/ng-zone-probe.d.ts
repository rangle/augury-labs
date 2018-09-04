import { Probe } from '../framework/probes/probe'
export declare class NgZoneProbe extends Probe {
  private ngZone
  beforeNgBootstrap({ ngZone }: { ngZone: any }): void
}
