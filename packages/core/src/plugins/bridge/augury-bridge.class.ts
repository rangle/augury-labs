import { EventEmitter, Subscription } from '../../events/event-emitters';
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

  private in = new EventEmitter<AuguryBridgeMessage<any>>();
  private out = new EventEmitter<AuguryBridgeRequest>();

  private constructor() {}

  public sendMessage(message: AuguryBridgeMessage<any>) {
    this.in.emit(message);
  }

  public sendRequest(message: AuguryBridgeRequest) {
    this.out.emit(message);
  }

  public listenToMessages(
    handleMessage: (message: AuguryBridgeMessage<any>) => void,
  ): Subscription {
    return this.in.subscribe(handleMessage);
  }

  public listenToRequests(handleRequest: (request: AuguryBridgeRequest) => void): Subscription {
    return this.out.subscribe(handleRequest);
  }
}
