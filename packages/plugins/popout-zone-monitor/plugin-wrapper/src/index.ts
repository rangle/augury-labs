import { Plugin, Reducer, CurrentNgTaskReducer, LastElapsedTaskReducer, CurrentCycleReducer, CurrentCDReducer } from '../../../../core/dist'

// @todo: this should be shared across popout plugins
import { openPopout } from './popout'

// @todo: figure out how to do this with reducers. (hack)
let taskCycle
let taskCDRuns: any[] = []

class LastElapsedTaskWithCycleReducer extends Reducer {

  dependencies = {
    currentLastTask: new LastElapsedTaskReducer(),
    currentCycle: new CurrentCycleReducer(),
    currentCD: new CurrentCDReducer()
  }

  deriveShallowState({ nextEvent, prevState, prevDepState, nextDepState }) {

    // @todo: generalize? (provide function?)
    const {
      currentLastTask: prevLastTask,
      currentCycle: prevCycle,
      currentCD: prevCD
    } = prevDepState

    const {
      currentLastTask: nextLastTask,
      currentCycle: nextCycle,
      currentCD: nextCD
    } = nextDepState

    this.assumption(
      'max 1 cycle within a single task',
      !nextCycle || !taskCycle || nextCycle === taskCycle
    )

    // @todo: figure out how to do this with reducers. (hack)
    taskCycle = taskCycle || nextCycle

    // @todo: figure out how to do this with reducers. (hack)
    if (!prevCD && nextCD)
      taskCDRuns.push(nextCD)

    // if (!prevCycle && nextCycle) debugger
    // if (nextEvent.id === 167) debugger

    if (prevLastTask !== nextLastTask) {
      try {
        return {
          task: nextLastTask,
          cycle: taskCycle,
          cdRuns: taskCDRuns
        }
        // @todo: figure out how to do this with reducers. (hack)
      } finally {
        taskCycle = undefined
        taskCDRuns = []
      }
    }

    return prevState
  }

}

/** 
 * needs webpack.
 */
declare const require

// ui app code
// @todo: refactor, obviously
const html_index = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Inventory App</title>
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


export class PopoutZoneMonitor extends Plugin {

  name() {
    return 'PopoutZoneMonitor';
  }

  onInit() {

    const { channel } = this.api!.createChannel({
      reducer: new LastElapsedTaskWithCycleReducer()
    })

      ; (window as any).channel = channel

    // @todo: need post-augury bootstrap hook, hence timeout
    const popout = openPopout('Augury Zone Monitor')

    popout.write(html_index)
    popout.injectScript(require('!!raw-loader!../../ui-app/dist/index.js'))

    channel.events.subscribe(lastElapsedRootTask =>
      popout.bridge.in.emit(lastElapsedRootTask)
    )

  }
}
