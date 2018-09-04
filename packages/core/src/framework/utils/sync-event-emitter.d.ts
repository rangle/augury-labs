import { SimpleEventEmitter, Handler, Subscription } from './simple-event-emitter'
export declare class SyncEventEmitter<EventType> implements SimpleEventEmitter<EventType> {
  private subscribers
  subscribe(handler: Handler<EventType>): Subscription
  emit(value: EventType): void
}
