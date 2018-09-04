import { Reducer } from '../framework/reducers'
export declare class IsStableReducer extends Reducer {
  deriveShallowState({
    prevState,
    nextEvent,
  }: {
    prevState?: boolean | undefined
    nextEvent: any
  }): boolean
}
