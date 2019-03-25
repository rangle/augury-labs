export interface Emittable<EventType> {
  emit(value: EventType): void;
}
