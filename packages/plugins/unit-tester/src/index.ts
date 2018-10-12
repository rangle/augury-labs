import {
  LastElapsedCDReducer,
  LastElapsedCycleReducer,
  LastElapsedEventReducer,
  LastElapsedTaskReducer,
  Plugin,
  SingleCDRunFull,
} from '@augury/core'

declare const window

export class UnitTesterPlugin extends Plugin {
  // @todo: do we still need these "names" ?
  //        can we get rid of this? (we could use the class's .name)
  public name() {
    return 'UnitTester'
  }

  public onInit() {
    window.auguryUT = {}

    let cdChannel: any
    let cdRuns: any = []

    window.auguryUT.startMonitoringChangeDetection = () => {
      const result = this.api!.createLiveChannel({
        reducer: new LastElapsedCDReducer(),
      })

      cdChannel = result.channel

      cdChannel.events.subscribe(lastElapsedCD => {
        cdRuns.push(lastElapsedCD)
      })
    }

    window.auguryUT.finishMonitoringChangeDetection = () => {
      console.log(cdRuns)

      const result = {
        cdRuns: cdRuns.map(cdRun => ({
          // @todo: rename drag to auguryDrag
          runtime: cdRun.finishPerformanceStamp - cdRun.startPerformanceStamp - cdRun.drag,
        })),
      }

      cdChannel.kill()
      cdChannel = undefined
      cdRuns = []

      return result
    }
  }
}
