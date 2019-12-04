export interface Subscriber<EventType> {
  handleEvent: (event: EventType) => void;
}
