import { Component, ChangeDetectionStrategy, NgZone, Input, Output, EventEmitter, ViewChild, OnChanges, AfterViewInit, ElementRef } from '@angular/core'

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
  @Input() selectedSegment: ExtendableSegment = null
  @Output() onSegmentClick = new EventEmitter<ExtendableSegment>()
  @ViewChild('svg') svg: ElementRef

  rows = [
    'zone task',
    'angular instability',
    'change detection'
  ]

  timelineUI: TimelineUI

  constructor(
    private zone: NgZone
  ) { }

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
    if (changes['segments'])
      this.timelineUI.updateData(this.segments)
    if (changes['selectedSegment'])
      this.timelineUI.highlightPrimary(this.selectedSegment)
  }

  onResizeSVG(event) {
    this.timelineUI.repaint()
  }
}
