'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
class SimpleQueue {
  constructor() {
    this.items = []
  }
  hasItems() {
    return Boolean(this.items.length)
  }
  enqueue(item) {
    this.items.unshift(item)
  }
  dequeue() {
    if (!this.hasItems()) return
    return this.items.pop()
  }
}
exports.SimpleQueue = SimpleQueue
//# sourceMappingURL=simple-queue.js.map
