import { EventEmitter, Subscription } from '../../events/event-emitters';
import { BridgeConnection } from '../bridge-connection.interface';
import { BridgeMessage } from '../bridge-message.interface';

export class SocketBridgeConnection implements BridgeConnection<BridgeMessage> {
  private socket: WebSocket;
  private messages = new EventEmitter<BridgeMessage>();

  constructor() {
    this.initialize();
  }

  public send(message: BridgeMessage) {
    this.socket.send(JSON.stringify(message));
  }

  public listen(handleIncomingMessage: (message: BridgeMessage) => void): Subscription {
    return this.messages.subscribe(handleIncomingMessage);
  }

  private initialize() {
    this.createSocket();
    this.hookSocket();
  }

  private createSocket() {
    const host = 'ws://localhost';
    const port = 8099;
    const url = port ? `${host}:${port}` : host;

    this.socket = new WebSocket(url);
  }

  private hookSocket() {
    this.socket.onopen = ev => {
      console.info('Remote Augury Connected');
    };

    this.socket.onclose = ev => {
      this.socket.close();
      console.info('Remote Augury Disconnected');
    };

    this.socket.onerror = ev => {
      console.error('Augury Socket Error', ev);
    };

    this.socket.onmessage = ev => {
      const message: BridgeMessage = JSON.parse(ev.data);
      this.messages.emit(message);
    };
  }
}
