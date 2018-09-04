import * as d3 from 'd3'
import timelines from './timeline-lib'

export function paintTimeline({ data, container, onHover = (segment, row) => null, onClick = (segment, row) => null }) {

  const chart = timelines()
    .tickFormat({
      format: date => date.getTime(),
      tickTime: d3.timeMilliseconds,
      tickInterval: 5,
      tickSize: 5,
    })
    .stack()
    .margin({ left: 70, right: 30, top: 0, bottom: 0 })
    .hover((d, i, datum) => onHover(d, datum))
    .click((d, i, datum) => onClick(d, datum))
    .width(window.innerWidth * 0.9)

  container.innerHTML = ''

    ; (window as any).chart = d3.select(container)
      .append("svg")
      .attr("style", "width:90%;margin-left:5%;margin-right:5%;")
      .datum(data)
      .call(chart)

}

