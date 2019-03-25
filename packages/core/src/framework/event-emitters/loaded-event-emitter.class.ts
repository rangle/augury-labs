import { Subscribable } from './subscribable.interface';
import { Subscriber } from './subscriber.interface';

export class LoadedEventEmitter<EventType> implements Subscribable<EventType> {
  private subscriber?: Subscriber<EventType>;
  private queue: EventType[];

  constructor(queueItems: EventType[] = []) {
    this.queue = queueItems.concat([]);
  }

  public subscribe(handler: (event: EventType) => void): null {
    if (this.subscriber) {
      throw new Error('Loaded event emitters only accept 1 subscriber');
    }

    this.subscriber = { handleEvent: handler };

    this.queue.forEach(handler);

    return null;
  }

  public add(value: EventType) {
    this.queue.push(value);
  }
}
