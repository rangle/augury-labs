import { Injectable, NgZone } from '@angular/core';

declare const bridge: any;

@Injectable()
export class BridgeService {
  constructor(private ngZone: NgZone) {}

  public subscribe(callback) {
    return bridge.in.subscribe(message => this.ngZone.run(() => callback(message)));
  }

  public send(message) {
    bridge.out.emit(message);
  }
}
