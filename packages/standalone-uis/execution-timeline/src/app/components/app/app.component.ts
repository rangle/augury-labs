import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

import { BridgeService } from '../../services/bridge.service';
import { ExtendableSegment } from '../execution-timeline';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  public timelineSegments: ExtendableSegment[] = [];
  public dragSegments: ExtendableSegment[] = [];
  public selectedSegment = null;
  public recording = true;

  private subscription: any;

  constructor(private changeDetectorRef: ChangeDetectorRef, private bridge: BridgeService) {
    // @todo: put bridge in service that runs inside ngzone
    //        add to @augury/ui-tools
    this.subscription = this.bridge.subscribe(message => {
      if (this.recording) {
        if (this.isTimelineSegmentMessage(message)) {
          this.addTimelineSegment(this.toTimelineSegment(message));
        }

        if (message.type === 'drag') {
          this.dragSegments.push({
            start: message.start,
            end: message.finish,
            row: '*',
            color: '',
          });
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

  public addTimelineSegment(segment) {
    this.timelineSegments = this.timelineSegments.concat([segment]);
  }

  public selectSegment(segment) {
    this.selectedSegment = segment;
  }

  private isTimelineSegmentMessage(message) {
    return ['task', 'cycle', 'cd'].indexOf(message.type) > -1;
  }

  private toTimelineSegment(message) {
    if (message.type === 'task') {
      return {
        originalMessage: message,
        start: message.lastElapsedTask.startPerformanceStamp,
        end: message.lastElapsedTask.finishPerformanceStamp,
        row: 'zone task',
        color: message.lastElapsedTask.zone === 'ng' ? '#95BCDA' : '#5A1EAE',
      };
    }
    if (message.type === 'cycle') {
      return {
        originalMessage: message,
        start: message.lastElapsedCycle.startPerformanceStamp,
        end: message.lastElapsedCycle.finishPerformanceStamp,
        row: 'angular instability',
        color: '#D34627',
      };
    }
    if (message.type === 'cd') {
      return {
        originalMessage: message,
        start: message.lastElapsedCD.startPerformanceStamp,
        end: message.lastElapsedCD.finishPerformanceStamp,
        row: 'change detection',
        color: '#9B9B9B',
      };
    }
  }
}
