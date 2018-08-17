import { valuesEqual } from '../utils'
import { Reducer } from './reducer'

export function mergeReducers(reducers: { [key: string]: Reducer }): Reducer {
  return new (class MergedReducer extends Reducer {
    dependencies = reducers
    deriveShallowState({ prevState, nextDepState, prevDepState }) {

      if (!valuesEqual(nextDepState, prevDepState))
        return nextDepState

      return prevState

    }
  })
}