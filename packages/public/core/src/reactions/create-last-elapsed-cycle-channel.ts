import { Reaction } from '../framework/reactions'
import { Scanner } from '../framework/scanner'
import { LastElapsedCycleReducer } from '../reducers'

export const createLastElapsedCycleChannel: Reaction = {
  name: 'create-last-elapsed-cycle-channel',
  react({ event, channels, dispatcherEvents }) {
    if (event.name === 'subscribe-to-last-elapsed-cycle') {
      const scanner = new Scanner(new LastElapsedCycleReducer())

      scanner.scan(dispatcherEvents)

      const channel = channels.createFromScanner(scanner)

      return {
        success: true,
        channel,
      }
    }
  },
}
