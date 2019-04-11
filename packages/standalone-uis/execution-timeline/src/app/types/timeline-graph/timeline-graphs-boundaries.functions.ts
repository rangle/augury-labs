import { getTimelineDetailViewGraphBoundaries } from './timeline-detail-view-graph-boundaries.functions';
import { TimelineGraphsBoundaries } from './timeline-graphs-boundaries.interface';
import { getTimelineOverviewGraphBoundaries } from './timeline-overview-graph-boundaries.functions';

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
  return boundaries.overview.width > 0 && boundaries.detailView.width > 0;
}
