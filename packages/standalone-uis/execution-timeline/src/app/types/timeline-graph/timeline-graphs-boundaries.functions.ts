import { getTimelineDetailViewGraphBoundaries } from './timeline-detail-view-graph-boundaries.functions';
import { TimelineGraphsBoundaries } from './timeline-graphs-boundaries.interface';
import { getTimelineOverviewGraphBoundaries } from './timeline-overview-graph-boundaries.functions';

const MinimumWidthToPaint = 100;

export function getTimelineGraphsBoundaries(
  timelineOverviewGraphElement: Element,
  timelineDetailViewGraphElement: Element,
): TimelineGraphsBoundaries {
  return {
    overview: getTimelineOverviewGraphBoundaries(timelineOverviewGraphElement),
    detailView: getTimelineDetailViewGraphBoundaries(timelineDetailViewGraphElement),
  };
}

export function canTimelineGraphsPaint(boundaries: TimelineGraphsBoundaries): boolean {
  return (
    boundaries.overview.width > MinimumWidthToPaint &&
    boundaries.detailView.width > MinimumWidthToPaint
  );
}
