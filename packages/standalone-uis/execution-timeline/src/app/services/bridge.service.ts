import { Injectable, NgZone } from '@angular/core';
import { AuguryBridge, AuguryBridgeMessage, AuguryBridgeRequest } from '@augury/core';

declare const bridge: AuguryBridge;

// @todo: put bridgeService in service that runs inside ngzone
//        add to @augury/ui-tools

@Injectable()
export class BridgeService {
  constructor(private ngZone: NgZone) {}

  public subscribe(callback: (message: AuguryBridgeMessage) => void) {
    return bridge.listenToMessages(message => this.ngZone.run(() => callback(message)));
  }

  public send(request: AuguryBridgeRequest) {
    bridge.sendRequest(request);
  }
}
