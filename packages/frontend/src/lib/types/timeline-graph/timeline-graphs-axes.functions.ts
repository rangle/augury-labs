import * as d3 from 'd3';
import { TimelineGraphsAxes } from './timeline-graphs-axes.interface';
import { TimelineGraphsScales } from './timeline-graphs-scales.interface';

const TickSize = 10;

export function getTimelineGraphsAxes(scales: TimelineGraphsScales): TimelineGraphsAxes {
  return {
    overview: {
      xAxis: d3.axisBottom(scales.overview.xScale).tickFormat((d: number) => `${d} ms`),
    },
    detailView: {
      xAxis: d3
        .axisBottom(scales.detailView.xScale)
        .tickSize(TickSize)
        .tickFormat((d: number) => `${d} ms`),
    },
  } as TimelineGraphsAxes;
}
