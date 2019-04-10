const Margins = {
  top: 20,
  bottom: 50,
};

function getTimelineOverviewOuterHeight(timelineOverviewGraphElement: Element): number {
  return timelineOverviewGraphElement.clientHeight;
}

function getTimelineOverviewInnerHeight(timelineOverviewGraphElement: Element): number {
  return (
    getTimelineOverviewOuterHeight(timelineOverviewGraphElement) - Margins.bottom - Margins.top
  );
}

export function getTimelineOverviewGraphBoundaries(
  element: Element,
): TimelineOverviewGraphBoundaries {
  return {
    height: getTimelineOverviewOuterHeight(element),
    innerHeight: getTimelineOverviewInnerHeight(element),
    width: element.clientWidth,
  };
}
