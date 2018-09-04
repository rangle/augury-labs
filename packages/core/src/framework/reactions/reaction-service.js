'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const utils_1 = require('../utils')
const events_1 = require('../events')
class ReactionService {
  constructor(probes, channels, registry) {
    this.probes = probes
    this.channels = channels
    this.registry = registry
  }
  reactTo(event, dispatcherEvents, dispatch) {
    const createSimpleDispatch = reactionName => (eventName, eventPayload) =>
      dispatch(
        events_1.createEvent({ type: 'reaction', name: reactionName }, eventName, eventPayload),
      )
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
        (mergedResults, next) =>
          next.result
            ? utils_1.merge(mergedResults, { [next.reactionName]: next.result })
            : mergedResults,
        {},
      )
  }
}
exports.ReactionService = ReactionService
//# sourceMappingURL=reaction-service.js.map
