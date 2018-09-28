import { Reducer } from '../framework/reducers'

import { AccumulatedAuguryDragReducer } from './accumulated-augury-drag'
import { CurrentCDReducer } from './current-cd'

const initState = () => ({
  result: undefined,
  auxiliary: {
    componentsChecked: [],
  },
})

export class LastElapsedCDReducer extends Reducer {
  public dependencies = {
    currentCD: new CurrentCDReducer(),
    accumulatedAuguryDrag: new AccumulatedAuguryDragReducer(),
  }

  public deriveShallowState({
    prevShallowState = initState(),
    nextEvent,
    nextDepResults,
    prevDepResults,
    resetDependency,
  }) {
    // @todo: generalize this logic ?
    const { currentCD: prevCD } = prevDepResults

    const { currentCD: nextCD, accumulatedAuguryDrag: drag } = nextDepResults

    const updatedComponentsChecked: any[] = prevShallowState.auxiliary.componentsChecked.concat([]) // copy, so we dont mutate original

    if (!prevCD && nextCD) {
      resetDependency('accumulatedAuguryDrag')
    }

    if (
      nextCD &&
      nextEvent.name === 'component_lifecycle_hook_invoked' &&
      nextEvent.payload.hook === 'ngDoCheck'
    ) {
      updatedComponentsChecked.push(nextEvent.payload.componentInstance)
    }

    if (prevCD && !nextCD) {
      return {
        result: {
          startEID: prevCD.startEID,
          endEID: nextEvent.id,
          startPerformanceStamp: prevCD.startTime,
          finishPerformanceStamp: nextEvent.creationAtPerformanceStamp,
          componentsChecked: updatedComponentsChecked,
          drag,
        },
        auxiliary: initState().auxiliary,
      }
    }

    return {
      result: prevShallowState.result,
      auxiliary: {
        componentsChecked: updatedComponentsChecked,
      },
    }
  }
}
