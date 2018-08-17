import { merge } from '../framework/utils'
import { AuguryEvent } from '../framework/events'
import { Reducer } from '../framework/reducers'

import { CurrentRootTaskReducer } from './current-root-task'
import { CurrentNgTaskReducer } from './current-ng-task'

const INIT_STATE = null

export class LastElapsedTaskReducer extends Reducer {

  dependencies = {
    currentRootTask: new CurrentRootTaskReducer(),
    currentNgTask: new CurrentNgTaskReducer()
  }

  deriveShallowState({ prevState = INIT_STATE, nextEvent, nextDepState, prevDepState }) {

    const {
      currentRootTask: prevRootTask,
      currentNgTask: prevNgTask
    } = prevDepState

    const {
      currentRootTask: nextRootTask,
      currentNgTask: nextNgTask
    } = nextDepState

    this.assumption(
      'root tasks and ng tasks do not happen simoultaneously',
      (!prevNgTask || !prevRootTask) && (!nextNgTask || !nextRootTask)
    )

    if (prevRootTask && !nextRootTask)
      return {
        zone: 'root',
        task: prevRootTask
      }

    if (prevNgTask && !nextNgTask)
      return {
        zone: 'ng',
        task: prevNgTask
      }

    return prevState
  }
}
