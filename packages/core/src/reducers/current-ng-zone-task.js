'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const reducers_1 = require('../framework/reducers')
const INIT_STATE = {
  result: undefined,
}
// @todo: rename to CurrentNgZoneTaskReducer (because this is public api, should be clear)
class CurrentNgZoneTaskReducer extends reducers_1.Reducer {
  deriveShallowState({ prevShallowState = INIT_STATE, nextEvent }) {
    if (nextEvent.name === 'onInvokeTask_executing') {
      this.assumption(
        'a `task` cannot begin until the previous one is complete',
        !prevShallowState.result,
      )
      return {
        result: {
          task: nextEvent.payload.task,
          startEID: nextEvent.id,
          startPerfStamp: nextEvent.creationAtPerformanceStamp,
        },
      }
    }
    if (nextEvent.name === 'onInvokeTask_completed') return { result: undefined }
    return prevShallowState
  }
}
exports.CurrentNgZoneTaskReducer = CurrentNgZoneTaskReducer
//# sourceMappingURL=current-ng-zone-task.js.map
