import { Injectable, NgZone } from '@angular/core'

declare const bridge: any

@Injectable()
export class BridgeService {

  constructor(
    private ngZone: NgZone
  ) { }

  subscribe(callback) {
    bridge.in.subscribe(message => this.ngZone.run(() => callback(message)))
  }

  send(message) {
    bridge.out.emit(message)
  }

}