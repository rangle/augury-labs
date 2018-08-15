import { AuguryEvent } from '../framework/events'
import { Reducer, ShallowStateDerivationParams } from '../framework/reducers'

import { CurrentCycleReducer } from './current-cycle-reducer'

const INIT_STATE = null

export class LastElapsedCycleReducer extends Reducer {
  dependencies = {
    currentCycle: new CurrentCycleReducer(),
  }

  deriveShallowState(
    { prevState = INIT_STATE, nextEvent, nextDepState, prevDepState }: ShallowStateDerivationParams
  ) {
    const { currentCycle: nextCycle } = nextDepState
    const { currentCycle: prevCycle } = prevDepState

    if (prevCycle && !nextCycle)
      return {

        // @todo: this shouldnt be here.
        //        it means this reducer has to know at what point 
        //        component tree is a part of the event payload.
        componentTree: nextEvent.payload.componentTree,

        startEID: prevCycle.startEID,
        startPerformanceStamp: prevCycle.startPerformanceStamp,
        finishEID: nextEvent.id,
        finishPerformanceStamp: nextEvent.creationAtPerformanceStamp, // @todo: not considering / measuring our own impact here.
        job: prevCycle.job,
      }

    return prevState
  }
}
