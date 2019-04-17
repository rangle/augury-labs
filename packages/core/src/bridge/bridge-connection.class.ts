import { EventEmitter, Subscription } from '../events/event-emitters';

export class BridgeConnection<IncomingMessage, OutgoingMessage> {
  constructor(
    private incomingMessages: EventEmitter<IncomingMessage>,
    private outgoingMessages: EventEmitter<OutgoingMessage>,
  ) {}

  public send(request: OutgoingMessage) {
    this.outgoingMessages.emit(request);
  }

  public listen(handleIncomingMessage: (message: IncomingMessage) => void): Subscription {
    return this.incomingMessages.subscribe(handleIncomingMessage);
  }
}
