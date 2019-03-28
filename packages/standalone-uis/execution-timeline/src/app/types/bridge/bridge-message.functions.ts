import { Segment } from '../segment/segment.interface';
import { BridgeMessageType } from './bridge-message-type.type';
import { BridgeMessage } from './bridge-message.interface';

function messageMatchesType(message: BridgeMessage, types: BridgeMessageType[]) {
  return types.includes(message.type);
}

export function isTimelineMessage(message: BridgeMessage): boolean {
  return messageMatchesType(message, ['task', 'cycle', 'cd']);
}

export function isDragMessage(message: BridgeMessage): boolean {
  return messageMatchesType(message, ['drag']);
}

export function mapTimelineMessageToSegment(message: BridgeMessage): Segment {
  switch (message.type) {
    case 'task':
      return {
        originalMessage: message,
        start: message.lastElapsedTask.startPerformanceStamp,
        end: message.lastElapsedTask.finishPerformanceStamp,
        row: 'zone task',
        color: message.lastElapsedTask.zone === 'ng' ? '#95BCDA' : '#5A1EAE',
      };
    case 'cycle':
      return {
        originalMessage: message,
        start: message.lastElapsedCycle.startPerformanceStamp,
        end: message.lastElapsedCycle.finishPerformanceStamp,
        row: 'angular instability',
        color: '#D34627',
      };
    case 'cd':
      return {
        originalMessage: message,
        start: message.lastElapsedCD.startPerformanceStamp,
        end: message.lastElapsedCD.finishPerformanceStamp,
        row: 'change detection',
        color: '#9B9B9B',
      };
    case 'drag': {
      return {
        start: message.start,
        end: message.finish,
        row: '*',
        color: '',
      };
    }
  }
}
