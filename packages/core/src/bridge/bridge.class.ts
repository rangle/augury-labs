import { EventEmitter } from '../events/event-emitters';
import { BridgeConnection } from './bridge-connection.class';
import { BridgeMessage } from './bridge-message.interface';
import { BridgeRequest } from './bridge-request.interface';

export class Bridge {
  public static getInstance(): Bridge {
    if (!Bridge.bridge) {
      Bridge.bridge = new Bridge();
    }

    return Bridge.bridge;
  }
  private static bridge: Bridge;

  private messagesEmitter = new EventEmitter<BridgeMessage<any>>();
  private requestsEmitter = new EventEmitter<BridgeRequest>();

  private constructor() {}

  public createProducerConnection(): BridgeConnection<BridgeRequest, BridgeMessage<any>> {
    return new BridgeConnection(this.requestsEmitter, this.messagesEmitter);
  }

  public createConsumerConnection(): BridgeConnection<BridgeMessage<any>, BridgeRequest> {
    return new BridgeConnection(this.messagesEmitter, this.requestsEmitter);
  }
}
