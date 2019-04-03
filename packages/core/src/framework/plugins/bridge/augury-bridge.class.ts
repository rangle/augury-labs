import { SyncEventEmitter } from '../../event-emitters';
import { AuguryBridgeMessage } from './augury-bridge-message.interface';
import { AuguryBridgeRequest } from './augury-bridge-request.interface';

export class AuguryBridge {
  public in = new SyncEventEmitter<AuguryBridgeMessage>();
  public out = new SyncEventEmitter<AuguryBridgeRequest>();
}
