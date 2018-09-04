import { Probe } from '../framework/probes/probe'
export declare class NgDebugProbe extends Probe {
  private debugRoots
  getComponentTree(): {
    componentInstance: any
    nativeNode: any
    componentType: any
    domOffsets: import('../core/src/probes/shared-helpers/dom/offsets').PossibleOffsets
    childNodes: any[]
  }[]
  getRootComponent(): any
  afterNgBootstrap(): void
}
