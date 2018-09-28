import { LastElapsedCDReducer, LastElapsedTaskReducer, Plugin, SingleCDRunFull } from '@augury/core'

// @todo: this should be shared across popout plugins
import { LastElapsedCycleReducer } from '@augury/core'
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

    function recursivelyMergeChildNodes(childNodes1, childNodes2) {
      const instancesInNodes1 = new Set(childNodes1.map(node => node.componentInstance))
      const instancesInNodes2 = new Set(childNodes2.map(node => node.componentInstance))
      const commonNodes = childNodes1.filter(childNode =>
        instancesInNodes2.has(childNode.componentInstance),
      )
      const nonCommonNodes = childNodes1
        .concat(childNodes2)
        .filter(node => !commonNodes.find(n => n.componentInstance === node.componentInstance))
      return commonNodes
        .map(node =>
          Object.assign({}, node, {
            childNodes: recursivelyMergeChildNodes(
              node.childNodes.concat([]),
              childNodes2.find(n => n.componentInstance === node.componentInstance).childNodes,
            ),
          }),
        )
        .concat(nonCommonNodes)
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
      parentDoCheck,
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

    let lec
    cdChannel.events.subscribe(lastElapsedCD => {
      lec = lastElapsedCD
      popout.bridge.in.emit({ type: 'cd', lastElapsedCD })
    })

    cyclesChannel.events.subscribe(lastElapsedCycle =>
      popout.bridge.in.emit({ type: 'cycle', lastElapsedCycle }),
    )

    popout.bridge.out.subscribe(message => {
      console.log(message)
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
