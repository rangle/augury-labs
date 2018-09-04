import { AuguryEvent } from '../framework/events'
import { Reducer } from '../framework/reducers'

const INIT_STATE = { result: true }

export class IsStableReducer extends Reducer {
  deriveShallowState({ prevShallowState = INIT_STATE, nextEvent }) {
    // @todo: event enum
    if (nextEvent.name === 'onUnstable') return { result: false }

    if (nextEvent.name === 'onStable') return { result: true }

    return prevShallowState
  }
}
