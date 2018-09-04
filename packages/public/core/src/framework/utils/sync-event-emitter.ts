import { SimpleEventEmitter, Handler, Subscription } from './simple-event-emitter'

interface Subscriber<EventType> {
  handler: Handler<EventType>
}

export class SyncEventEmitter<EventType> implements SimpleEventEmitter<EventType> {
  private subscribers = new Set<Subscriber<EventType>>()

  subscribe(handler: Handler<EventType>): Subscription {
    const subscriber: Subscriber<EventType> = { handler }
    const unsubscribe = () => this.subscribers.delete(subscriber)
    this.subscribers.add(subscriber)
    return { unsubscribe }
  }

  emit(value: EventType) {
    this.subscribers.forEach(subscriber => subscriber.handler(value))
  }
}
