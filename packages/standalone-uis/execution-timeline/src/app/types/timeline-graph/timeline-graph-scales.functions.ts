import { createD3BandScale, createD3LinearScale } from '../../util/d3-utils.functions';
import { TimelineGraphRowTypes } from './timeline-graph-row-types.constant';
import { TimelineGraphScales } from './timeline-graph-scales.interface';

export function getTimelineGraphScales(xDomain, width, height): TimelineGraphScales {
  return {
    xScale: createD3LinearScale(xDomain, [0, width]),
    yScale: createD3BandScale(TimelineGraphRowTypes, [0, height]),
  };
}
