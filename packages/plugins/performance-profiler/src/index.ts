import { LastElapsedCDReducer, LastElapsedTaskReducer, Plugin } from '@augury/core'

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
    const { channel: tasksChannel } = this.api!.createChannel({
      reducer: new LastElapsedTaskReducer(),
    })

    const { channel: cyclesChannel } = this.api!.createChannel({
      reducer: new LastElapsedCycleReducer(),
    })

    const { channel: cdChannel } = this.api!.createChannel({
      reducer: new LastElapsedCDReducer(),
    })

    const popout = openPopout('Augury Zone Monitor')

    popout.write(require('!!raw-loader!@augury/execution-timeline-ui/dist/index.html'))
    popout.injectScript(require('!!raw-loader!@augury/execution-timeline-ui/dist/polyfills.js'))
    popout.injectScript(require('!!raw-loader!@augury/execution-timeline-ui/dist/main.js'))

    tasksChannel.events.subscribe(lastElapsedTask => {
      popout.bridge.in.emit({
        type: 'task',
        lastElapsedTask,
      })
    })

    cdChannel.events.subscribe(lastElapsedCD => {
      popout.bridge.in.emit({
        type: 'cd',
        lastElapsedCD,
      })
    })

    cyclesChannel.events.subscribe(lastElapsedCycle => {
      popout.bridge.in.emit({
        type: 'cycle',
        lastElapsedCycle,
      })
    })
  }
}
