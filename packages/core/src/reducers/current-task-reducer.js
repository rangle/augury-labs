'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const reducers_1 = require('../framework/reducers')
const INIT_STATE = null
class CurrentTaskReducer extends reducers_1.Reducer {
  deriveShallowState({ prevState = INIT_STATE, nextEvent }) {
    if (nextEvent.name === 'onInvokeTask_executing') {
      this.assumption('a `task` cannot begin until the previous one is complete', !prevState)
      return nextEvent.payload.task
    }
    if (nextEvent.name === 'onInvokeTask_completed') return null
    return prevState
  }
}
exports.CurrentTaskReducer = CurrentTaskReducer
//# sourceMappingURL=current-task-reducer.js.map
