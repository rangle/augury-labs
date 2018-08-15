export type Handler<EventType> = (event: EventType) => void

export interface Subscription {
  unsubscribe: () => void
}

export interface SimpleEventEmitter<EventType> {
  subscribe(handler: Handler<EventType>): Subscription
  emit(value: EventType) 
}