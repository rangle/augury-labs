'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
let nextId = 0
// @todo: types: type enum + payload type
function createEvent(source, name, payload) {
  return {
    name,
    source,
    id: nextId++,
    payload: payload || {},
    creationAtPerformanceStamp: performance.now(),
  }
}
exports.createEvent = createEvent
//# sourceMappingURL=create-event.js.map
