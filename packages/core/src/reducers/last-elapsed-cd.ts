import { merge } from '../framework/utils'
import { AuguryEvent } from '../framework/events'
import { Reducer } from '../framework/reducers'

import { CurrentRootTaskReducer } from './current-root-task'
import { CurrentNgTaskReducer } from './current-ng-task'
import { CurrentCDReducer } from './current-cd' // @todo: rename - remove "reducer"

const INIT_STATE = undefined

// @todo: fix reducers to do this properly. this is a bad hack (shared across instances)
let componentsChecked: any[] = []

export class LastElapsedCDReducer extends Reducer {

  dependencies = {
    currentCD: new CurrentCDReducer()
  }

  deriveShallowState({ prevState = INIT_STATE, nextEvent, nextDepState, prevDepState }) {

    // @todo: generalize this logic ?
    const {
      currentCD: prevCD
    } = prevDepState

    const {
      currentCD: nextCD
    } = nextDepState

    // @todo: fix reducers to do this properly.
    if (nextCD && nextEvent.name === 'component_lifecycle_hook_invoked' && nextEvent.payload.hook === 'ngDoCheck') {
      componentsChecked.push(nextEvent.payload.componentInstance)
    }

    if (prevCD && !nextCD)
      try {
        return {
          startEID: prevCD.startEID,
          startPerformanceStamp: prevCD.startTime,
          finishPerformanceStamp: nextEvent.creationAtPerformanceStamp,
          componentsChecked
        }
      } finally {
        componentsChecked = []
      }

    return prevState
  }
}