import { collectRoot } from '../../utils';
import { Probe } from '../probe.class';
import { ComponentTreeEvent } from './../../events/component-tree-events/component-tree-event.class';
import { getAnnotationsFromBootstrapElement } from './../types/ng-module.functions';
import { Node } from './tree-types';
import { transform } from './tree-utils';

declare const ng;

export class ComponentTreeProbe extends Probe {
  private isStableSub;

  public doInitialize(ngZone: any, ngModule: any) {
    const bootstrapElAnno = getAnnotationsFromBootstrapElement(ngModule);
    if (bootstrapElAnno && bootstrapElAnno.selector) {
      if (bootstrapElAnno.selector !== undefined) {
        this.updateRoot(bootstrapElAnno.selector).then(({ root, selector }) => {
          let sanity;
          // Adding sanity threshold to make sure
          // larger app's doesn't get flooded
          const sanityThreshold = 0.5 * 1000; // 0.5 seconds
          const appRef = this.getApplicationRef(root);
          if (this.isStableSub) {
            this.isStableSub.unsubscribe();
          }
          this.isStableSub = appRef.isStable.subscribe(e => {
            if (sanity === undefined || new Date().getTime() - sanity > sanityThreshold) {
              sanity = new Date().getTime();

              const cache = new Map<string, Node>();
              let count = 0;
              const tree = transform([selector], root, cache, n => (count += n));

              this.emit(() => new ComponentTreeEvent(tree));
            }
          });
        });
      }
    }
  }

  private async updateRoot(selector: string) {
    return { root: await collectRoot(selector), selector };
  }

  private getApplicationRef(firstRootDebugElement: any) {
    return firstRootDebugElement.injector.get(ng.coreTokens.ApplicationRef);
  }
}
