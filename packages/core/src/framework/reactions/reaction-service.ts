import { ChannelService } from '../channels'
import { Dispatch, DispatcherEvents, SimpleDispatch } from '../dispatcher'
import { AuguryEvent, createEvent } from '../events'
import { ProbeService } from '../probes'
import { ReactionRegistry } from './reaction-registry'
import { ReactionResults } from './reaction-results'

import { merge } from '../utils'

export class ReactionService {
  constructor(
    private probes: ProbeService,
    private channels: ChannelService,
    private registry: ReactionRegistry,
  ) {}

  public reactTo(
    event: AuguryEvent,
    dispatcherEvents: DispatcherEvents,
    dispatch: Dispatch,
  ): ReactionResults {
    const createSimpleDispatch = (reactionName: string): SimpleDispatch => (
      eventName,
      eventPayload,
    ) => dispatch(createEvent({ type: 'reaction', name: reactionName }, eventName, eventPayload))

    return this.registry
      .map(reaction => ({
        reactionName: reaction.name,
        result: reaction.react({
          event,
          dispatch: createSimpleDispatch(reaction.name),
          dispatcherEvents,
          channels: this.channels,
          probes: this.probes,
        }),
      }))
      .reduce(
        (mergedResults: ReactionResults, next) =>
          next.result ? merge(mergedResults, { [next.reactionName]: next.result }) : mergedResults,
        {},
      )
  }
}
