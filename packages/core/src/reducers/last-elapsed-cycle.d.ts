import { Reducer } from '../framework/reducers'
import { CurrentCycleReducer } from './current-cycle'
import { CurrentCDReducer } from './current-cd'
export declare class LastElapsedCycleReducer extends Reducer {
  dependencies: {
    currentCycle: CurrentCycleReducer
    currentCD: CurrentCDReducer
  }
  deriveShallowState({
    prevShallowState,
    nextEvent,
    nextDepResults,
    prevDepResults,
  }: {
    prevShallowState?:
      | {
          result: undefined
        }
      | undefined
    nextEvent: any
    nextDepResults: any
    prevDepResults: any
  }):
    | {
        result: undefined
      }
    | {
        result: {
          componentTree: any
          startEID: any
          startPerformanceStamp: any
          finishEID: any
          finishPerformanceStamp: any
          job: any
        }
      }
}
