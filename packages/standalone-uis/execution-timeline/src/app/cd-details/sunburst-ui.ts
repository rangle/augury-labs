import * as d3 from 'd3'

export class SunburstUI {

  private containerEl: SVGElement
  private data: any

  constructor(svgEl: SVGElement) {
    this.containerEl = svgEl
  }

  updateData(data: any) {
    this.data = data

    this.repaint()
  }

  repaint() {
    this.containerEl.innerHTML = ''
    this.paint()
  }

  private paint() {
    if (!this.data) throw new Error('no data provided')
    console.log(this.data)

    const _this = this

    var width = this.containerEl.clientWidth,
      height = this.containerEl.clientHeight,
      radius = (Math.min(width, height) / 2) - 10;

    var formatNumber = d3.format(",d");

    var x = d3.scaleLinear()
      .range([0, 2 * Math.PI]);

    var y = d3.scaleSqrt()
      .range([0, radius]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var partition = d3.partition();

    var arc = d3.arc()
      .startAngle(function (d: any) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
      .endAngle(function (d: any) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
      .innerRadius(function (d: any) { return Math.max(0, y(d.y0)); })
      .outerRadius(function (d: any) { return Math.max(0, y(d.y1)); });


    var svg = d3.select(this.containerEl)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + (height / 3) + ")");

    let root = d3.hierarchy(this.data[0]);
    root.sum(function (d) { return d.size; });
    const s = partition(root).descendants()
    svg.selectAll("path")
      .data(s)
      .enter().append("path")
      .attr("d", <any>arc)
      .style("fill", (d: any) => color(d.data.name))
      .on("click", click)
      .on('mouseover', (d: any) => console.log(d.data.name))
      .append("title")
      .text((d: any) => d.data.name)

    function click(d) {
      svg.transition()
        .duration(750)
        .tween("scale", function () {
          var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]),
            yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
          return function (t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
        })
        .selectAll("path")
        .attrTween("d", function (d: any) { return function () { return arc(d); }; });
    }

    d3.select(self.frameElement).style("height", height + "px");
  }
}
