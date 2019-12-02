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
import { InstabilityPeriodInfo, Subscription } from '@augury/core';
import { BridgeService } from '../../services/bridge.service';
import { round2 } from '../../util/misc-utils';
import { ComponentTreeUI } from './component-tree-ui';

@Component({
  selector: 'ag-instability-details',
  templateUrl: './instability-details.component.html',
  styleUrls: ['./instability-details.component.scss'],
})
export class InstabilityDetailsComponent implements OnChanges, OnDestroy {
  @Input()
  public instabilityPeriodInfo: InstabilityPeriodInfo;

  @ViewChild('componentTreeSvg', { static: true })
  public componentTreeSvg: ElementRef;

  public componentTreeUI: ComponentTreeUI;
  public runtimeInMilliseconds: number;
  public dragInMilliseconds: number;
  public startTimeInMilliseconds: number;

  private subscription: Subscription;

  constructor(private bridgeService: BridgeService, private zone: NgZone) {}

  public ngOnChanges(changes: SimpleChanges): void {
    this.runtimeInMilliseconds = round2(
      this.instabilityPeriodInfo.endTimestamp -
        this.instabilityPeriodInfo.startTimestamp -
        this.instabilityPeriodInfo.drag,
    );
    this.dragInMilliseconds = round2(this.instabilityPeriodInfo.drag);
    this.startTimeInMilliseconds = round2(this.instabilityPeriodInfo.startTimestamp);

    this.componentTreeUI = new ComponentTreeUI(this.zone, this.componentTreeSvg.nativeElement);

    if (!changes.instabilityPeriodInfo.firstChange) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.bridgeService.subscribe(message => {
      if (message.type === 'component-tree-changes:response') {
        this.componentTreeUI.repaint(message.payload.mergedComponentTree);
      }
    });

    // @todo: get just component trees
    //        full CD reducer should use before/after component tree reducer
    this.bridgeService.send({
      type: 'component-tree-changes',
      payload: {
        startEventId: this.instabilityPeriodInfo.startEventId + 10, // @todo: hack because of above ^
        endEventId: this.instabilityPeriodInfo.endEventId - 10,
      },
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
