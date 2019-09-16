import { Injectable, NgZone } from '@angular/core';
import { AuguryWindow, Bridge, BridgeMessage, Subscription } from '@augury/core';

// @todo: put bridgeService in service that runs inside ngzone
//        add to @augury/ui-tools

@Injectable()
export class BridgeService {
  private bridge: Bridge;
  private subscription: Subscription;

  constructor(private zone: NgZone) {
    this.bridge = (window as AuguryWindow).auguryBridge;

    this.zone.runOutsideAngular(() => {
      console.log('ran outside');
      this.bridge.initialize();
      this.subscription = this.bridge.listen(message => this.zone.run(() => callback(message)));
    });
  }

  public subscribe(callback: (message: BridgeMessage) => void): Subscription {
    return this.subscription;
  }

  public send(message: BridgeMessage) {
    this.bridge.send(message);
  }
}
