import * as d3 from 'd3';
import { ScaleBand, ScaleLinear } from 'd3';

export function deleteAllD3ChildElements(element: Element): void {
  d3.select(element)
    .selectAll('*')
    .remove();
}

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
