import {
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { LastElapsedCycle } from '@augury/core';
import { BridgeService } from '../../services/bridge.service';
import { round2 } from '../../util/misc-utils';
import { ComponentTreeUI } from './component-tree-ui';

function createHierarchyDataFromNodeArray(nodes = [] as any[]) {
  return nodes.map(node => ({
    name: node.componentInstance.constructor.name,
    change: node.change,
    children: createHierarchyDataFromNodeArray(node.childNodes),
  }));
}

function createHierarchyDataFromTree(mergedComponentTree = [] as any[]) {
  return mergedComponentTree.length > 0
    ? createHierarchyDataFromNodeArray(mergedComponentTree)[0]
    : [];
}

@Component({
  selector: 'ag-instability-details',
  templateUrl: './instability-details.component.html',
  styleUrls: ['./instability-details.component.scss'],
})
export class InstabilityDetailsComponent implements OnChanges, OnDestroy {
  @Input()
  public lastElapsedCycle: LastElapsedCycle;

  @ViewChild('componentTreeSvg')
  public componentTreeSvg: ElementRef;

  public componentTreeUI: ComponentTreeUI;
  public runtimeInMilliseconds: number;
  public dragInMilliseconds: number;
  public startTimeInMilliseconds: number;

  private subscription: any;

  constructor(private bridgeService: BridgeService, private zone: NgZone) {}

  public ngOnChanges(changes: SimpleChanges): void {
    this.runtimeInMilliseconds = round2(
      this.lastElapsedCycle.endTimestamp -
        this.lastElapsedCycle.startTimestamp -
        this.lastElapsedCycle.drag,
    );
    this.dragInMilliseconds = round2(this.lastElapsedCycle.drag);
    this.startTimeInMilliseconds = round2(this.lastElapsedCycle.startTimestamp);

    this.componentTreeUI = new ComponentTreeUI(this.zone, this.componentTreeSvg.nativeElement);

    if (!changes.lastElapsedCycle.firstChange) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.bridgeService.subscribe(message => {
      if (message.type === 'get_full_cd:response') {
        // @todo: mark new/removed nodes
        this.componentTreeUI.updateData(
          createHierarchyDataFromTree(message.payload.mergedComponentTree),
        );
      }
    });

    // @todo: get just component trees
    //        full CD reducer should use before/after component tree reducer
    this.bridgeService.send({
      type: 'get_full_cd',
      startEventId: this.lastElapsedCycle.startEventId + 10, // @todo: hack because of above ^
      endEventId: this.lastElapsedCycle.endEventId - 10,
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
