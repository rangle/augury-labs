import * as d3 from 'd3'

import { darkenColor } from './color-utils'

export interface Segment {
  start: number
  end: number
  row: string
  color: string
}

const handleColor = '#6dc7ff'
const spacingFocus = { marginBottom: 20, paddingInner: 2, tickSize: 10 }
const spacingContext = { marginTop: 20, marginBottom: 50, paddingInner: 2, xAxisOffset: 30, tickSize: 10 }
const spacingBrush = { marginTopAndBottom: 3 }
const focusStartSize = 1000

export class TimelineUI {

  private primaryHighlights: Segment[] = []
  private onClick: (s: Segment) => void
  private segments: Segment[]
  private drag: Segment[]

  private containerEl: SVGElement
  private containerEl2: SVGElement
  private rows: string[]
  private container: d3.Selection<SVGElement, {}, null, undefined>
  private container2: d3.Selection<SVGElement, {}, null, undefined>
  private focusInternalG: d3.Selection<SVGGElement, {}, null, undefined>
  private dragG: d3.Selection<SVGGElement, {}, null, undefined>
  private contextG: d3.Selection<SVGGElement, {}, null, undefined>
  private contextInternalG: d3.Selection<SVGGElement, {}, null, undefined>
  private rowColor: (row: string) => string
  private lastPosition: [number, number]

  constructor(svgEl: SVGElement, svgEl2: SVGElement, rows: string[], onClick: (s: Segment) => void) {
    this.containerEl = svgEl
    this.containerEl2 = svgEl2
    this.rows = rows
    this.onClick = onClick
    this.container = d3.select(svgEl)
    this.container2 = d3.select(svgEl2)
    this.contextG = this.container.select('#context-group')
  }

  public highlightPrimary(segment: Segment) {
    this.primaryHighlights = segment ? [segment] : []
    this.focusInternalG
      .selectAll('.segment')
      .style('fill', (d: Segment) => this.colorForSegment(d))
    this.dragG
      .selectAll('.drag-segment')
      .style('opacity', (d: Segment) => '0.1')
    this.contextInternalG
      .selectAll('.segment')
      .style('fill', (d: Segment) => this.colorForSegment(d))
  }

  public updateData(segments: Segment[], drag: Segment[]) {
    const rowException = segments.find(d => !this.rows.some(row => row === d.row))
    if (rowException) {
      throw new Error(`recevied datum with row "${rowException.row}", which is not listed in given rows`)
    }

    this.segments = segments
    this.drag = drag

    this.repaint()
  }

  public isReady() {
    return this.segments && this.drag
  }

  public repaint() {
    this.contextG.selectAll('*').remove()
    this.containerEl2.innerHTML = ''
    this.paint()
  }

  private paint() {
    const tUI = this

    const heightFocus = this.container2.node().clientHeight - spacingFocus.marginBottom
    const heightContextOuter = this.container.node().clientHeight
    const heightContextInner = heightContextOuter - spacingContext.marginBottom - spacingContext.marginTop
    const widthFocus = this.container2.node().clientWidth
    const widthContext = this.container.node().clientWidth
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
      .tickSize(0)

    const brush = d3.brushX()
      .extent([[0, spacingBrush.marginTopAndBottom], [widthContext, heightContextOuter - spacingBrush.marginTopAndBottom]])
      .on('brush end', () => {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') { return } // ignore brush-by-zoom
        const selection = d3.event.selection || scaleXContext.range()
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'mousemove') {
          this.lastPosition = [scaleXContext(selection[0]), scaleXContext(selection[1])]
        }
        const transformation = d3.zoomIdentity
          .scale(widthContext / (selection[1] - selection[0]))
          .translate(-selection[0], 0)

        if (transformation.x === 0 && transformation.k === 1) { return }

        scaleXFocus.domain(transformation.rescaleX(scaleXContext).domain())

        const translation = transformation.k * scaleXContext(-scaleXFocus.domain()[0]) * focusWidthOverContextWidth
        const scale = transformation.k

        this.focusInternalG
          .attr('transform', `translate(${translation}) scale(${scale}, 1)`)

        this.dragG
          .attr('transform', `translate(${translation}) scale(${scale}, 1)`)

        focusG.select('.axis--x').call(axisXFocus)
        this.container.select('.zoom').call(zoom.transform, transformation)
      });

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

