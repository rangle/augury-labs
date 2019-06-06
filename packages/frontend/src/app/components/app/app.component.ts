import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';

import { EventDragInfo, InsightsInfo, isDragMessage, isTimelineMessage } from '@augury/core';
import { MenuTab, TabService } from 'app/services/tab.service';
import { Observable } from 'rxjs';
import { BridgeService } from '../../services/bridge.service';
import { mapTimelineMessageToSegment } from '../../types/segment/segment.functions';
import { Segment } from '../../types/segment/segment.interface';
import { createDefaultTimelineOptions } from '../../types/timeline-options/timeline-options.functions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnDestroy {
  public timelineSegments: Array<Segment<any>> = [];
  public dragSegments: Array<Segment<EventDragInfo>> = [];
  public selectedSegment = null;
  public recording = true;
  public timelineOptions = createDefaultTimelineOptions();
  public insights: InsightsInfo[] = [];
  public activeTab$: Observable<MenuTab>;

  private subscription: any;

  constructor(bridgeService: BridgeService, tabService: TabService) {
    this.subscription = bridgeService.subscribe(message => {
      if (this.recording) {
        if (message.type === 'insights') {
          this.insights.push(message.payload);
        } else {
          const segment = mapTimelineMessageToSegment(message);

          if (isTimelineMessage(message)) {
            this.timelineSegments = this.timelineSegments.concat([segment]);
          } else if (isDragMessage(message)) {
            this.dragSegments.push(segment);
          }
        }
      }
    });

    this.activeTab$ = tabService.activeTab$;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public stop() {
    this.recording = false;
  }

  public start() {
    this.clear();
    this.recording = true;
  }

  public clear() {
    this.timelineSegments = [];
    this.dragSegments = [];
    this.selectedSegment = null;
  }

  public selectSegment(segment) {
    this.selectedSegment = segment;
  }
}
