import { Scanner } from '../scanner'
import { ChannelDelegate } from './channel-delegate'
export declare class ChannelService {
  private channels
  private releaseDeadChannel
  createFromScanner(scanner: Scanner): ChannelDelegate
}
