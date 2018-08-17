import { Plugin, Reducer, CurrentNgTaskReducer, LastElapsedTaskReducer } from '../../../../core/dist'

// @todo: this should be shared across popout plugins
import { openPopout } from './popout'


class LastElapsedTask extends Reducer {

  dependencies = {
    'currentTask': new CurrentNgTaskReducer()
  }

  deriveShallowState({ prevState, prevDepState, nextDepState }) {
    const { currentTask: nextCurrentTask } = nextDepState
    const { currentTask: prevCurrentTask } = prevDepState

    if (!nextCurrentTask && prevCurrentTask)
      return prevCurrentTask

    return prevState
  }

}

// @todo: how to type the output of reducers? this should be an array of tasks
class LastNElapsedTasks extends Reducer {

  constructor(
    private n: number
  ) { super() }

  dependencies = {
    'lastElapsedTask': new LastElapsedTask()
  }

  deriveShallowState({ prevState, prevDepState, nextDepState }) {
    const { lastElapsedTask: nextLastElapsedTask } = nextDepState
    const { lastElapsedTask: prevLastElapsedTask } = prevDepState

    if (!prevState)
      return []

    if (nextLastElapsedTask !== prevLastElapsedTask)
      return [nextLastElapsedTask].concat(
        prevState.length >= this.n
          ? prevState.slice(0, -1)
          : prevState
      )

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
      reducer: new LastElapsedTaskReducer()
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
