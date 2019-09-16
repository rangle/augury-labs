import { Subscription } from '../events/event-emitters';
import { BridgeMessage } from './bridge-message.interface';

export interface BridgeConnection<Message = BridgeMessage> {
  initialize();
  send(message: Message);
  listen(handleIncomingMessage: (message: Message) => void): Subscription;
}
