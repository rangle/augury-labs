'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const channel_1 = require('./channel')
class ScannerChannel extends channel_1.Channel {
  constructor(scanner) {
    super()
    this.scanner = scanner
    this.type = 'scanner'
  }
  shutdown() {
    this.scanner.stop()
  }
  events() {
    return this.scanner.emitter
  }
}
exports.ScannerChannel = ScannerChannel
//# sourceMappingURL=scanner-channel.js.map
