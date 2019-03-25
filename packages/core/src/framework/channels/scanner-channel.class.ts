import { Channel } from './channel.class';

import { SyncEventEmitter } from '../event-emitters';
import { Scanner } from '../scanner';

export class ScannerChannel extends Channel {
  public type = 'scanner';

  constructor(private scanner: Scanner) {
    super();
  }

  public shutdown() {
    this.scanner.stop();
  }

  public events(): SyncEventEmitter<any> {
    return this.scanner.emitter;
  }
}
