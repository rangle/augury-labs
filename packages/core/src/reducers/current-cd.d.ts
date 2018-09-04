import { Reducer } from '../framework/reducers'
export declare class CurrentCDReducer extends Reducer {
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
          startEID: any
          startTime: any
        }
      }
}
