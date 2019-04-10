import { AuguryBridgeMessage } from '@augury/core';
import { Segment } from './segment.interface';

export function mapTimelineMessageToSegment(message: AuguryBridgeMessage): Segment {
  switch (message.type) {
    case 'task':
      return {
        type: message.lastElapsedTask.zone === 'ng' ? 'child-zone-task' : 'root-zone-task',
        originalMessage: message,
        start: message.lastElapsedTask.startTimestamp,
        end: message.lastElapsedTask.endTimestamp,
        row: 'zone task',
      };
    case 'cycle':
      return {
        type: 'instability',
        originalMessage: message,
        start: message.lastElapsedCycle.startTimestamp,
        end: message.lastElapsedCycle.endTimestamp,
        row: 'angular instability',
      };
    case 'cd':
      return {
        type: 'change-detection',
        originalMessage: message,
        start: message.lastElapsedCD.startTimestamp,
        end: message.lastElapsedCD.endTimestamp,
        row: 'change detection',
      };
    case 'drag': {
      return {
        type: 'drag',
        start: message.start,
        end: message.finish,
        row: '*',
      };
    }
  }
}

export function getSegmentClasses(segment: Segment, selectedSegment: Segment) {
  const classes = ['segment', segment.type];

  if (segment === selectedSegment) {
    classes.push('selected');
  }

  return classes.join(' ');
}

export function getMinimumStartTimestamp(segments: Segment[]) {
  return Math.min(...segments.map(segment => segment.start));
}

export function getMaximumEndTimestamp(segments: Segment[]) {
  return Math.max(...segments.map(segment => segment.end));
}

export function getUnpaintedSegments(segments: Segment[], lastSegmentIndex: number): Segment[] {
  return segments.filter((_, index) => index > lastSegmentIndex);
}
