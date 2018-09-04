import { Reducer } from '../framework/reducers'
import { CurrentNgZoneTaskReducer } from './current-ng-zone-task'
import { IsStableReducer } from './is-stable'
export declare class CurrentCycleReducer extends Reducer {
  dependencies: {
    isStable: IsStableReducer
    currentTask: CurrentNgZoneTaskReducer
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
          startEID: any
          startPerformanceStamp: any
          job: any
        }
      }
}
