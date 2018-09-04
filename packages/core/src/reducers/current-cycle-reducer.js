'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const reducers_1 = require('../framework/reducers')
const current_task_reducer_1 = require('./current-task-reducer')
const is_stable_reducer_1 = require('./is-stable-reducer')
const INIT_STATE = null
class CurrentCycleReducer extends reducers_1.Reducer {
  constructor() {
    super(...arguments)
    this.dependencies = {
      isStable: new is_stable_reducer_1.IsStableReducer(),
      currentTask: new current_task_reducer_1.CurrentTaskReducer(),
    }
  }
  deriveShallowState({ prevState = INIT_STATE, nextEvent, nextDepState, prevDepState }) {
    const { isStable: nextIsStable, currentTask: nextTask } = nextDepState
    const { isStable: prevIsStable } = prevDepState
    // @definition: if we just became unstable, then we've entered a new cycle, thus started a new `job`
    if ((prevIsStable || prevIsStable === undefined) && !nextIsStable)
      return {
        startEID: nextEvent.id,
        startPerformanceStamp: nextEvent.creationAtPerformanceStamp,
        job: nextTask,
      }
    // @definition if we've just become stable, we're done the `job`
    if (!prevIsStable && nextIsStable) return null
    return prevState
  }
}
exports.CurrentCycleReducer = CurrentCycleReducer
//# sourceMappingURL=current-cycle-reducer.js.map
