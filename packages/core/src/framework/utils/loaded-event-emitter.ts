import { Handler, SimpleEventEmitter, Subscription } from './simple-event-emitter'

interface Subscriber<EventType> {
  handler: Handler<EventType>
}

// @todo: this is very differnt, and only fulfills the "subscribe()" api.
//        adjust SimpleEventEmitter to only require subscribe()
export class LoadedEventEmitter<EventType> /* implements SimpleEventEmitter<EventType> */ {
  private subscriber?: Subscriber<EventType>
  private queue: EventType[] = []
  private dead = false

  public subscribe(handler: Handler<EventType>): Subscription {
    if (this.subscriber) {
      throw new Error('Loaded event emitters only accept 1 subscriber')
    }

    this.subscriber = { handler }

    this.queue.forEach(handler)

    // todo: unsubscribe is useless, can never use it since all events already fired..
    return { unsubscribe: () => undefined }
  }

  public add(value: EventType) {
    this.queue.push(value)
  }
}
