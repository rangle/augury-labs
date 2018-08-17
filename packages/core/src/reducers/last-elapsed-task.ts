import { merge } from '../framework/utils'
import { AuguryEvent } from '../framework/events'
import { Reducer } from '../framework/reducers'

import { CurrentRootTaskReducer } from './current-root-task'
import { CurrentNgTaskReducer } from './current-ng-task'

const INIT_STATE = undefined

export class LastElapsedTaskReducer extends Reducer {

  dependencies = {
    currentRootTask: new CurrentRootTaskReducer(),
    currentNgTask: new CurrentNgTaskReducer()
  }

  deriveShallowState({ prevState = INIT_STATE, nextEvent, nextDepState, prevDepState }) {

    // @todo: generalize this logic
    const {
      currentRootTask: { task: prevRootTask, startTime: prevRootStartTime } = { task: null, startTime: null },
      currentNgTask: { task: prevNgTask, startTime: prevNgStartTime } = { task: null, startTime: null },
    } = prevDepState

    const {
      currentRootTask: { task: nextRootTask, startTime: nextRootStartTime } = { task: null, startTime: null },
      currentNgTask: { task: nextNgTask, startTime: nextNgStartTime } = { task: null, startTime: null },
    } = nextDepState

    this.assumption(
      'root tasks and ng tasks do not happen simoultaneously',
      (!prevNgTask || !prevRootTask) && (!nextNgTask || !nextRootTask)
    )

    if (prevRootTask && !nextRootTask)
      return {
        zone: 'root',
        task: prevRootTask,
        runningTime: nextEvent.creationAtPerformanceStamp - prevRootStartTime
      }

    if (prevNgTask && !nextNgTask)
      return {
        zone: 'ng',
        task: prevNgTask,
        runningTime: nextEvent.creationAtPerformanceStamp - prevNgStartTime
      }

    return prevState
  }
}