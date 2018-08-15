import { merge } from '../utils'
import { AuguryEvent, createEvent } from '../events'
import { Dispatch, SimpleDispatch, DispatcherEvents } from '../dispatcher'
import { ProbeService } from '../probes'
import { ChannelService } from '../channels'
import { ReactionResults } from './reaction-results'
import { ReactionRegistry } from './reaction-registry'

export class ReactionService {
  
  constructor(
    private probes: ProbeService,
    private channels: ChannelService,
    private registry: ReactionRegistry
  ) { }

  reactTo(event: AuguryEvent, dispatcherEvents: DispatcherEvents, dispatch: Dispatch): ReactionResults {

    const createSimpleDispatch = 
      (reactionName: string): SimpleDispatch => 
        (eventName, eventPayload) =>
          dispatch(createEvent(
            { type: 'reaction', name: reactionName }, 
            eventName, 
            eventPayload
          ))

    return this.registry
      .map(reaction => ({
        reactionName: reaction.name,
        result: reaction.react({
          event, 
          dispatch: createSimpleDispatch(reaction.name), 
          dispatcherEvents,
          channels: this.channels, 
          probes: this.probes,
        })
      }))
      .reduce(
        (mergedResults: ReactionResults, next) => 
          next.result ? 
            merge(mergedResults, { [next.reactionName]: next.result })
          : mergedResults
      , {})

  }

}