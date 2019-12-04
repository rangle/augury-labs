import { BridgeMessageType } from './bridge-message-type.type';

export interface BridgeMessage<PayloadType = any> {
  type: BridgeMessageType;
  payload: PayloadType;
}
