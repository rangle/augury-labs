import { Probe } from '../framework/probes';
import { addUpNodeAndChildrenOffsets } from './shared-helpers/dom';

declare const ng;
declare const getAllAngularRootElements;

export class NgDebugProbe extends Probe {
  private debugRoots: any[] = [];
  private rootComponent = null;

  public getComponentTree() {
    return this.debugRoots.map(this.getSubTreeFromDebugElement.bind(this));
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

  private getSubTreeFromDebugElement(debugElement) {
    return {
      componentInstance: debugElement.componentInstance, // todo: shouldn't be giving out actual references
      nativeNode: debugElement.nativeNode, // todo: probably shouldn't give this out either?
      componentType: debugElement.componentInstance.constructor.name,
      domOffsets: addUpNodeAndChildrenOffsets(debugElement.nativeNode),
      childNodes: debugElement.childNodes
        ? [...debugElement.childNodes.map(childNode => this.getSubTreeFromDebugElement(childNode))]
        : [],
    };
  }
}
