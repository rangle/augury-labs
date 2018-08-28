import { merge } from '../framework/utils'
import { AuguryEvent } from '../framework/events'
import { Reducer } from '../framework/reducers'

import { CurrentCDReducer } from './current-cd'

const INIT_STATE = {
  result: undefined,
  auxiliary: {
    componentsChecked: []
  }
}

export class LastElapsedCDReducer extends Reducer {

  dependencies = {
    currentCD: new CurrentCDReducer()
  }

  deriveShallowState({ prevShallowState = INIT_STATE, nextEvent, nextDepResults, prevDepResults }) {

    // @todo: generalize this logic ?
    const {
      currentCD: prevCD
    } = prevDepResults

    const {
      currentCD: nextCD
    } = nextDepResults

    const updatedComponentsChecked: any[]
      = prevShallowState.auxiliary.componentsChecked.concat([]) // copy, so we dont mutate original

    if (nextCD && nextEvent.name === 'component_lifecycle_hook_invoked' && nextEvent.payload.hook === 'ngDoCheck') {
      updatedComponentsChecked.push(nextEvent.payload.componentInstance)
    }

    if (prevCD && !nextCD)
      return {
        result: {
          startEID: prevCD.startEID,
          startPerformanceStamp: prevCD.startTime,
          finishPerformanceStamp: nextEvent.creationAtPerformanceStamp,
          componentsChecked: updatedComponentsChecked
        },
        auxiliary: {
          componentsChecked: []
        }
      }

    return {
      result: prevShallowState.result,
      auxiliary: {
        componentsChecked: updatedComponentsChecked
      }
    }
  }
}