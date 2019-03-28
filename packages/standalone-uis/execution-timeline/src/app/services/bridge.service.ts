import { Injectable, NgZone } from '@angular/core';
import { BridgeMessage } from '../types/bridge/bridge-message.interface';
import { BridgeRequest } from '../types/bridge/bridge-request.interface';

declare const bridge: any;

@Injectable()
export class BridgeService {
  constructor(private ngZone: NgZone) {}

  public subscribe(callback: (message: BridgeMessage) => void) {
    return bridge.in.subscribe(message => this.ngZone.run(() => callback(message)));
  }

  public send(request: BridgeRequest) {
    bridge.out.emit(request);
  }
}
