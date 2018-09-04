'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const reducers_1 = require('../framework/reducers')
const current_ng_zone_task_1 = require('./current-ng-zone-task')
const is_stable_1 = require('./is-stable')
const INIT_STATE = {
  result: undefined,
}
class CurrentCycleReducer extends reducers_1.Reducer {
  constructor() {
    super(...arguments)
    this.dependencies = {
      isStable: new is_stable_1.IsStableReducer(),
      currentTask: new current_ng_zone_task_1.CurrentNgZoneTaskReducer(),
    }
  }
  deriveShallowState({ prevShallowState = INIT_STATE, nextEvent, nextDepResults, prevDepResults }) {
    const { isStable: nextIsStable, currentTask: nextTask } = nextDepResults
    const { isStable: prevIsStable } = prevDepResults
    // @definition: if we just became unstable, then we've entered a new cycle, thus started a new `job`
    if ((prevIsStable || prevIsStable === undefined) && !nextIsStable)
      return {
        result: {
          startEID: nextEvent.id,
          startPerformanceStamp: nextEvent.creationAtPerformanceStamp,
          job: nextTask,
        },
      }
    // @definition if we've just become stable, we're done the `job`
    if (!prevIsStable && nextIsStable) return { result: undefined }
    return prevShallowState
  }
}
exports.CurrentCycleReducer = CurrentCycleReducer
//# sourceMappingURL=current-cycle.js.map
