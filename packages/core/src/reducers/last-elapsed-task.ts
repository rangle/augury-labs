import { merge } from '../framework/utils'
import { AuguryEvent } from '../framework/events'
import { Reducer } from '../framework/reducers'

import { CurrentRootTaskReducer } from './current-root-task'
import { CurrentNgTaskReducer } from './current-ng-task'
import { CurrentCycleReducer } from './current-cycle-reducer' // @todo: rename - remove "reducer"

const INIT_STATE = undefined

// @todo: hack
let flamegraph: any[] = []

export class LastElapsedTaskReducer extends Reducer {

  dependencies = {
    currentRootTask: new CurrentRootTaskReducer(),
    currentNgTask: new CurrentNgTaskReducer()
  }

  deriveShallowState({ prevState = INIT_STATE, nextEvent, nextDepState, prevDepState }) {

    // @todo: generalize this logic ?
    const {
      currentRootTask: prevRootTask,
      currentNgTask: prevNgTask,
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

    // @todo: hack
    flamegraph = updateFlamegraph(flamegraph, nextEvent)

    // start new flamegraph every task
    // @todo: if methods invoked outside of task -> red flag! something is going undetected.
    if (!prevRootTask && nextRootTask)
      flamegraph = []

    if (prevRootTask && !nextRootTask)
      try {
        return {
          zone: 'root',
          task: prevRootTask.task,
          startEID: prevRootTask.startEID,
          startPerformanceStamp: prevRootTask.startTime,
          finishPerformanceStamp: nextEvent.creationAtPerformanceStamp,
          flamegraph
        }
      } finally {
        flamegraph = []
      }

    if (prevNgTask && !nextNgTask)
      try {
        return {
          zone: 'ng',
          task: prevNgTask.task,
          startEID: prevNgTask.startEID,
          startPerformanceStamp: prevNgTask.startTime,
          finishPerformanceStamp: nextEvent.creationAtPerformanceStamp,
          flamegraph
        }
      } finally {
        flamegraph = []
      }

    return prevState
  }
}

// @todo: get everything below out of here
const findHighestPending = pending => {
  const { children } = pending
  if (!children.length) return null
  const lastChild = children[children.length - 1]
  if (lastChild.reachedCompletion) return pending
  return findHighestPending(lastChild) || lastChild
}

function updateFlamegraph(prevFlameGraph: any[] = [], e /* augury event */) {
  // todo: mutating, shouldnt be
  // todo: clean up...
  if (e.name === 'method_invoked') {
    if (!prevFlameGraph.length || prevFlameGraph[prevFlameGraph.length - 1].reachedCompletion)
      prevFlameGraph.push({
        event: e,
        startPerfstamp: e.payload.perfstamp,
        moduleName: e.payload.module.name,
        name: `${e.payload.Class.name}.${e.payload.methodName}() [module: ${
          e.payload.module.name
          }]`,
        reachedCompletion: false,
        children: [],
      })
    else {
      let highestPending = findHighestPending(prevFlameGraph[prevFlameGraph.length - 1])
      if (!highestPending) highestPending = prevFlameGraph[prevFlameGraph.length - 1]
      highestPending.children.push({
        event: e,
        value: highestPending.value / 2,
        startPerfstamp: e.payload.perfstamp,
        moduleName: e.payload.module.name,
        name: `${e.payload.Class.name}.${e.payload.methodName}() [module: ${
          e.payload.module.name
          }]`,
        reachedCompletion: false,
        children: [],
      })
    }
  }

  if (e.name === 'method_completed') {
    if (!prevFlameGraph.length || prevFlameGraph[prevFlameGraph.length - 1].reachedCompletion)
      console.log('orphan:', e)
    else {
      let highestPending = findHighestPending(prevFlameGraph[prevFlameGraph.length - 1])
      if (!highestPending) highestPending = prevFlameGraph[prevFlameGraph.length - 1]
      highestPending.reachedCompletion = true
      highestPending.finishPerfstamp = e.payload.perfstamp
      const perfDiff = highestPending.finishPerfstamp - highestPending.startPerfstamp
      highestPending.value = perfDiff > 0 ? perfDiff : 0.0125
    }
  }

  return prevFlameGraph
}