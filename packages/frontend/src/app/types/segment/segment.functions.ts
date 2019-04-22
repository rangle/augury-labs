import { BridgeMessage } from '@augury/core';
import { ChangeDetectionInfo, EventDragInfo, InstabilityPeriodInfo, TaskInfo } from '@augury/core';
import { Segment } from './segment.interface';

export function mapTimelineMessageToSegment(message: BridgeMessage<any>): Segment<any> {
  switch (message.type) {
    case 'task':
      const taskMessage = message as BridgeMessage<TaskInfo>;

      return {
        type: taskMessage.payload.zone === 'ng' ? 'child-zone-task' : 'root-zone-task',
        start: taskMessage.payload.startTimestamp,
        end: taskMessage.payload.endTimestamp,
        row: 'zone task',
        originalMessage: taskMessage,
      };
    case 'instability-period':
      const instabilityPeriodMessage = message as BridgeMessage<InstabilityPeriodInfo>;

      return {
        type: 'instability',
        start: instabilityPeriodMessage.payload.startTimestamp,
        end: instabilityPeriodMessage.payload.endTimestamp,
        row: 'angular instability',
        originalMessage: instabilityPeriodMessage,
      };
    case 'change-detection':
      const changeDetectionMessage = message as BridgeMessage<ChangeDetectionInfo>;

      return {
        type: 'change-detection',
        start: changeDetectionMessage.payload.startTimestamp,
        end: changeDetectionMessage.payload.endTimestamp,
        row: 'change detection',
        originalMessage: changeDetectionMessage,
      };
    case 'drag': {
      const dragMessage = message as BridgeMessage<EventDragInfo>;

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

export function getMinimumStartTimestamp(segments: Array<Segment<any>>) {
  return Math.min(...segments.map(segment => segment.start));
}

export function getMaximumEndTimestamp(segments: Array<Segment<any>>) {
  return Math.max(...segments.map(segment => segment.end));
}
