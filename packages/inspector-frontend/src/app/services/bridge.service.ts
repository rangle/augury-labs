import { Injectable, NgZone } from '@angular/core';
import { AuguryWindow, Bridge, BridgeMessage, Subscription } from '@augury/core';

declare const window;

@Injectable({
  providedIn: 'root',
})
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
