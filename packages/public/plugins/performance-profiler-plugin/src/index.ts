import { LastElapsedCDReducer, LastElapsedTaskReducer, Plugin } from '@augury/core'

// @todo: this should be shared across popout plugins
import { LastElapsedCycleReducer } from '@augury/core'
import { openPopout } from './popout'

/**
 * needs webpack.
 */
declare const require

// ui app code
// @todo: refactor, obviously
const htmlIndex = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Performance Profiler</title>
      <base href="/">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="icon" type="image/x-icon" href="favicon.ico">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    </head>
    <body>
      <app-root></app-root>
    </body>
  </html>
`

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

    popout.write(htmlIndex)
    popout.injectScript(require('!!raw-loader!@augury/performance-profiler-ui/dist/index.js'))

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
