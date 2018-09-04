'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const reducers_1 = require('../framework/reducers')
const current_cycle_1 = require('./current-cycle')
const current_cd_1 = require('./current-cd')
const INIT_STATE = {
  result: undefined,
}
class LastElapsedCycleReducer extends reducers_1.Reducer {
  constructor() {
    super(...arguments)
    this.dependencies = {
      currentCycle: new current_cycle_1.CurrentCycleReducer(),
      currentCD: new current_cd_1.CurrentCDReducer(),
    }
  }
  deriveShallowState({ prevShallowState = INIT_STATE, nextEvent, nextDepResults, prevDepResults }) {
    const { currentCycle: nextCycle, currentCD: nextCD } = nextDepResults
    const { currentCycle: prevCycle, currentCD: prevCD } = prevDepResults
    if (prevCycle && !nextCycle)
      return {
        result: {
          // @todo: this shouldnt be here.
          //        it means this reducer has to know at what point
          //        component tree is a part of the event payload.
          componentTree: nextEvent.payload.componentTree,
          startEID: prevCycle.startEID,
          startPerformanceStamp: prevCycle.startPerformanceStamp,
          finishEID: nextEvent.id,
          finishPerformanceStamp: nextEvent.creationAtPerformanceStamp,
          job: prevCycle.job,
        },
      }
    return prevShallowState
  }
}
exports.LastElapsedCycleReducer = LastElapsedCycleReducer
//# sourceMappingURL=last-elapsed-cycle.js.map
