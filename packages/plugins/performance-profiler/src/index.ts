import {
  LastElapsedCDReducer,
  LastElapsedCycleReducer,
  LastElapsedEventReducer,
  LastElapsedTaskReducer,
  Plugin,
  SingleCDRunFull,
} from '@augury/core'

import { openPopout } from './popout'

/**
 * needs webpack.
 */
declare const require

export class PerformanceProfilerPlugin extends Plugin {
  public cycles: any = {}
  public queuedTasks: any[] = []

  public name() {
    return 'PopoutZoneMonitor'
  }

  public onInit() {
    const { channel: tasksChannel } = this.api!.createLiveChannel({
      reducer: new LastElapsedTaskReducer(),
    })

    const { channel: cyclesChannel } = this.api!.createLiveChannel({
      reducer: new LastElapsedCycleReducer(),
    })

    const { channel: cdChannel } = this.api!.createLiveChannel({
      reducer: new LastElapsedCDReducer(),
    })

    const { channel: dragChannel } = this.api!.createLiveChannel({
      reducer: new LastElapsedEventReducer(),
    })

    const popout = openPopout('Augury Zone Monitor')

    popout.write(require('!!raw-loader!@augury/execution-timeline-ui/dist/index.html'))
    popout.injectScript(require('!!raw-loader!@augury/execution-timeline-ui/dist/polyfills.js'))
    popout.injectScript(require('!!raw-loader!@augury/execution-timeline-ui/dist/main.js'))

    // @todo: these util functions should be somewhere in core\
    //        add standard traversal methods to generic trees?
    function rawTreeToComponentInstanceTree(tree = [] as any, parentComponentInstance?) {
      return tree.reduce((newTree, node) => {
        if (parentComponentInstance && node.componentInstance === parentComponentInstance) {
          return newTree.concat(
            rawTreeToComponentInstanceTree(node.childNodes, parentComponentInstance),
          )
        } else {
          return newTree.concat([
            {
              componentInstance: node.componentInstance,
              childNodes: rawTreeToComponentInstanceTree(node.childNodes, node.componentInstance),
            },
          ])
        }
      }, [])
    }

    ;(window as any).r = rawTreeToComponentInstanceTree

    // misc utils
    function merge(...objs) {
      return Object.assign({}, ...objs)
    }

    // set utils
    function intersection(a, b) {
      return new Set([...a].filter(x => b.has(x)))
    }

    function union(a, b) {
      return new Set([...a, ...b])
    }

    function minus(a, b) {
      return new Set([...a].filter(x => !b.has(x)))
    }

    function recursivelyMergeChildNodes(beforeChildNodes, afterChildNodes, inheritedChange?) {
      const instancesBefore = new Map(beforeChildNodes.map(node => [node.componentInstance, node]))
      const instancesAfter = new Map(afterChildNodes.map(node => [node.componentInstance, node]))

      const commonInstances = new Map([
        ...intersection(new Set(instancesBefore.keys()), new Set(instancesAfter.keys())),
      ].map(ins => [
        ins,
        { before: instancesBefore.get(ins), after: instancesAfter.get(ins) },
      ]) as any)

      const addedInstances = new Map([
        ...minus(new Set(instancesAfter.keys()), new Set(instancesBefore.keys())),
      ].map(ins => [ins, instancesAfter.get(ins)]) as any)

      const removedInstances = new Map([
        ...minus(new Set(instancesBefore.keys()), new Set(instancesAfter.keys())),
      ].map(ins => [ins, instancesBefore.get(ins)]) as any)

      const commonNodes = ([...commonInstances.entries()] as any).map(
        ([instance, { before, after }]) =>
          merge(after, {
            change: inheritedChange || 'none',
            childNodes: recursivelyMergeChildNodes(before.childNodes, after.childNodes),
          }),
      )

      const addedNodes = ([...addedInstances.entries()] as any).map(([instance, node]) =>
        merge(node, {
          change: 'added',
          childNodes: recursivelyMergeChildNodes([], node.childNodes, 'added'),
        }),
      )

      const removedNodes = ([...removedInstances.entries()] as any).map(([instance, node]) =>
        merge(node, {
          change: 'removed',
          childNodes: recursivelyMergeChildNodes(node.childNodes, [], 'removed'),
        }),
      )

      return commonNodes.concat(addedNodes).concat(removedNodes)
    }

    function mergeComponentTrees(tree1 = [] as any[], tree2 = [] as any[]) {
      return recursivelyMergeChildNodes(tree1, tree2)
    }

    function groupLifecycleHooksByInstance(hookEvents) {
      const entries = new Map()
      hookEvents.forEach(hookEvent => {
        const { creationAtPerformanceStamp, auguryDrag } = hookEvent
        const { hook, componentInstance } = hookEvent.payload

        if (!entries.has(componentInstance)) {
          entries.set(componentInstance, {})
        }

        const entry = entries.get(componentInstance)

        entry[hook] = creationAtPerformanceStamp
      })
      return entries
    }

    function recursivelyDeriveCheckTimeForComponentSubTree(
      lifecycleHooksByInstance,
      componentSubTree,
      parentDoCheck = 0,
      checkTimePerInstance,
    ) {
      let lastSiblingDoCheck
      let totalForSiblings = 0
      componentSubTree.forEach(node => {
        const nodeLifecycleHooks = lifecycleHooksByInstance.get(node.componentInstance)

        // this is a node that appeared but was removed again before onStable
        //   this can happen when there are multiple cd runs in 1 instability period
        if (!nodeLifecycleHooks) {
          return
        }

        const nodeDoCheck = nodeLifecycleHooks.ngDoCheck

        const childrenCheckTime = recursivelyDeriveCheckTimeForComponentSubTree(
          lifecycleHooksByInstance,
          node.childNodes,
          nodeDoCheck,
          checkTimePerInstance,
        )

        const bindingsCheckTime =
          (lastSiblingDoCheck || parentDoCheck) > 0
            ? nodeDoCheck - (lastSiblingDoCheck || parentDoCheck)
            : 0

        const nodeCheckTime =
          childrenCheckTime + bindingsCheckTime > 0 ? childrenCheckTime + bindingsCheckTime : 0

        checkTimePerInstance.set(node.componentInstance, nodeCheckTime)

        lastSiblingDoCheck = nodeDoCheck
        totalForSiblings += nodeCheckTime
      })
      return totalForSiblings
    }

    function deriveCheckTimePerInstance(lifecycleHooksByInstance, mergedComponentTree) {
      const checkTimePerInstance = new Map()

      recursivelyDeriveCheckTimeForComponentSubTree(
        lifecycleHooksByInstance,
        mergedComponentTree,
        0,
        checkTimePerInstance,
      )
      return checkTimePerInstance
    }

    tasksChannel.events.subscribe(lastElapsedTask =>
      popout.bridge.in.emit({ type: 'task', lastElapsedTask }),
    )

    cdChannel.events.subscribe(lastElapsedCD =>
      popout.bridge.in.emit({ type: 'cd', lastElapsedCD }),
    )

    cyclesChannel.events.subscribe(lastElapsedCycle =>
      popout.bridge.in.emit({ type: 'cycle', lastElapsedCycle }),
    )

    dragChannel.events.subscribe(lastElapsedEvent =>
      popout.bridge.in.emit({
        type: 'drag',
        start: lastElapsedEvent.creationAtPerformanceStamp,
        finish: lastElapsedEvent.auguryHandlingCompletionPerformanceStamp,
      }),
    )

    popout.bridge.out.subscribe(message => {
      if (message.type === 'get_full_cd') {
        const returnVal = this.api!.scanHistory({
          reducer: new SingleCDRunFull(message.cdStartEID, message.cdEndEID),
        })

        const { result: rawCdRunData } = returnVal

        const lastComponentTree = rawTreeToComponentInstanceTree(rawCdRunData.lastComponentTree)
        const nextComponentTree = rawTreeToComponentInstanceTree(rawCdRunData.nextComponentTree)
        const lifecycleHooksByInstance = groupLifecycleHooksByInstance(
          rawCdRunData.lifecycleHooksTriggered,
        )

        const mergedComponentTree = mergeComponentTrees(lastComponentTree, nextComponentTree)
        const checkTimePerInstance = deriveCheckTimePerInstance(
          lifecycleHooksByInstance,
          mergedComponentTree,
        )

        popout.bridge.in.emit({
          type: 'get_full_cd:response',
          data: {
            lastComponentTree,
            nextComponentTree,
            mergedComponentTree,
            lifecycleHooksByInstance,
            checkTimePerInstance,
          },
        })
      }
    })
  }
}
