import { Reaction } from '../framework/reactions'
import { Scanner } from '../framework/scanner'

export const createChannelFromReducer: Reaction = {
  name: 'create-custom-channel-from-reducer',
  react({ event, channels, dispatcherEvents }) {
    if (event.name === 'request-custom-channel') {
      const { reducer, startFromEID, untilEID } = event.payload

      if (!reducer) {
        return { success: false, errors: ['reducer not given'] }
      }

      // @todo: currently not handling "start and until" because we dont have a history
      if (startFromEID || untilEID) {
        return { success: false, errors: ['historical data not yet supported'] }
      }

      const scanner = new Scanner(reducer)

      scanner.scan(dispatcherEvents)

      const channel = channels.createFromScanner(scanner)

      return {
        success: true,
        channel,
      }
    }
  },
}
