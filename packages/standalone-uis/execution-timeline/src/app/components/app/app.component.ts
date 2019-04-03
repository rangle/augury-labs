import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';

import { isDragMessage, isTimelineMessage } from '@augury/core';
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
  public timelineSegments: Segment[] = [];
  public dragSegments: Segment[] = [];
  public selectedSegment = null;
  public recording = true;
  public timelineOptions = createDefaultTimelineOptions();

  private subscription: any;

  constructor(bridgeService: BridgeService) {
    this.subscription = bridgeService.subscribe(message => {
      if (this.recording) {
        const segment = mapTimelineMessageToSegment(message);

        if (isTimelineMessage(message)) {
          this.timelineSegments = this.timelineSegments.concat([segment]);
        } else if (isDragMessage(message)) {
          this.dragSegments.push(segment);
        }
      }
    });
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
