import { Component, ChangeDetectionStrategy, NgZone, Input, Output, EventEmitter, ViewChild, OnChanges, AfterViewInit, ElementRef } from '@angular/core'

import { BridgeService } from '../bridge.service'
import { TimelineUI, Segment } from './timeline-ui'

type Required<T> = T & { [P in keyof T]: T[P] }

export type ExtendableSegment = Required<Segment>

@Component({
  selector: 'ag-execution-timeline',
  templateUrl: './execution-timeline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExecutionTimelineComponent implements OnChanges, AfterViewInit {
  @Input() segments: ExtendableSegment[]
  @Input() drag: ExtendableSegment[]
  @Input() selectedSegment: ExtendableSegment = null
  @Output() onSegmentClick = new EventEmitter<ExtendableSegment>()
  @ViewChild('svg') svg: ElementRef

  private refreshInterval
  private doRefresh = false

  private rows = [
    'zone task',
    'angular instability',
    'change detection'
  ]

  private timelineUI: TimelineUI

  constructor(
    private zone: NgZone,
  ) {
    this.refreshInterval = setInterval(
      () => {
        if (this.doRefresh)
          this.timelineUI.updateData(this.segments, this.drag)
        this.doRefresh = false
      },
      500
    )
  }

  ngAfterViewInit() {
    this.timelineUI = new TimelineUI(
      this.svg.nativeElement,
      this.rows,
      s => this.zone.run(() => this.onSegmentClick.emit(s))
    )
  }

  ngOnChanges(changes) {
    if (!this.timelineUI)
      return
    if (changes['segments'] || changes['drag'])
      this.doRefresh = true
    if (changes['selectedSegment'])
      this.timelineUI.highlightPrimary(this.selectedSegment)
  }

  onResizeSVG(event) {
    if (this.timelineUI.isReady())
      this.timelineUI.repaint()
  }
}
