import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from '@augury/core';
import { BridgeService } from '../../services';

@Component({
  selector: 'ag-component-tree',
  templateUrl: './component-tree.component.html',
  styleUrls: ['./component-tree.component.scss'],
})
export class ComponentTreeComponent implements OnInit, OnDestroy {
  public treeInfo;
  private subscription: Subscription;

  constructor(private bridgeSvc: BridgeService) {}

  public ngOnInit() {
    this.subscription = this.bridgeSvc.subscribe(message => {
      console.log('Got new tree: ', message.payload);
      if (message.type === 'component-tree') {
        this.treeInfo = message.payload;
      }
    });
  }

  public trackById(index: number, node: any): string {
    return node.id;
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
