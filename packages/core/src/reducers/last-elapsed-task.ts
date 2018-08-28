import { merge } from '../framework/utils'
import { AuguryEvent } from '../framework/events'
import { Reducer } from '../framework/reducers'

import { CurrentRootZoneTaskReducer } from './current-root-zone-task'
import { CurrentNgZoneTaskReducer } from './current-ng-zone-task'

const INIT_STATE = {
  result: undefined,
  auxiliary: {
    // @todo: should this be a flamegraph? 
    //        i think it should just be a list of invoked methods.
    //        the flamegraph structure should be imposed by the consumer
    flamegraph: []
  }
}

export class LastElapsedTaskReducer extends Reducer {

  dependencies = {
    currentRootTask: new CurrentRootZoneTaskReducer(),
    currentNgTask: new CurrentNgZoneTaskReducer()
  }

  deriveShallowState({ prevShallowState = INIT_STATE, nextEvent, nextDepResults, prevDepResults }) {

    // @todo: generalize this logic ?
    const {
      currentRootTask: prevRootTask,
      currentNgTask: prevNgTask,
    } = prevDepResults

    const {
      currentRootTask: {
        task: nextRootTask,
        startTime: nextRootStartTime
      } = {} as any,
      currentNgTask: {
        task: nextNgTask,
        startTime: nextNgStartTime
      } = {} as any,
    } = nextDepResults

    const rootTaskIsOngoing = () => prevRootTask && nextRootTask
    const ngTaskIsOngoing = () => prevNgTask && nextNgTask
    const taskIsOngoing = () => rootTaskIsOngoing() || ngTaskIsOngoing()

    this.assumption(
      'root tasks and ng tasks do not happen simoultaneously',
      !(prevNgTask && prevRootTask) && !(nextNgTask && nextRootTask)
    )

    let updatedFlamegraph = updateFlamegraph(prevShallowState.auxiliary.flamegraph, nextEvent)

    // start new flamegraph every task
    // @todo: if methods invoked outside of task -> red flag! something is going undetected.
    if (!prevRootTask && nextRootTask)
      updatedFlamegraph = []

    if (prevRootTask && !nextRootTask)
      return {
        result: {
          zone: 'root',
          task: prevRootTask.task,
          startEID: prevRootTask.startEID,
          startPerformanceStamp: prevRootTask.startPerfStamp,
          finishPerformanceStamp: nextEvent.creationAtPerformanceStamp,
          flamegraph: updatedFlamegraph
        },
        auxiliary: {
          flamegraph: []
        }
      }

    if (prevNgTask && !nextNgTask)
      return {
        result: {
          zone: 'ng',
          task: prevNgTask.task,
          startEID: prevNgTask.startEID,
          startPerformanceStamp: prevNgTask.startPerfStamp,
          finishPerformanceStamp: nextEvent.creationAtPerformanceStamp,
          flamegraph: updatedFlamegraph
        },
        auxiliary: {
          flamegraph: []
        }
      }

    return {
      result: prevShallowState.result,
      auxiliary: {
        flamegraph: updatedFlamegraph
      }
    }

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
        name: `${e.payload.Class.name}.${e.payload.methodName}() [module: ${e.payload.module.name}]`,
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

  return prevFlameGraph.concat([])
}