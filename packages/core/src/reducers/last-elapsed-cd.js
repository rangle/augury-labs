'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const reducers_1 = require('../framework/reducers')
const current_cd_1 = require('./current-cd')
const INIT_STATE = {
  result: undefined,
  auxiliary: {
    componentsChecked: [],
  },
}
class LastElapsedCDReducer extends reducers_1.Reducer {
  constructor() {
    super(...arguments)
    this.dependencies = {
      currentCD: new current_cd_1.CurrentCDReducer(),
    }
  }
  deriveShallowState({ prevShallowState = INIT_STATE, nextEvent, nextDepResults, prevDepResults }) {
    // @todo: generalize this logic ?
    const { currentCD: prevCD } = prevDepResults
    const { currentCD: nextCD } = nextDepResults
    const updatedComponentsChecked = prevShallowState.auxiliary.componentsChecked.concat([]) // copy, so we dont mutate original
    if (
      nextCD &&
      nextEvent.name === 'component_lifecycle_hook_invoked' &&
      nextEvent.payload.hook === 'ngDoCheck'
    ) {
      updatedComponentsChecked.push(nextEvent.payload.componentInstance)
    }
    if (prevCD && !nextCD)
      return {
        result: {
          startEID: prevCD.startEID,
          startPerformanceStamp: prevCD.startTime,
          finishPerformanceStamp: nextEvent.creationAtPerformanceStamp,
          componentsChecked: updatedComponentsChecked,
        },
        auxiliary: {
          componentsChecked: [],
        },
      }
    return {
      result: prevShallowState.result,
      auxiliary: {
        componentsChecked: updatedComponentsChecked,
      },
    }
  }
}
exports.LastElapsedCDReducer = LastElapsedCDReducer
//# sourceMappingURL=last-elapsed-cd.js.map
