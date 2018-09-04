import { Reducer } from '../framework/reducers'
export declare class CurrentRootZoneTaskReducer extends Reducer {
  deriveShallowState({
    prevShallowState,
    nextEvent,
  }: {
    prevShallowState?:
      | {
          result: undefined
        }
      | undefined
    nextEvent: any
  }):
    | {
        result: undefined
      }
    | {
        result: {
          task: any
          startEID: any
          startPerfStamp: any
        }
      }
}
