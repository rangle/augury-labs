import { Channel } from './channel';

import { Scanner } from '../scanner';
import { SyncEventEmitter } from '../utils';

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
