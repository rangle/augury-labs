import { addUpNodeAndChildrenOffsets } from '../../probes/shared-helpers/dom';

declare const ng;
declare const getAllAngularRootElements;

let rootComponentInstance = null;
let rootDebugElements: any[] = [];

export function getRootComponentInstance() {
  if (rootComponentInstance === null) {
    rootComponentInstance = ng.probe(getAllAngularRootElements()[0]).componentInstance;
  }

  return rootComponentInstance;
}

export function getComponentTree() {
  return getRootDebugElements().map(getComponentTreeNodesFromDebugElement);
}

function getRootDebugElements() {
  if (rootDebugElements.length === 0) {
    rootDebugElements = getAllAngularRootElements().map(ng.probe);
  }

  return rootDebugElements;
}

function getComponentTreeNodesFromDebugElement(debugElement) {
  return {
    componentType: debugElement.componentInstance.constructor.name,
    componentInstance: debugElement.componentInstance, // todo: shouldn't be giving out actual references
    nativeNode: debugElement.nativeNode, // todo: probably shouldn't give this out either?
    domOffsets: addUpNodeAndChildrenOffsets(debugElement.nativeNode),
    childNodes: debugElement.children.map(childNode =>
      getComponentTreeNodesFromDebugElement(childNode),
    ),
  };
}
