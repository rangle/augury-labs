import { SyncEventEmitter } from '../utils'
import { Scanner } from '../scanner'
import { Channel } from './channel'

export class ScannerChannel extends Channel {
  type = 'scanner'

  constructor(private scanner: Scanner) {
    super()
  }

  shutdown() {
    this.scanner.stop()
  }

  events() {
    return this.scanner.emitter
  }
}
