import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, Output, ViewChild } from '@angular/core'

import { BridgeService } from '../bridge.service'
import { Segment, TimelineUI } from './timeline-ui'

type Required<T> = T & { [P in keyof T]: T[P] }

export type ExtendableSegment = Required<Segment>

@Component({
  selector: 'ag-execution-timeline',
  templateUrl: './execution-timeline.component.html',
  styleUrls: ['./execution-timeline.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExecutionTimelineComponent implements OnChanges, AfterViewInit {
  @Input() public segments: ExtendableSegment[]
  @Input() public drag: ExtendableSegment[]
  @Input() public selectedSegment: ExtendableSegment = null
  @Output() public onSegmentClick = new EventEmitter<ExtendableSegment>()
  @ViewChild('svg') public svg: ElementRef
  @ViewChild('svg2') public svg2: ElementRef

  // @todo: merge rows with legend (will have to touch timeline-ui)
  public rows = [
    'zone task',
    'angular instability',
    'change detection'
  ]

  public legend = [
    {
      label: 'ng zone tasks',
      color: '#1f77b4',
      desc: `Zone tasks represent synchronous JS
      execution runs detected by ZoneJS.`
    },
    {
      label: 'root zone task',
      color: '#5a1eae',
      desc: `Zone tasks represent synchronous JS
      execution runs detected by ZoneJS.`
    },
    {
      label: 'angular instability',
      color: 'orange',
      desc: `Angular defines instability as the period
        after some JS activity occurred within ngZone,
        but before change detection has reconciled the view.`
    },
    {
      label: 'change detection',
      color: 'green',
      desc: `Change detection occurs at least once for each instability period.`
    }
  ]

  private timelineUI: TimelineUI
  private refreshInterval
  private doRefresh = false

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
      this.svg2.nativeElement,
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
    if (changes.hasOwnProperty('selectedSegment')) {
      this.timelineUI.highlightPrimary(this.selectedSegment)
    }
  }

  public onResizeSVG(event) {
    if (this.timelineUI.isReady()) {
      this.timelineUI.repaint()
    }
  }
}
