import { Subscription } from '../event-emitters';

export abstract class Channel<EventType> {
  protected constructor(public readonly type: string) {}

  public abstract subscribe(handleEvent: (event: EventType) => void): Subscription;
  public abstract shutdown(): void;
}
