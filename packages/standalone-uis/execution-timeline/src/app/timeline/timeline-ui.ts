import * as d3 from 'd3'

import { darkenColor } from './color-utils'

export interface Segment {
  start: number
  end: number
  row: string
}

const marginFocus = { top: 20, bottom: 110 }
const marginContext = { top: 180, bottom: 30 }
const marginShared = { left: 150, right: 20 }

export class TimelineUI {

  private primaryHighlights: Segment[] = []
  private onClick: (s: Segment) => void
  private segments: Segment[]
  private drag: Segment[]

  private containerEl: SVGElement
  private rows: string[]
  private container: d3.Selection<SVGElement, {}, null, undefined>
  private focusInternalG: d3.Selection<SVGGElement, {}, null, undefined>
  private dragG: d3.Selection<SVGGElement, {}, null, undefined>
  private contextInternalG: d3.Selection<SVGGElement, {}, null, undefined>
  private rowColor: (row: string) => string

  constructor(svgEl: SVGElement, rows: string[], onClick: (s: Segment) => void) {
    this.containerEl = svgEl
    this.rows = rows
    this.onClick = onClick
    this.container = d3.select(svgEl)
  }

  public highlightPrimary(datum: Segment) {
    this.primaryHighlights = [datum]
    this.focusInternalG
      .selectAll('.segment')
      .style('fill', (d: Segment) => this.colorForSegment(d))
      .style('opacity', (d: Segment) => this.opacityForSegment(d))
    this.dragG
      .selectAll('.drag-segment')
      .style('opacity', (d: Segment) => '0.1')
    this.contextInternalG
      .selectAll('.segment')
      .style('fill', (d: Segment) => this.colorForSegment(d))
      .style('opacity', (d: Segment) => this.opacityForSegment(d))
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
    this.containerEl.innerHTML = ''
    this.paint()
  }

