import { ScaleBand, ScaleLinear } from 'd3-scale';

export interface TimelineGraphScales {
  xScale: ScaleLinear<number, number>;
  yScale: ScaleBand<string>;
}
