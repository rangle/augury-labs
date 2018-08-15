import { AuguryEvent } from '../framework/events'
import { Reducer } from '../framework/reducers'

const INIT_STATE = true

export class IsStableReducer extends Reducer {

  deriveShallowState({ prevState = INIT_STATE, nextEvent }) {

    // @todo: event enum
    if (nextEvent.name === 'onUnstable') return false

    if (nextEvent.name === 'onStable') return true

    return prevState
  }

}
