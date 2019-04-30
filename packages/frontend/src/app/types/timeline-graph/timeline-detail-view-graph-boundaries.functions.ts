import { TimelineDetailViewGraphBoundaries } from './timeline-detail-view-graph-boundaries.interface';

const Margins = {
  bottom: 20,
};

export function getTimelineDetailViewGraphBoundaries(
  element: Element,
): TimelineDetailViewGraphBoundaries {
  return {
    height: element.clientHeight - Margins.bottom,
    width: element.clientWidth,
  };
}
