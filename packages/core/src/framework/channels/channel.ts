import { SimpleEventEmitter } from '../utils'
import { ChannelDelegate } from './channel-delegate'

export abstract class Channel {
  public abstract type: string
  public abstract shutdown(): void
  public abstract events(): SimpleEventEmitter<any>

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
