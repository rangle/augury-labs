'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const utils_1 = require('../utils')
const utils_2 = require('../utils')
class EventDispatcher {
  constructor(enhancers, reactions) {
    this.enhancers = enhancers
    this.reactions = reactions
    this.emitter = new utils_2.SyncEventEmitter()
    this.queue = new utils_2.SimpleQueue()
    this.releasing = false
  }
  dispatch(event) {
    this.queue.enqueue(event)
    if (!this.releasing) this.releaseAll()
  }
  dispatchImmediatelyAndReturn(event) {
    if (this.releasing) throw new Error('cannot dispatch immediately, already releasing')
    const processedEvent = this.processEvent(event)
    this.releaseAll()
    return processedEvent
  }
  subscribeTo(emitter) {
    emitter.subscribe(event => this.dispatch(event))
  }
  processEvent(event) {
    this.releasing = true
    const enhancedEvent = this.enhancers.enhanceEvent(event)
    const reactionResults = this.reactions.reactTo(event, this.emitter, e => this.dispatch(e))
    const processedEvent = utils_1.merge(enhancedEvent, { reactionResults })
    this.emitter.emit(processedEvent)
    this.releasing = false
    return processedEvent
  }
  releaseAll() {
    while (this.queue.hasItems()) this.processEvent(this.queue.dequeue())
  }
}
exports.EventDispatcher = EventDispatcher
//# sourceMappingURL=event-dispatcher.js.map
