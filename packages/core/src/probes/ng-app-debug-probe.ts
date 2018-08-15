import { Probe } from '../framework/probes/probe'
import { addUpNodeAndChildrenOffsets } from './shared-helpers/dom/offsets'

// @todo: rename to ng-debug.ts

declare const ng
declare const getAllAngularRootElements

export class NgDebugProbe extends Probe {
  private debugRoots: any[] = []

  public getComponentTree() {
    function subtreeFromDebugElement(debugElement) {
      return {
        componentInstance: debugElement.componentInstance, // todo: shouldnt be giving out actual references
        nativeNode: debugElement.nativeNode, // todo: probably shouldnt give this out either?
        componentType: debugElement.componentInstance.constructor.name,
        domOffsets: addUpNodeAndChildrenOffsets(debugElement.nativeNode),
        childNodes: debugElement.childNodes
          ? [...debugElement.childNodes.map(cn => subtreeFromDebugElement(cn))]
          : [],
      }
    }
    return this.debugRoots.map(subtreeFromDebugElement)
  }

  // @todo: i guess we can have multiple root components???
  //        how does that work? (currently not supported)
  public getRootComponent() {
    return ng.probe(getAllAngularRootElements()[0]).componentInstance
  }

  afterNgBootstrap() {
    this.debugRoots = getAllAngularRootElements().map(ng.probe)
  }
}
