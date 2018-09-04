import { AuguryEvent, EventSource, EventName, EventPayload } from './augury-event'
export declare function createEvent(
  source: EventSource,
  name: EventName,
  payload?: EventPayload,
): AuguryEvent
