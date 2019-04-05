import { AuguryBridgeMessage } from '@augury/core';
import {
  EventDragInfo,
  LastElapsedChangeDetection,
  LastElapsedCycle,
  LastElapsedTask,
} from '@augury/core';
import { Segment } from './segment.interface';

export function mapTimelineMessageToSegment(message: AuguryBridgeMessage<any>): Segment<any> {
  switch (message.type) {
    case 'task':
      const taskMessage = message as AuguryBridgeMessage<LastElapsedTask>;

      return {
        type: taskMessage.payload.zone === 'ng' ? 'child-zone-task' : 'root-zone-task',
        start: taskMessage.payload.startTimestamp,
        end: taskMessage.payload.endTimestamp,
        row: 'zone task',
        originalMessage: taskMessage,
      };
    case 'cycle':
      const cycleMessage = message as AuguryBridgeMessage<LastElapsedCycle>;

      return {
        type: 'instability',
        start: cycleMessage.payload.startTimestamp,
        end: cycleMessage.payload.endTimestamp,
        row: 'angular instability',
        originalMessage: cycleMessage,
      };
    case 'cd':
      const changeDetectionMessage = message as AuguryBridgeMessage<LastElapsedChangeDetection>;

      return {
        type: 'change-detection',
        start: changeDetectionMessage.payload.startTimestamp,
        end: changeDetectionMessage.payload.endTimestamp,
        row: 'change detection',
        originalMessage: changeDetectionMessage,
      };
    case 'drag': {
      const dragMessage = message as AuguryBridgeMessage<EventDragInfo>;

      return {
        type: 'drag',
        start: dragMessage.payload.startTimestamp,
        end: dragMessage.payload.endTimestamp,
        row: '*',
      };
    }
  }
}

export function getSegmentClasses(segment: Segment<any>, selectedSegment: Segment<any>) {
  const classes = ['segment', segment.type];

  if (segment === selectedSegment) {
    classes.push('selected');
  }

  return classes.join(' ');
}
