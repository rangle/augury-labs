'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const scanner_1 = require('../framework/scanner')
exports.createChannelFromReducer = {
  name: 'create-custom-channel-from-reducer',
  react({ event, channels, dispatcherEvents }) {
    if (event.name === 'request-custom-channel') {
      const { reducer, startFromEID, untilEID } = event.payload
      if (!reducer) return { success: false, errors: ['reducer not given'] }
      // @todo: currently not handling "start and until" because we dont have a history
      if (startFromEID || untilEID)
        return { success: false, errors: ['historical data not yet supported'] }
      const scanner = new scanner_1.Scanner(reducer)
      scanner.scan(dispatcherEvents)
      const channel = channels.createFromScanner(scanner)
      return {
        success: true,
        channel,
      }
    }
  },
}
//# sourceMappingURL=create-channel-from-reducer.js.map
