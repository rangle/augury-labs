import { Subscription } from '../events/event-emitters';
import { BridgeConnection } from './bridge-connection.interface';
import { BridgeMessage } from './bridge-message.interface';

export class Bridge {
  constructor(private connection: BridgeConnection<BridgeMessage>) {}

  public send(message: BridgeMessage) {
    this.connection.send(message);
  }

  public listen(handleIncomingMessage: (message: BridgeMessage) => void): Subscription {
    return this.connection.listen(handleIncomingMessage);
  }
}
