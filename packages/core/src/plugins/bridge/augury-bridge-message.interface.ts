import { AuguryBridgeMessageType } from './augury-bridge-message-type.type';

export interface AuguryBridgeMessage<PayloadType> {
  type: AuguryBridgeMessageType;
  payload: PayloadType;
}
