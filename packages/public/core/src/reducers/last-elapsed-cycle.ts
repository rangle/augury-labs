import { Reducer } from '../framework/reducers'

import { CurrentCDReducer } from './current-cd'
import { CurrentCycleReducer } from './current-cycle'

const INIT_STATE = {
  result: undefined,
}

export class LastElapsedCycleReducer extends Reducer {
  public dependencies = {
    currentCycle: new CurrentCycleReducer(),
    currentCD: new CurrentCDReducer(),
  }

  public deriveShallowState({
    prevShallowState = INIT_STATE,
    nextEvent,
    nextDepResults,
    prevDepResults,
  }) {
    const { currentCycle: nextCycle, currentCD: nextCD } = nextDepResults

    const { currentCycle: prevCycle, currentCD: prevCD } = prevDepResults

    if (prevCycle && !nextCycle) {
      return {
        result: {
          // @todo: this shouldnt be here.
          //        it means this reducer has to know at what point
          //        component tree is a part of the event payload.
          componentTree: nextEvent.payload.componentTree,

          startEID: prevCycle.startEID,
          startPerformanceStamp: prevCycle.startPerformanceStamp,
          finishEID: nextEvent.id,
          finishPerformanceStamp: nextEvent.creationAtPerformanceStamp, // @todo: not considering / measuring our own impact here.
          job: prevCycle.job,
        },
      }
    }

    return prevShallowState
  }
}
