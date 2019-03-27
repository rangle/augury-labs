import { Emittable } from './simple-event-emitter.interface';
import { Subscribable } from './subscribable.interface';
import { Subscriber } from './subscriber.interface';
import { Subscription } from './subscription.interface';

export class SyncEventEmitter<EventType> implements Emittable<EventType>, Subscribable<EventType> {
  private subscribers = new Set<Subscriber<EventType>>();

  public subscribe(handleEvent: (event: EventType) => void): Subscription {
    const subscriber: Subscriber<EventType> = { handleEvent };

    this.subscribers.add(subscriber);

    return {
      unsubscribe: () => this.subscribers.delete(subscriber),
    };
  }

  public emit(event: EventType) {
    this.subscribers.forEach(subscriber => subscriber.handleEvent(event));
  }
}
