import { Injectable, NgZone } from '@angular/core';
import { AuguryWindow, Bridge, BridgeMessage, Subscription } from '@augury/core';

// @todo: put bridgeService in service that runs inside ngzone
//        add to @augury/ui-tools

@Injectable()
export class BridgeService {
  private bridge: Bridge;

  constructor(private ngZone: NgZone) {
    this.bridge = (window as AuguryWindow).auguryBridge;
  }

  public subscribe(callback: (message: BridgeMessage) => void): Subscription {
    return this.bridge.listen(message => this.ngZone.run(() => callback(message)));
  }

  public send(message: BridgeMessage) {
    this.bridge.send(message);
  }
}
