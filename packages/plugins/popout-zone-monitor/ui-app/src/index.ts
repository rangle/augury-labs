import { Plugin, Reducer, merge, LastElapsedCycleReducer } from '../../../../core'

import { createStylesheet } from './create-stylesheet'
import { TimelineUI } from './timeline-ui'

declare const bridge

const style = createStylesheet()

style.insertRule(`
  html { 
    height: 100%; 
    width: 100%; 
  }
`)

style.insertRule(`
  body { 
    height: 100%; 
    width: 100%; 
    margin: 0;
  }
`)

const timeline = new TimelineUI()

timeline.appendTo(document.body)

bridge.in.subscribe((lastElapsedTask) => {
  console.log(lastElapsedTask)
  timeline.addSegment(lastElapsedTask)
})