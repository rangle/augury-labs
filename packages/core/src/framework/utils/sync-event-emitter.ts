import { Handler, SimpleEventEmitter, Subscription } from './simple-event-emitter';

interface Subscriber<EventType> {
  handler: Handler<EventType>;
}

export class SyncEventEmitter<EventType> implements SimpleEventEmitter<EventType> {
  private subscribers = new Set<Subscriber<EventType>>();

  public subscribe(handler: Handler<EventType>): Subscription {
    const subscriber: Subscriber<EventType> = { handler };

    this.subscribers.add(subscriber);

    return {
      unsubscribe: () => this.subscribers.delete(subscriber),
    };
  }

  public emit(value: EventType) {
    this.subscribers.forEach(subscriber => subscriber.handler(value));
  }
}
