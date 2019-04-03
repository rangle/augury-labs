import { Probe } from '../framework/probes';
import { addUpNodeAndChildrenOffsets } from './shared-helpers/dom';

declare const ng;
declare const getAllAngularRootElements;

export class NgDebugProbe extends Probe {
  private debugRoots: any[] = [];
  private rootComponent = null;

  public getComponentTree() {
    return this.debugRoots.map(this.getComponentTreeNodesFromDebugElement.bind(this));
  }

  public getRootComponent() {
    if (this.rootComponent === null) {
      this.rootComponent = ng.probe(getAllAngularRootElements()[0]).componentInstance;
    }

    return this.rootComponent;
  }

  public afterNgBootstrap() {
    this.debugRoots = getAllAngularRootElements().map(ng.probe);
  }

  private getComponentTreeNodesFromDebugElement(debugElement) {
    return {
      componentType: debugElement.componentInstance.constructor.name,
      componentInstance: debugElement.componentInstance, // todo: shouldn't be giving out actual references
      nativeNode: debugElement.nativeNode, // todo: probably shouldn't give this out either?
      domOffsets: addUpNodeAndChildrenOffsets(debugElement.nativeNode),
      childNodes: debugElement.children.map(childNode =>
        this.getComponentTreeNodesFromDebugElement(childNode),
      ),
    };
  }
}
