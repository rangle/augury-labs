import { SimpleEventEmitter } from '../utils'
import { ChannelDelegate } from './channel-delegate'

export abstract class Channel {
  abstract type: string
  abstract shutdown(): void
  abstract events(): SimpleEventEmitter<any>

  public createDelegate(didShutdown: (channel: this) => void): ChannelDelegate {
    return {
      events: this.events(),
      kill: () => {
        this.shutdown()
        didShutdown(this)
      },
    }
  }
}