  private paint() {
    const tUI = this

    const heightFocus = this.container.node().clientHeight - marginFocus.top - marginFocus.bottom
    const heightContext = this.container.node().clientHeight - marginContext.top - marginContext.bottom
    const widthShared = this.container.node().clientWidth - marginShared.left - marginShared.right

    if (widthShared < 0) { return }

    const scaleXFocus = d3.scaleLinear()
      .domain([0, d3.max(this.segments, d => d.end)])
      .range([0, widthShared])

    const scaleXContext = d3.scaleLinear()
      .domain(scaleXFocus.domain())
      .range(scaleXFocus.range())

    const scaleYFocus = d3.scalePoint()
      .domain(this.rows.concat(['']))
      .range([0, heightFocus])

    const scaleYContext = d3.scalePoint()
      .domain(scaleYFocus.domain())
      .range([0, heightContext])

    // to support more than 10 rows, we have to change the color scheme
    if (this.rows.length > 10) { throw new Error('more than 10 rows') }

    this.rowColor = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(this.rows)

    const axisXFocus = d3.axisBottom(scaleXFocus)

    const axisXContext = d3.axisBottom(scaleXContext)

    const axisYFocus = d3.axisLeft(scaleYFocus)
      .tickPadding(4)
      .tickSize(0)

    const brush = d3.brushX()
      .extent([[0, 0], [widthShared, heightContext]])
      .on('brush end', () => {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') { return; } // ignore brush-by-zoom
        const selection = d3.event.selection || scaleXContext.range()

        const transformation = d3.zoomIdentity
          .scale(widthShared / (selection[1] - selection[0]))
          .translate(-selection[0], 0)

        scaleXFocus.domain(transformation.rescaleX(scaleXContext).domain())

        this.focusInternalG
          .attr('transform', `translate(${transformation.x}) scale(${transformation.k}, 1)`)

        this.dragG
          .attr('transform', `translate(${transformation.x}) scale(${transformation.k}, 1)`)

        focusG.select('.axis--x').call(axisXFocus)
        this.container.select('.zoom').call(zoom.transform, transformation)
      });

    const zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [widthShared, heightFocus]])
      .extent([[0, 0], [widthShared, heightFocus]])
      .on('zoom', () => {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') { return } // ignore zoom-by-brush
        const transformation = d3.event.transform

        scaleXFocus.domain(transformation.rescaleX(scaleXContext).domain())

        this.focusInternalG
          .attr('transform', `translate(${transformation.x}) scale(${transformation.k}, 1)`)

        this.dragG
          .attr('transform', `translate(${transformation.x}) scale(${transformation.k}, 1)`)

        focusG.select('.axis--x').call(axisXFocus);
        contextG.select('.brush').call(brush.move, scaleXFocus.range().map(transformation.invertX, transformation));
      });

    this.container.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', widthShared)
      .attr('height', heightFocus);

    this.container.append('rect')
      .attr('class', 'zoom')
      .style('opacity', '0')
      .attr('width', widthShared)
      .attr('height', heightFocus)
      .attr('transform', `translate(${marginShared.left},${marginFocus.top})`)
      .call(zoom);

    const focusG = this.container.append('g')
      .attr('class', 'focus')
      .attr('transform', `translate(${marginShared.left},${marginFocus.top})`);

    const contextG = this.container.append('g')
      .attr('class', 'context')
      .attr('transform', `translate(${marginShared.left},${marginContext.top})`);

    this.focusInternalG = focusG.append('g')
      .attr('width', widthShared)
      .attr('height', 50)
      .attr('clip-path', 'url(#clip)')
      .append('g')

    this.dragG = focusG.append('g')
      .attr('width', widthShared)
      .attr('height', 50)
      .attr('clip-path', 'url(#clip)')
      .append('g')

    this.focusInternalG
      .selectAll('rect')
      .data(this.segments)
      .enter()
      .append('rect')
      .classed('segment', true)
      .style('fill', d => this.colorForSegment(d))
      .attr('x', d => scaleXFocus(d.start))
      .attr('y', d => scaleYFocus(d.row))
      .attr('width', d => scaleXFocus(d.end) - scaleXFocus(d.start))
      .attr('height', heightFocus / this.rows.length)
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
      .attr('x', d => scaleXFocus(d.start))
      .attr('y', d => 0)
      .attr('width', d => scaleXFocus(d.end) - scaleXFocus(d.start))
      .attr('height', heightFocus)

    focusG.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + heightFocus + ')')
      .call(axisXFocus);

    focusG.append('g')
      .attr('class', 'axis axis--y')
      .attr('id', 'y-axis')
      .call(axisYFocus);

    // format ticks
    this.container.selectAll('#y-axis')
      .style('font', 'bold 15px sans-serif')
      .attr('transform', `translate(0, ${(heightFocus / this.rows.length) / 2})`)

    // fix line after formatting ticks
    this.container.selectAll('#y-axis path.domain')
      .attr('transform', `translate(0, ${-(heightFocus / this.rows.length) / 2})`)

    this.contextInternalG = contextG.append('g')
      .attr('width', widthShared)
      .append('g')

    this.contextInternalG
      .selectAll('rect')
      .data(this.segments)
      .enter()
      .append('rect')
      .classed('segment', true)
      .style('fill', d => this.colorForSegment(d))
      .attr('x', d => scaleXContext(d.start))
      .attr('y', d => scaleYContext(d.row))
      .attr('width', d => scaleXContext(d.end) - scaleXContext(d.start))
      .attr('height', heightContext / (scaleYContext.domain().length - 1))

    this.contextInternalG.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${heightContext})`)
      .call(axisXContext);

    this.contextInternalG.append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, scaleXContext.range());
  }

  private colorForSegment(s: Segment) {
    return this.rowColor(s.row)
  }

  private hoverColorForSegment(s: Segment) {
    if (this.primaryHighlights.indexOf(s) > -1) { return this.rowColor(s.row) }
    return darkenColor(this.rowColor(s.row), 0.3)
  }

  private opacityForSegment(s: Segment) {
    if ((this.primaryHighlights || []).length) {
      if (this.primaryHighlights.indexOf(s) > -1) { return '1' }
      else {
        return '0.5'
      }
    }
    else { return '1' }
  }
}
