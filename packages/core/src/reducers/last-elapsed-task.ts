import { merge } from '../framework/utils'
import { AuguryEvent } from '../framework/events'
import { Reducer } from '../framework/reducers'

import { CurrentRootTaskReducer } from './current-root-task'
import { CurrentNgTaskReducer } from './current-ng-task'
import { CurrentCycleReducer } from './current-cycle-reducer' // @todo: rename - remove "reducer"

const INIT_STATE = undefined

export class LastElapsedTaskReducer extends Reducer {

  dependencies = {
    currentRootTask: new CurrentRootTaskReducer(),
    currentNgTask: new CurrentNgTaskReducer()
  }

  deriveShallowState({ prevState = INIT_STATE, nextEvent, nextDepState, prevDepState }) {

    // @todo: generalize this logic ?
    const {
      currentRootTask: {
        task: prevRootTask,
        startTime: prevRootStartTime
      } = {} as any,
      currentNgTask: {
        task: prevNgTask,
        startTime: prevNgStartTime
      } = {} as any,
    } = prevDepState

    const {
      currentRootTask: {
        task: nextRootTask,
        startTime: nextRootStartTime
      } = {} as any,
      currentNgTask: {
        task: nextNgTask,
        startTime: nextNgStartTime
      } = {} as any,
    } = nextDepState

    const rootTaskIsOngoing = () => prevRootTask && nextRootTask
    const ngTaskIsOngoing = () => prevNgTask && nextNgTask
    const taskIsOngoing = () => rootTaskIsOngoing() || ngTaskIsOngoing()

    this.assumption(
      'root tasks and ng tasks do not happen simoultaneously',
      !(prevNgTask && prevRootTask) && !(nextNgTask && nextRootTask)
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