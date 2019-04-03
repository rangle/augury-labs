import { SegmentRowType } from './segment-row-type.type';
import { SegmentType } from './segment-type.type';

export interface Segment {
  type: SegmentType;
  originalMessage?: any;
  start: number;
  end: number;
  row: SegmentRowType;
}
