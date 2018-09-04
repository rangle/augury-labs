import { Reducer } from '../framework/reducers'
import { CurrentTaskReducer } from './current-task-reducer'
import { IsStableReducer } from './is-stable-reducer'
export declare class CurrentCycleReducer extends Reducer {
  dependencies: {
    isStable: IsStableReducer
    currentTask: CurrentTaskReducer
  }
  deriveShallowState({
    prevState,
    nextEvent,
    nextDepState,
    prevDepState,
  }: {
    prevState?: null | undefined
    nextEvent: any
    nextDepState: any
    prevDepState: any
  }): {
    startEID: any
    startPerformanceStamp: any
    job: any
  } | null
}
