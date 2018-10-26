import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, Output, ViewChild } from '@angular/core'

import { BridgeService } from '../bridge.service'
import { Segment, TimelineUI } from './timeline-ui'

type Required<T> = T & { [P in keyof T]: T[P] }

export type ExtendableSegment = Required<Segment>

@Component({
  selector: 'ag-execution-timeline',
  templateUrl: './execution-timeline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExecutionTimelineComponent implements OnChanges, AfterViewInit {
  @Input() public segments: ExtendableSegment[]
  @Input() public drag: ExtendableSegment[]
  @Input() public selectedSegment: ExtendableSegment = null
  @Output() public onSegmentClick = new EventEmitter<ExtendableSegment>()
  @ViewChild('svg') public svg: ElementRef

  private refreshInterval
  private doRefresh = false

  rows = [
    'zone task',
    'angular instability',
    'change detection'
  ]

  legend = [
    { label: 'zone task', color: 'blue' },
    { label: 'angular instability', color: 'orange' },
    { label: 'change detection', color: 'green' }
  ]

  private timelineUI: TimelineUI

  constructor(
    private zone: NgZone,
  ) {
    this.refreshInterval = setInterval(
      _ => {
        if (this.doRefresh) {
          this.timelineUI.updateData(this.segments, this.drag)
        }
        this.doRefresh = false
      },
      500
    )
  }

  public ngAfterViewInit() {
    this.timelineUI = new TimelineUI(
      this.svg.nativeElement,
      this.rows,
      s => this.zone.run(() => this.onSegmentClick.emit(s))
    )
  }

  public ngOnChanges(changes) {
    if (!this.timelineUI) {
      return
    }
    if (changes.segments || changes.drag) {
      this.doRefresh = true
    }
    if (changes.selectedSegment) {
      this.timelineUI.highlightPrimary(this.selectedSegment)
    }
  }

  public onResizeSVG(event) {
    if (this.timelineUI.isReady()) {
      this.timelineUI.repaint()
    }
  }
}
