import { Reducer } from '../framework/reducers'
import { CurrentRootZoneTaskReducer } from './current-root-zone-task'
import { CurrentNgZoneTaskReducer } from './current-ng-zone-task'
export declare class LastElapsedTaskReducer extends Reducer {
  dependencies: {
    currentRootTask: CurrentRootZoneTaskReducer
    currentNgTask: CurrentNgZoneTaskReducer
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
          auxiliary: {
            flamegraph: never[]
          }
        }
      | undefined
    nextEvent: any
    nextDepResults: any
    prevDepResults: any
  }):
    | {
        result: {
          zone: string
          task: any
          startEID: any
          startPerformanceStamp: any
          finishPerformanceStamp: any
          flamegraph: any[]
        }
        auxiliary: {
          flamegraph: never[]
        }
      }
    | {
        result: undefined
        auxiliary: {
          flamegraph: any[]
        }
      }
}
