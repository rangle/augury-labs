import { BridgeConnection, BridgeMessage, BridgeRequest } from '../bridge';

export interface AuguryPluginWindow extends Window {
  bridgeConnection: BridgeConnection<BridgeMessage<any>, BridgeRequest>;
}
