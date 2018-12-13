import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core'

import * as d3 from 'd3'

import { darkenColor } from './color-utils'

type Required<T> = T & { [P in keyof T]: T[P] }

const handleColor = '#6dc7ff'
const spacingFocus = { marginBottom: 20, paddingInner: 2, tickSize: 10 }
const spacingContext = { marginTop: 20, marginBottom: 50, paddingInner: 2, xAxisOffset: 30, tickSize: 10 }
const spacingBrush = { marginTopAndBottom: 3 }
const focusStartSize = 1000
const horizontalScrollScaleFactor = 4

export type ExtendableSegment = Required<Segment>
export interface Segment {
  start: number
  end: number
  row: string
  color: string
}

@Component({
  selector: 'ag-execution-timeline',
  templateUrl: './execution-timeline.component.html',
  styleUrls: ['./execution-timeline.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExecutionTimelineComponent implements OnChanges {
  @Input() public segments: ExtendableSegment[]
  @Input() public augurySegments: ExtendableSegment[]
  @Input() public selectedSegment: ExtendableSegment = null
  @Output() public onSegmentClick = new EventEmitter<ExtendableSegment>()

  @ViewChild('contextOuterContainer') public contextOuterContainerElement: ElementRef
  @ViewChild('contextContainer') public contextContainerSVGElement: ElementRef
  @ViewChild('contextContent') public contextContentGElement: ElementRef
  @ViewChild('contextAxis') public contextAxisGElement: ElementRef
  @ViewChild('contextBrush') public contextBrushGElement: ElementRef

  @ViewChild('focusOuterContainer') public focusOuterContainerElement: ElementRef
  @ViewChild('focusContainer') public focusContainerSVGElement: ElementRef
  @ViewChild('focusContent') public focusContentGElement: ElementRef
  @ViewChild('focusMainContent') public focusContentMainGElement: ElementRef
  @ViewChild('focusAuguryContent') public focusContentAuguryGElement: ElementRef
  @ViewChild('focusAxis') public focusAxisGElement: ElementRef

  public rows = ['zone task', 'angular instability', 'change detection']

  public legend = [
    {
      label: 'ng zone tasks',
      color: '#1f77b4',
      desc: `Zone tasks represent synchronous JS
      execution runs detected by ZoneJS.`,
    },
    {
      label: 'root zone task',
      color: '#5a1eae',
      desc: `Zone tasks represent synchronous JS
      execution runs detected by ZoneJS.`,
    },
    {
      label: 'angular instability',
      color: 'orange',
      desc: `Angular defines instability as the period
        after some JS activity occurred within ngZone,
        but before change detection has reconciled the view.`,
    },
    {
      label: 'change detection',
      color: 'green',
      desc: `Change detection occurs at least once for each instability period.`,
    },
  ]

  private primaryHighlights: Segment[] = []

  private rowColor: (row: string) => string
  private lastPosition: [number, number]

  constructor(private zone: NgZone) {}

  public ngOnChanges(changes) {
    if (changes.segments || changes.augurySegments) {
      this.paint()
    }
    if (changes.hasOwnProperty('selectedSegment')) {
      this.highlightPrimary(this.selectedSegment)
    }
  }

  public onResizeSVG(event) {
    if (this.isReady()) {
      this.paint()
    }
  }

  public highlightPrimary(segment: Segment) {
    this.primaryHighlights = segment ? [segment] : []
    d3.select(this.focusContentGElement.nativeElement)
      .selectAll('.segment')
      .style('fill', (d: Segment) => this.colorForSegment(d))
    d3.select(this.contextContentGElement.nativeElement)
      .selectAll('.segment')
      .style('fill', (d: Segment) => this.colorForSegment(d))
  }

  public isReady() {
    return this.segments && this.augurySegments
  }

  private paint() {
    d3.select(this.contextContentGElement.nativeElement).selectAll('*').remove()
    d3.select(this.focusContentAuguryGElement.nativeElement).selectAll('*').remove()
    d3.select(this.focusContentMainGElement.nativeElement).selectAll('*').remove()
    this._paint()
  }

  private _paint() {
    const heightFocus = Math.max(0, this.focusOuterContainerElement.nativeElement.clientHeight - spacingFocus.marginBottom)
    const heightContextOuter = Math.max(0, this.contextOuterContainerElement.nativeElement.clientHeight)
    const heightContextInner = Math.max(0, heightContextOuter - spacingContext.marginBottom - spacingContext.marginTop)
    const widthFocus = this.focusOuterContainerElement.nativeElement.clientWidth
    const widthContext = this.contextOuterContainerElement.nativeElement.clientWidth
    const contextWidthOverFocusWidth = widthContext / widthFocus
    const focusWidthOverContextWidth = widthFocus / widthContext

    if (widthFocus < 0) { return }

    const minStart = d3.min(this.segments, d => d.start)
    const maxEnd = d3.max(this.segments, d => d.end)

    const scaleXFocus = d3.scaleLinear()
      .domain([0, maxEnd - minStart])
      .range([0, widthFocus])

    const scaleXContext = d3.scaleLinear()
      .domain(scaleXFocus.domain())
      .range([0, widthContext])

    const scaleYFocus = d3.scaleBand()
      .domain(this.rows)
      .range([0, heightFocus])

    const scaleYContext = d3.scaleBand()
      .domain(scaleYFocus.domain())
      .range([0, heightContextInner])

    // to support more than 10 rows, we have to change the color scheme
    if (this.rows.length > 10) { throw new Error('more than 10 rows') }

    this.rowColor = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(this.rows)

    const axisXFocus = d3.axisBottom(scaleXFocus)
      .tickFormat((d: number) => `${d} ms`)

    const axisXContext = d3.axisBottom(scaleXContext)
      .tickSize(spacingContext.tickSize)
      .tickFormat((d: number) => `${d} ms`)

    const axisYFocus = d3.axisLeft(scaleYFocus)
      .tickSize(spacingFocus.tickSize)
      .tickPadding(4)

    d3.select(this.focusAxisGElement.nativeElement)
      .attr('transform', 'translate(0,' + heightFocus + ')')
      .call(axisXFocus)

    const brush = d3.brushX()
      .extent([[0, spacingBrush.marginTopAndBottom], [widthContext, Math.max(0, heightContextOuter - spacingBrush.marginTopAndBottom)]])
      .on('brush end', () => {
        const selection = d3.event.selection || scaleXContext.range()
        d3.select(this.contextContainerSVGElement.nativeElement)
          .select('#selectionMaskBackground')
          .attr('width', selection[1] - selection[0])
          .attr('x', selection[0])

        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') { return } // ignore brush-by-zoom
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'end') {
          this.lastPosition = [scaleXContext(selection[0]), scaleXContext(selection[1])]
        }
        const transformation = d3.zoomIdentity
          .scale(widthContext / (selection[1] - selection[0]))
          .translate(-selection[0], 0)

        if (transformation.x === 0 && transformation.k === 1) { return }

        scaleXFocus.domain(transformation.rescaleX(scaleXContext).domain())

        const translation = transformation.k * scaleXContext(-scaleXFocus.domain()[0]) * focusWidthOverContextWidth
        const scale = transformation.k

        d3.select(this.focusContentGElement.nativeElement)
          .attr('transform', `translate(${translation}) scale(${scale}, 1)`)

        d3.select(this.focusContainerSVGElement.nativeElement)
          .call(zoom.transform, transformation)

        d3.select(this.focusAxisGElement.nativeElement)
          .call(axisXFocus)
      })

    const zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [widthFocus, heightFocus]])
      .extent([[0, 0], [widthFocus, heightFocus]])
      .on('zoom', () => {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') { return } // ignore zoom-by-brush
        const transformation = d3.event.transform

        scaleXFocus.domain(transformation.rescaleX(scaleXContext).domain())

        const translation = transformation.k * scaleXContext(-scaleXFocus.domain()[0]) * focusWidthOverContextWidth
        const scale = transformation.k

        d3.select(this.focusContentGElement.nativeElement)
          .attr('transform', `translate(${translation}) scale(${scale}, 1)`)

        d3.select(this.focusAxisGElement.nativeElement)
          .call(axisXFocus)

        d3.select(this.contextBrushGElement.nativeElement)
          .call(brush.move, [scaleXContext(scaleXFocus.domain()[0]), scaleXContext(scaleXFocus.domain()[1])])

      })

    d3.select(this.focusContentMainGElement.nativeElement)
      .selectAll('rect')
      .data(this.segments)
      .enter()
      .append('rect')
      .classed('segment', true)
      .style('fill', d => this.colorForSegment(d))
      .attr('x', d => scaleXFocus(d.start - minStart) + spacingFocus.paddingInner)
      .attr('y', d => scaleYFocus(d.row))
      .attr('width', d => scaleXFocus(d.end - minStart) - scaleXFocus(d.start - minStart))
      .attr('height', Math.max(0, heightFocus / this.rows.length - spacingFocus.paddingInner))
      .on('click', d => this.zone.run(() => this.onSegmentClick.emit(d)))
      .on('mouseover', (d) => {
        d3.select(this.focusContentMainGElement.nativeElement)
          .selectAll('rect')
          .style('fill', (d2: Segment) => this.colorForSegment(d2))
        d3.select(d3.event.target)
          .style('fill', this.hoverColorForSegment(d))
      })
      .on('mouseout', (d) => {
        d3.select(this.focusContentMainGElement.nativeElement)
          .selectAll('rect')
          .style('fill', (d2: Segment) => this.colorForSegment(d2))
      })

    d3.select(this.focusContentAuguryGElement.nativeElement)
      .selectAll('rect')
      .data(this.augurySegments)
      .enter()
      .append('rect')
      .classed('augury-segment', true)
      .style('fill', 'grey')
      .style('opacity', '0.2')
      .style('pointer-events', 'none')
      .attr('x', d => scaleXFocus(d.start - minStart))
      .attr('y', d => 0)
      .attr('width', d => scaleXFocus(d.end - minStart) - scaleXFocus(d.start - minStart))
      .attr('height', heightFocus)

    d3.select(this.contextContentGElement.nativeElement)
      .selectAll('rect')
      .data(this.segments)
      .enter()
      .append('rect')
      .classed('segment', true)
      .style('fill', d => this.colorForSegment(d))
      .attr('x', d => scaleXContext(d.start - minStart))
      .attr('y', d => scaleYContext(d.row) + spacingContext.paddingInner + spacingContext.marginTop)
      .attr('width', d => scaleXContext(d.end - minStart) - scaleXContext(d.start - minStart))
      .attr('height', Math.max(0, heightContextInner / this.rows.length) - spacingFocus.paddingInner)

    d3.select(this.contextAxisGElement.nativeElement)
      .style('font', '8px times')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${heightContextInner + spacingContext.xAxisOffset})`)
      .call(axisXContext)

    const lastSegment = this.segments[this.segments.length - 1]

    d3.select(this.contextBrushGElement.nativeElement)
      .call(brush)

    d3.select(this.focusContainerSVGElement.nativeElement)
      .call(zoom)

    d3.select(this.focusOuterContainerElement.nativeElement)
      .on('wheel.zoom', () => {
        if (d3.event.shiftKey) {
          const scaledDelta = d3.event.deltaX / horizontalScrollScaleFactor
          const selectionRange = [scaleXContext(scaleXFocus.domain()[0]), scaleXContext(scaleXFocus.domain()[1])]
          const constrainedDelta = scaledDelta > 0 ? Math.min(scaleXContext.range()[1] - selectionRange[1], scaledDelta) : Math.max(scaledDelta, -selectionRange[0])
          if (scaledDelta !== 0) {
            d3.select(this.contextBrushGElement.nativeElement)
              .call(brush.move, [selectionRange[0] + constrainedDelta, selectionRange[1] + constrainedDelta])
          }
        }
      })

    if (lastSegment) {
      const hasPassedMin = lastSegment.end > focusStartSize + 100
      const endMs = hasPassedMin ? focusStartSize : lastSegment.end * .8
      const scaleFactor = scaleXContext.range()[1] / (scaleXContext.domain()[1] - scaleXContext.domain()[0])
      const pos: [number, number] = !this.lastPosition && hasPassedMin
        ? [0, endMs]
        : [scaleFactor * (this.lastPosition ? this.lastPosition[0] : 0), scaleFactor * (this.lastPosition ? this.lastPosition[1] : endMs)]

      if (!this.lastPosition && hasPassedMin) {
        this.lastPosition = pos
      }
      d3.select(this.contextBrushGElement.nativeElement)
        .call(brush.move, pos)
  }

  d3.select(this.contextContainerSVGElement.nativeElement)
    .select('.brush .overlay')
    .attr('mask', 'url(#selectionMask)')

  d3.select(this.contextContainerSVGElement.nativeElement)
    .select('#selectionMaskCutout')
    .style('width', widthContext)
    .style('height', heightContextInner)
    .attr('y', spacingContext.marginTop)

  d3.select(this.contextBrushGElement.nativeElement)
    .on('mouseover', (d) => {
      d3.select(this.contextBrushGElement.nativeElement).selectAll('.handle')
        .style('fill', () => handleColor)
    })
    .on('mouseout', (d) => {
      d3.select(this.contextBrushGElement.nativeElement).selectAll('.handle')
        .style('fill', null)
    })
  }

  private colorForSegment(s: Segment) {
    const c = s.color || this.rowColor(s.row)
    if ((this.primaryHighlights || []).length) {
      const isHighlighted = this.primaryHighlights.indexOf(s) > -1
      return isHighlighted ? darkenColor(c, .5) : c
    }
    return c
  }

  private hoverColorForSegment(s: Segment) {
    if (this.primaryHighlights.indexOf(s) > -1) { return this.colorForSegment(s) }
    return darkenColor(this.colorForSegment(s), 0.3)
  }

}
