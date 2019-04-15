import { Subscription } from './subscription.interface';

export interface Subscribable<EventType> {
  subscribe(handler: (event: EventType) => void): Subscription | null;
}
