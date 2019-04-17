import { Injectable, NgZone } from '@angular/core';
import { BridgeConnection, BridgeMessage, BridgeRequest, Subscription } from '@augury/core';

// @todo: put bridgeService in service that runs inside ngzone
//        add to @augury/ui-tools

@Injectable()
export class BridgeService {
  private connection: BridgeConnection<BridgeMessage<any>, BridgeRequest>;

  constructor(private ngZone: NgZone) {
    this.connection = (window as any).bridgeConnection;
  }

  public subscribe(callback: (message: BridgeMessage<any>) => void): Subscription {
    return this.connection.listen(message => this.ngZone.run(() => callback(message)));
  }

  public send(request: BridgeRequest) {
    this.connection.send(request);
  }
}
