import { BridgeMessageType } from './bridge-message-type.type';

export interface BridgeMessage<PayloadType> {
  type: BridgeMessageType;
  payload: PayloadType;
}
