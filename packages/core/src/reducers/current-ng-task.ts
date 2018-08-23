import { AuguryEvent } from '../framework/events'
import { Reducer } from '../framework/reducers'

const INIT_STATE = undefined

// @todo: rename to CurrentNgZoneTaskReducer (ngZone everywhere, because this is public api, should be clear)
export class CurrentNgTaskReducer extends Reducer {

  deriveShallowState({ prevState = INIT_STATE, nextEvent }) {

    if (nextEvent.name === 'onInvokeTask_executing') {

      this.assumption('a `task` cannot begin until the previous one is complete', !prevState)

      return {
        task: nextEvent.payload.task,
        startEID: nextEvent.id,
        startTime: nextEvent.creationAtPerformanceStamp
      }

    }

    if (nextEvent.name === 'onInvokeTask_completed') return undefined

    return prevState
  }

}
