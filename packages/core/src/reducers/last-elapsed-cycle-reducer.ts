import { AuguryEvent } from '../framework/events'
import { Reducer, ShallowStateDerivationParams } from '../framework/reducers'

import { CurrentCycleReducer } from './current-cycle-reducer'
import { CurrentCDReducer } from './current-cd'

const INIT_STATE = null


export class LastElapsedCycleReducer extends Reducer {
  dependencies = {
    currentCycle: new CurrentCycleReducer(),
    currentCD: new CurrentCDReducer(),
  }

  deriveShallowState(
    { prevState = INIT_STATE, nextEvent, nextDepState, prevDepState }: ShallowStateDerivationParams
  ) {

    const {
      currentCycle: nextCycle,
      currentCD: nextCD
    } = nextDepState

    const {
      currentCycle: prevCycle,
      currentCD: prevCD
    } = prevDepState

    if (prevCycle && !nextCycle)
      // @todo: how to do this properly? (try/finally)
      return {

        // @todo: this shouldnt be here.
        //        it means this reducer has to know at what point 
        //        component tree is a part of the event payload.
        componentTree: nextEvent.payload.componentTree,

        startEID: prevCycle.startEID,
        startPerformanceStamp: prevCycle.startPerformanceStamp,
        finishEID: nextEvent.id,
        finishPerformanceStamp: nextEvent.creationAtPerformanceStamp, // @todo: not considering / measuring our own impact here.
        job: prevCycle.job
      }

    return prevState
  }
}
