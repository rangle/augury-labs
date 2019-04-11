import * as d3 from 'd3';
import { ScaleBand, ScaleLinear } from 'd3';

export function createD3LinearScale(
  domain: number[],
  range: number[],
): ScaleLinear<number, number> {
  return d3
    .scaleLinear()
    .domain(domain)
    .range(range as ReadonlyArray<number>);
}

export function createD3BandScale(domain: string[], range: [number, number]): ScaleBand<string> {
  return d3
    .scaleBand()
    .domain(domain as ReadonlyArray<string>)
    .range(range);
}

export function isD3ZoomByBrush() {
  return d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush';
}

export function updateD3RectangleData<ItemType>(
  rootSelection: any,
  items: ItemType[],
  updateRectangle: (selection) => any,
  onClick: (ItemType) => void = null,
) {
  const rectangles = rootSelection.selectAll('rect').data(items);

  let enterSelection = updateRectangle(rectangles.enter().append('rect'));

  if (onClick) {
    enterSelection = enterSelection.on('click', onClick);
  }

  updateRectangle(
    enterSelection
      .merge(rectangles)
      .transition()
      .duration(0),
  );

  rectangles.exit().remove();
}
