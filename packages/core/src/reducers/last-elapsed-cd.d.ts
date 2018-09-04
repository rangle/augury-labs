import { Reducer } from '../framework/reducers'
import { CurrentCDReducer } from './current-cd'
export declare class LastElapsedCDReducer extends Reducer {
  dependencies: {
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
          auxiliary: {
            componentsChecked: never[]
          }
        }
      | undefined
    nextEvent: any
    nextDepResults: any
    prevDepResults: any
  }):
    | {
        result: {
          startEID: any
          startPerformanceStamp: any
          finishPerformanceStamp: any
          componentsChecked: any[]
        }
        auxiliary: {
          componentsChecked: never[]
        }
      }
    | {
        result: undefined
        auxiliary: {
          componentsChecked: any[]
        }
      }
}
