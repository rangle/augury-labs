import { SimpleEventEmitter } from '../utils'

export interface ChannelDelegate {
  events: SimpleEventEmitter<any>
  kill: () => void
}