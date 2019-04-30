import { TimelineDetailViewGraphBoundaries } from './timeline-detail-view-graph-boundaries.interface';
import { TimelineOverviewGraphBoundaries } from './timeline-overview-graph-boundaries.interface';

export interface TimelineGraphsBoundaries {
  overview: TimelineOverviewGraphBoundaries;
  detailView: TimelineDetailViewGraphBoundaries;
}
