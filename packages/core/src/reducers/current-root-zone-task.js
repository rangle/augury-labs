'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const reducers_1 = require('../framework/reducers')
const INIT_STATE = {
  result: undefined,
}
// @todo: merge rootzone task and ngzone task reducers (pass zone name in constructor args)
class CurrentRootZoneTaskReducer extends reducers_1.Reducer {
  deriveShallowState({ prevShallowState = INIT_STATE, nextEvent }) {
    if (nextEvent.name === 'root_task_executing') {
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
    if (nextEvent.name === 'root_task_completed') return { result: undefined }
    return prevShallowState
  }
}
exports.CurrentRootZoneTaskReducer = CurrentRootZoneTaskReducer
//# sourceMappingURL=current-root-zone-task.js.map
