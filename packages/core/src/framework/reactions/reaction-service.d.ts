import { AuguryEvent } from '../events'
import { Dispatch, DispatcherEvents } from '../dispatcher'
import { ProbeService } from '../probes'
import { ChannelService } from '../channels'
import { ReactionResults } from './reaction-results'
import { ReactionRegistry } from './reaction-registry'
export declare class ReactionService {
  private probes
  private channels
  private registry
  constructor(probes: ProbeService, channels: ChannelService, registry: ReactionRegistry)
  reactTo(
    event: AuguryEvent,
    dispatcherEvents: DispatcherEvents,
    dispatch: Dispatch,
  ): ReactionResults
}
