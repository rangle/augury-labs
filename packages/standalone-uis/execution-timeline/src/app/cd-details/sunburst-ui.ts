import * as d3 from 'd3'

import { NgZone } from '@angular/core';

export class SunburstUI {

  private containerEl: SVGElement
  private data: any

  constructor(private zone: NgZone, svgEl: SVGElement) {
    this.containerEl = svgEl
  }

  public updateData(data: any) {
    this.data = data

    this.repaint()
  }

  public repaint() {
    this.containerEl.innerHTML = ''
    setTimeout(() => this.zone.run(() => this.paint()), 500)
  }

  private paint() {
    if (!this.data) { throw new Error('no data provided') }

    const width = this.containerEl.clientWidth
    const height = this.containerEl.clientHeight
    const radius = (Math.min(width * 0.8, height) / 2) - 10

    const formatNumber = d3.format(",d")

    const x = d3.scaleLinear().range([0, 2 * Math.PI])

    const y = d3.scaleSqrt().range([0, radius])

    const color = d3.scaleOrdinal(d3.schemeRdYlGn[10])

    const partition = d3.partition()

    const arc = d3.arc()
      .startAngle((d: any) => Math.max(0, Math.min(2 * Math.PI, x(d.x0))))
      .endAngle((d: any) => Math.max(0, Math.min(2 * Math.PI, x(d.x1))))
      .innerRadius((d: any) => Math.max(0, y(d.y0)))
      .outerRadius((d: any) => Math.max(0, y(d.y1)))


    const svg = d3.select(this.containerEl)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + (height / 2.18) + ")")

    const click = d => {
      svg.transition()
        .duration(750)
        .tween("scale", () => {
          const xd = d3.interpolate(x.domain(), [d.x0, d.x1])
          const yd = d3.interpolate(y.domain(), [d.y0, 1])
          const yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius])
          return (t: any) => { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)) }
        })
        .selectAll("path")
        .attrTween("d", (d2: any) => _ => arc(d2))
    }

    const root = d3.hierarchy(this.data[0])
    root.sum(d => d.size)
    const s = partition(root).descendants()
    svg.selectAll("path")
      .data(s)
      .enter().append("path")
      .attr("d", arc as any)
      .style("fill", (d: any) => color(d.data.name))
      .on("click", click)
      .on('mouseover', (d: any) => console.log(d.data.name))
      .append("title")
      .text((d: any) => d.data.name)

    d3.select(self.frameElement).style("height", height + "px")
  }
}
