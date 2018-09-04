'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const scanner_1 = require('../framework/scanner')
const reducers_1 = require('../reducers')
exports.createLastElapsedCycleChannel = {
  name: 'create-last-elapsed-cycle-channel',
  react({ event, channels, dispatcherEvents }) {
    if (event.name === 'subscribe-to-last-elapsed-cycle') {
      const scanner = new scanner_1.Scanner(new reducers_1.LastElapsedCycleReducer())
      scanner.scan(dispatcherEvents)
      const channel = channels.createFromScanner(scanner)
      return {
        success: true,
        channel,
      }
    }
  },
}
//# sourceMappingURL=create-last-elapsed-cycle-channel.js.map
