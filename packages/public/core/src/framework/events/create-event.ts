import { AuguryEvent, EventSource, EventName, EventPayload } from './augury-event'

let nextId = 0

// @todo: types: type enum + payload type
export function createEvent(
  source: EventSource,
  name: EventName,
  payload?: EventPayload,
): AuguryEvent {
  return {
    name,
    source,
    id: nextId++,
    payload: payload || {},
    creationAtPerformanceStamp: performance.now(),
  }
}
