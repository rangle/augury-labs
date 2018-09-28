import { Component, ChangeDetectorRef } from '@angular/core'

import { ExtendableSegment } from './timeline'
import { BridgeService } from './bridge.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  timelineSegments: ExtendableSegment[] = []
  selectedSegment = null

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private bridge: BridgeService
  ) {
    // @todo: put bridge in service that runs inside ngzone
    //        add to @augury/ui-tools
    this.bridge.subscribe(
      message => {
        if (this.isTimelineSegmentMessage(message))
          this.addTimelineSegment(this.toTimelineSegment(message))
      }
    )
  }

  addTimelineSegment(segment) {
    this.timelineSegments = this.timelineSegments.concat([segment])
  }

  selectSegment(segment) {
    this.selectedSegment = segment
  }

  private isTimelineSegmentMessage(message) {
    return ['task', 'cycle', 'cd'].indexOf(message.type) > -1
  }

  private toTimelineSegment(message) {
    if (message.type === 'task')
      return {
        originalMessage: message,
        start: message.lastElapsedTask.startPerformanceStamp,
        end: message.lastElapsedTask.finishPerformanceStamp,
        row: 'zone task'
      }
    if (message.type === 'cycle')
      return {
        originalMessage: message,
        start: message.lastElapsedCycle.startPerformanceStamp,
        end: message.lastElapsedCycle.finishPerformanceStamp,
        row: 'angular instability'
      }
    if (message.type === 'cd')
      return {
        originalMessage: message,
        start: message.lastElapsedCD.startPerformanceStamp,
        end: message.lastElapsedCD.finishPerformanceStamp,
        row: 'change detection'
      }
  }
}
