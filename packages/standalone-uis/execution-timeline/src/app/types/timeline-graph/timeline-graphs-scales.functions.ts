import { getTimelineGraphScales } from './timeline-graph-scales.functions';
import { TimelineGraphsBoundaries } from './timeline-graphs-boundaries.interface';
import { TimelineGraphsScales } from './timeline-graphs-scales.interface';

export function getTimelineGraphsScales(
  boundaries: TimelineGraphsBoundaries,
  minimumStartTimestamp,
  maximumEndTimestamp,
): TimelineGraphsScales {
  const xDomain = [0, maximumEndTimestamp - minimumStartTimestamp];

  return {
    overview: getTimelineGraphScales(
      xDomain,
      boundaries.overview.width,
      boundaries.overview.innerHeight,
    ),
    detailView: getTimelineGraphScales(
      xDomain,
      boundaries.detailView.width,
      boundaries.detailView.height,
    ),
  };
}
