import { BridgeMessage } from '@augury/core';
import { SegmentRowType } from './segment-row-type.type';
import { SegmentType } from './segment-type.type';

export interface Segment<PayloadType> {
  type: SegmentType;
  start: number;
  end: number;
  row: SegmentRowType;
  originalMessage?: BridgeMessage<PayloadType>;
}
