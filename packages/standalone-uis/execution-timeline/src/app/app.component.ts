import { ChangeDetectorRef, Component } from '@angular/core'

import { BridgeService } from './bridge.service'
import { ExtendableSegment } from './timeline'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public timelineSegments: ExtendableSegment[] = []
  public dragSegments: ExtendableSegment[] = []
  public selectedSegment = null
  recording = true

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private bridge: BridgeService
  ) {
    // @todo: put bridge in service that runs inside ngzone
    //        add to @augury/ui-tools
    this.bridge.subscribe(
      message => {
        if (!this.recording) return
        if (this.isTimelineSegmentMessage(message)) {
          this.addTimelineSegment(this.toTimelineSegment(message))
        }
        if (message.type === 'drag') {
          this.dragSegments.push({
            start: message.start,
            end: message.finish,
            row: '*'
          })
        }
      }
    )
  }

  stop() {
    this.recording = false
  }

  start() {
    this.clear()
    this.recording = true
  }

  clear() {
    this.timelineSegments = []
    this.dragSegments = []
    this.selectedSegment = null
  }

  public addTimelineSegment(segment) {
    this.timelineSegments = this.timelineSegments.concat([segment])
  }

  public selectSegment(segment) {
    this.selectedSegment = segment
  }

  private isTimelineSegmentMessage(message) {
    return ['task', 'cycle', 'cd'].indexOf(message.type) > -1
  }

  private toTimelineSegment(message) {
    if (message.type === 'task') {
      return {
        originalMessage: message,
        start: message.lastElapsedTask.startPerformanceStamp,
        end: message.lastElapsedTask.finishPerformanceStamp,
        row: 'zone task'
      }
    }
    if (message.type === 'cycle') {
      return {
        originalMessage: message,
        start: message.lastElapsedCycle.startPerformanceStamp,
        end: message.lastElapsedCycle.finishPerformanceStamp,
        row: 'angular instability'
      }
    }
    if (message.type === 'cd') {
      return {
        originalMessage: message,
        start: message.lastElapsedCD.startPerformanceStamp,
        end: message.lastElapsedCD.finishPerformanceStamp,
        row: 'change detection'
      }
    }
  }
}
