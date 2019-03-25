import { Probe } from '../framework/probes';
import { addUpNodeAndChildrenOffsets } from './shared-helpers/dom';

// @todo: rename to ng-debug.ts

declare const ng;
declare const getAllAngularRootElements;

export class NgDebugProbe extends Probe {
  private debugRoots: any[] = [];
  private rootComponent = null;

  public getComponentTree() {
    function subtreeFromDebugElement(debugElement) {
      return {
        componentInstance: debugElement.componentInstance, // todo: shouldn't be giving out actual references
        nativeNode: debugElement.nativeNode, // todo: probably shouldn't give this out either?
        componentType: debugElement.componentInstance.constructor.name,
        domOffsets: addUpNodeAndChildrenOffsets(debugElement.nativeNode),
        childNodes: debugElement.childNodes
          ? [...debugElement.childNodes.map(childNode => subtreeFromDebugElement(childNode))]
          : [],
      };
    }

    return this.debugRoots.map(subtreeFromDebugElement);
  }

  // @todo: i guess we can have multiple root components???
  //        how does that work? (currently not supported)
  public getRootComponent() {
    if (this.rootComponent === null) {
      this.rootComponent = ng.probe(getAllAngularRootElements()[0]).componentInstance;
    }

    return this.rootComponent;
  }

  public afterNgBootstrap() {
    this.debugRoots = getAllAngularRootElements().map(ng.probe);
  }
}
