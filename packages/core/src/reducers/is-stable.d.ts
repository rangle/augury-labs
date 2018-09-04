import { Reducer } from '../framework/reducers'
export declare class IsStableReducer extends Reducer {
  deriveShallowState({
    prevShallowState,
    nextEvent,
  }: {
    prevShallowState?:
      | {
          result: boolean
        }
      | undefined
    nextEvent: any
  }): {
    result: boolean
  }
}
