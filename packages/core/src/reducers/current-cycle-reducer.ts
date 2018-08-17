import { AuguryEvent } from '../framework/events'
import { Reducer } from '../framework/reducers'

import { CurrentNgTaskReducer } from './current-ng-task'
import { IsStableReducer } from './is-stable-reducer'

const INIT_STATE = null

export class CurrentCycleReducer extends Reducer {
  dependencies = {
    isStable: new IsStableReducer(),
    currentTask: new CurrentNgTaskReducer(),
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
