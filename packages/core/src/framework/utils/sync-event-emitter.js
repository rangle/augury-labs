'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
class SyncEventEmitter {
  constructor() {
    this.subscribers = new Set()
  }
  subscribe(handler) {
    const subscriber = { handler }
    const unsubscribe = () => this.subscribers.delete(subscriber)
    this.subscribers.add(subscriber)
    return { unsubscribe }
  }
  emit(value) {
    this.subscribers.forEach(subscriber => subscriber.handler(value))
  }
}
exports.SyncEventEmitter = SyncEventEmitter
//# sourceMappingURL=sync-event-emitter.js.map
