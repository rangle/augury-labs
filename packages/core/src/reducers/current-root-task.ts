import { AuguryEvent } from '../framework/events'
import { Reducer } from '../framework/reducers'

const INIT_STATE = null

export class CurrentRootTaskReducer extends Reducer {

  deriveShallowState({ prevState = INIT_STATE, nextEvent }) {

    if (nextEvent.name === 'root_task_executing') {

      this.assumption('a `task` cannot begin until the previous one is complete', !prevState)

      return nextEvent.payload.task

    }

    if (nextEvent.name === 'root_task_completed') return null

    return prevState
  }

}
