import { AuguryEvent } from '../framework/events'
import { Reducer } from '../framework/reducers'

import { CurrentNgZoneTaskReducer } from './current-ng-zone-task'
import { IsStableReducer } from './is-stable'

const INIT_STATE = {
  result: undefined
}

export class CurrentCycleReducer extends Reducer {

  dependencies = {
    isStable: new IsStableReducer(),
    currentTask: new CurrentNgZoneTaskReducer(),
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
        }
      }

    // @definition if we've just become stable, we're done the `job`
    if (!prevIsStable && nextIsStable)
      return { result: undefined }

    return prevShallowState
  }
}
