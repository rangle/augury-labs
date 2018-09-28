import { Reaction } from '../framework/reactions'
import { Scanner } from '../framework/scanner'

export const scanHistory: Reaction = {
  name: 'scan-history',
  react({ event, history }) {
    if (event.name === 'request-history-scan') {
      const { reducer, startFromEID, untilEID } = event.payload

      if (!reducer) {
        return { success: false, errors: ['reducer not given'] }
      }

      const scanner = new Scanner(reducer)

      // @todo: SimpleEventEmitter.scan() should only require "subscribe()"
      //        so we dont need <any> here
      scanner.scan(history.emitter() as any)

      return {
        success: true,
        result: scanner.last(),
      }
    }
  },
}