        this.focusInternalG
          .attr('transform', `translate(${translation}) scale(${scale}, 1)`)

        this.dragG
          .attr('transform', `translate(${translation}) scale(${scale}, 1)`)

        focusG.select('.axis--x').call(axisXFocus);
      });

    // this.container2.append('rect')
    //   .attr('class', 'zoom')
    //   .style('opacity', '0')
    //   .attr('width', widthFocus)
    //   .attr('height', heightFocus)
    //   .call(zoom);

    const focusG = this.container2.append('g')
      .attr('class', 'focus')
      .attr('height', heightFocus - spacingFocus.paddingInner)

    this.focusInternalG = focusG.append('g')
      .attr('width', widthFocus)
      .attr('class', 'internalG')
      .append('g')

    this.dragG = focusG.append('g')
      .attr('width', widthFocus)
      .attr('class', 'dragG')
      .append('g')

    this.focusInternalG
      .selectAll('rect')
      .data(this.segments)
      .enter()
      .append('rect')
      .classed('segment', true)
      .style('fill', d => this.colorForSegment(d))
      .attr('x', d => scaleXFocus(d.start - minStart) + spacingFocus.paddingInner)
      .attr('y', d => scaleYFocus(d.row))
      .attr('width', d => scaleXFocus(d.end - minStart) - scaleXFocus(d.start - minStart))
      .attr('height', (heightFocus / this.rows.length) - spacingFocus.paddingInner)
      .on('click', d => this.onClick(d))
      .on('mouseover', function (d) {
        tUI.focusInternalG
          .selectAll('rect')
          .style('fill', (d2: Segment) => tUI.colorForSegment(d2))
        d3.select(this)
          .style('fill', tUI.hoverColorForSegment(d))
      })
      .on('mouseout', (d) => {
        this.focusInternalG
          .selectAll('rect')
          .style('fill', (d2: Segment) => this.colorForSegment(d2))
      })

    this.dragG
      .selectAll('rect')
      .data(this.drag)
      .enter()
      .append('rect')
      .classed('drag-segment', true)
      .style('fill', 'grey')
      .style('opacity', '0.2')
      .style('pointer-events', 'none')
      .attr('x', d => scaleXFocus(d.start - minStart))
      .attr('y', d => 0)
      .attr('width', d => scaleXFocus(d.end - minStart) - scaleXFocus(d.start - minStart))
      .attr('height', heightFocus)

    focusG.append('g')
      .style('font', '8px times')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + heightFocus + ')')
      .call(axisXFocus);

    this.contextInternalG = this.contextG.append('g')
      .attr('width', widthContext)
      .append('g')

    this.contextInternalG
      .selectAll('rect')
      .data(this.segments)
      .enter()
      .append('rect')
      .classed('segment', true)
      .style('fill', d => this.colorForSegment(d))
      .attr('x', d => scaleXContext(d.start - minStart))
      .attr('y', d => scaleYContext(d.row) + spacingContext.paddingInner + spacingContext.marginTop)
      .attr('width', d => scaleXContext(d.end - minStart) - scaleXContext(d.start - minStart))
      .attr('height', (heightContextInner / this.rows.length) - spacingFocus.paddingInner)

    this.contextInternalG.append('g')
      .style('font', '8px times')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${heightContextInner + spacingContext.xAxisOffset})`)
      .call(axisXContext);

    const lastSegment = this.segments[this.segments.length - 1]

    const b = this.contextInternalG
      .append('g')
      .attr('class', 'brush')
      .call(brush)

    if (lastSegment) {
      const hasPassedMin = lastSegment.end > focusStartSize + 100
      const endMs = hasPassedMin ? focusStartSize : lastSegment.end * .8
      const pos: [number, number] = [0, endMs]
      if (!this.lastPosition && hasPassedMin) {
        this.lastPosition = pos
      }
      const scaleFactor = (scaleXContext.range()[1] / (scaleXContext.domain()[1] - scaleXContext.domain()[0]))
      b.call(brush.move, [scaleFactor * this.lastPosition[0], scaleFactor * this.lastPosition[1]])
    }

    this.contextInternalG
      .on('mouseover', (d) => {
        this.contextInternalG.selectAll('.handle')
          .style('fill', (d: Segment) => handleColor)
      })
      .on('mouseout', (d) => {
        this.contextInternalG.selectAll('.handle')
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
