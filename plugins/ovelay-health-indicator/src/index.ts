// @todo: switch to @augury/core
import { Plugin, Reducer, merge, LastElapsedCycleReducer } from '../../../core/dist'

import { CircleUI } from './circle-ui'
import { tooManyCycles } from './triggers'

function someTriggerFired(cyclesOverTime) {
  return (
    tooManyCycles(cyclesOverTime)
  )
}

export class HealthIndicatorOverlay extends Plugin {

  circle = new CircleUI()
  cyclesOverTime = new Map()

  onInit() {

    (window as any).circle = this.circle

    const { channel } = this.api!.subscribeToLastElapsedCycle()

    channel.events.subscribe(cycle => {

      this.cyclesOverTime.set(cycle.startPerformanceStamp, cycle.startEID)

      if (someTriggerFired(this.cyclesOverTime))
        this.circle.flash('red')
      else
        this.circle.flash('green')

    })

  }

}