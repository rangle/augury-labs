import { EventEmitter, Subscription } from '../../event-emitters';
import { AuguryBridgeMessage } from './augury-bridge-message.interface';
import { AuguryBridgeRequest } from './augury-bridge-request.interface';

export class AuguryBridge {
  public static getInstance() {
    if (!AuguryBridge.auguryBridge) {
      AuguryBridge.auguryBridge = new AuguryBridge();
    }

    return AuguryBridge.auguryBridge;
  }
  private static auguryBridge;

  private in = new EventEmitter<AuguryBridgeMessage>();
  private out = new EventEmitter<AuguryBridgeRequest>();

  private constructor() {}

  public sendMessage(message: AuguryBridgeMessage) {
    this.in.emit(message);
  }

  public sendRequest(message: AuguryBridgeRequest) {
    this.out.emit(message);
  }

  public listenToMessages(handleRequest: (message: AuguryBridgeMessage) => void): Subscription {
    return this.in.subscribe(handleRequest);
  }

  public listenToRequests(handleRequest: (request: AuguryBridgeRequest) => void): Subscription {
    return this.out.subscribe(handleRequest);
  }
}
