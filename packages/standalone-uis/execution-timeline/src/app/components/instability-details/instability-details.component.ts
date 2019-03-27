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

function createHierarchyDataFromTree(tree = [] as any[]) {
  return createHierarchyDataFromNodeArray(tree)[0];
}

@Component({
  selector: 'ag-instability-details',
  templateUrl: './instability-details.component.html',
  styleUrls: ['./instability-details.component.scss'],
})
export class InstabilityDetailsComponent implements OnChanges, OnDestroy {
  @Input()
  public segment: any;

  @ViewChild('componentTreeSvg')
  public componentTreeSvg: ElementRef;

  public componentTreeUI: ComponentTreeUI;
  public runtimeInMilliseconds: number;
  public dragInMilliseconds: number;
  public startTimeInMilliseconds: number;

  private subscription: any;

  constructor(private bridge: BridgeService, private zone: NgZone) {}

  public ngOnChanges(changes: SimpleChanges): void {
    this.runtimeInMilliseconds = round2(
      this.segment.finishPerformanceStamp - this.segment.startPerformanceStamp - this.segment.drag,
    );
    this.dragInMilliseconds = round2(this.segment.drag);
    this.startTimeInMilliseconds = round2(this.segment.startPerformanceStamp);

    this.componentTreeUI = new ComponentTreeUI(this.zone, this.componentTreeSvg.nativeElement);

    this.subscription = this.bridge.subscribe(message => {
      if (message.type === 'get_full_cd:response') {
        this.componentTreeUI.updateData(
          createHierarchyDataFromTree(message.data.mergedComponentTree), // @todo: mark new/removed nodes
        );
      }
    });

    // @todo: get just component trees
    //        full CD reducer should use before/after component tree reducer
    this.bridge.send({
      type: 'get_full_cd',
      cdStartEID: this.segment.startEID + 10, // @todo: hack because of above ^
      cdEndEID: this.segment.finishEID - 10,
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
