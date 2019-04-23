import { EventEmitter, Subscription } from '../../events/event-emitters';
import { BridgeConnection } from '../bridge-connection.interface';
import { BridgeMessage } from '../bridge-message.interface';

export class DirectBridgeConnection implements BridgeConnection<BridgeMessage> {
  constructor(public messages = new EventEmitter<BridgeMessage>()) {}

  public send(message: BridgeMessage) {
    this.messages.emit(message);
  }

  public listen(handleIncomingMessage: (message: BridgeMessage) => void): Subscription {
    return this.messages.subscribe(handleIncomingMessage);
  }
}
