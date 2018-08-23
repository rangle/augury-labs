import * as tippy from 'tippy.js'
import * as d3 from 'd3'

import { createStylesheet } from './create-stylesheet'

// @todo: put in shared utils
function round2(num) {
  return Math.round(num * 100) / 100
}

const MINIMUM_SEGMENT_MS = 0.5

declare const inspect // browser api

let count = 0

export class TimelineUI {

  private id = `timeline-ui-${count++}`
  private element: HTMLElement = document.createElement('div')
  private parentElement?: HTMLElement
  private style = createStylesheet()

  private segments: any[] = []

  constructor() {
    this.element.id = this.id
    this.style.insertRule(`
      #${this.id} {
        width: 100%;
        height: 100%;
        overflow-x: scroll;
        overflow-y: hidden;
        background: blue;
        white-space:nowrap;
      }
    `)
    this.style.insertRule(`
      #${this.id} .zone-row {
        height: 20px;
        font-size: 1.1em;
        margin-left: 1px;
        margin-right: 1px;
      }
    `)
    this.style.insertRule(`
      #${this.id} .ng-zone {
        background: green;
      }
    `)
    this.style.insertRule(`
      #${this.id} .root-zone {
        background: yellow;
      }
    `)
    this.style.insertRule(`
      #${this.id} .undetected {
        background: red;
      }
    `)
    this.style.insertRule(`
      #${this.id} .cycle-row {
        height: 20px;
        font-size: 1.1em;
      }
    `)
    this.style.insertRule(`
      #${this.id} .cycle-row.fill {
        background: purple;
      }
    `)
    this.style.insertRule(`
      #${this.id} .segment {
        width: 100px;
        display: inline-block; 
      }
    `)
    this.style.insertRule(`
      #${this.id} .cd-row {
        height: 20px;
        text-align: right;
      }
    `)
    this.style.insertRule(`
      #${this.id} .cd-run {
        height: 20px;
        margin-left: 2px;
        margin-right: 2px;
        background: black;
        width: 3px;
        display: inline-block;
      }
    `)
  }

  appendTo(parentElement: HTMLElement) {
    parentElement.appendChild(this.element)
    this.parentElement = parentElement
  }

  detach() {
    if (!this.parentElement) return
    this.parentElement.removeChild(this.element)
  }

  addSegment(segmentData) {
    let autoScroll = (
      this.element.scrollWidth <=
      this.element.scrollLeft + this.element.offsetWidth + 20
    )

    const s = this.createSegment(segmentData)
    this.segments.push(s)
    this.element.appendChild(s.element)

    if (autoScroll)
      this.element.scrollLeft = 9999999999
  }

  createSegment({ task, cycle }) {

    const zoneRow = document.createElement('div')
    zoneRow.className = 'zone-row'

    // @todo: get actual data logic out of here, this should just be a UI tool
    if (task) {
      if (task.zone === 'root')
        zoneRow.className += ' root-zone'
      if (task.zone === 'ng')
        zoneRow.className += ' ng-zone'
      //zoneRow.innerHTML = task.runningTime > MINIMUM_SEGMENT_MS * 40 ? `${round2(task.runningTime)}` : ''
    } else {
      zoneRow.className += ' undetected'
      zoneRow.innerHTML = 'undetected'
    }

    const tipContent = document.createElement('div')
    tipContent.style.textAlign = 'left'
    tipContent.style.color = 'white'

    // @todo: get actual data logic out of here, this should just be a UI tool
    const taskCallbackFunc = document.createElement('span')
    taskCallbackFunc.style.cursor = 'pointer'
    taskCallbackFunc.style.textDecoration = 'underline'
    taskCallbackFunc.innerHTML = task.task.callback.name || 'anonymous function'
    taskCallbackFunc.onclick = () => {
      (window as any).augury_temp = task.task.callback
      console.log(task.task.callback)
    }

    tipContent.innerHTML = `
      <div>
        trigger: ${task.task.source}
      </div>
      ${
      task.task.callback
        ? `
          <div id="callback-section">
            callback: 
          </div>
        `
        : ``
      }
      <div>
        runningTime: ${round2(task.runningTime)}ms
      </div>
    `

    tipContent.querySelector('#callback-section')!.appendChild(taskCallbackFunc)

    tippy(zoneRow, { html: tipContent, interactive: true })

    // ---

    const cycleRow = document.createElement('div')
    cycleRow.className = 'cycle-row'

    if (cycle) {
      // cycleRow.innerHTML = cycle.startEID
      cycleRow.className += ' fill'
    }

    // ---

    // @todo: get actual data logic out of here, this should just be a UI tool
    const cdRow = document.createElement('div')
    cdRow.className = 'cd-row'

    if (cycle && !cycle.cdRuns.length) debugger
    if (cycle && cycle.cdRuns.length) {
      cycle.cdRuns.forEach(({ finishTime, startTime, startEID }) => {
        const runningTime = finishTime - startTime
        const widthPercentage = (runningTime / task.runningTime) * 100
        const cdRun = document.createElement('div')
        cdRun.className = 'cd-run'
        cdRun.style.width = `${widthPercentage}%`
        cdRow.appendChild(cdRun)
      })
    }

    // ---

    const element = document.createElement('div')
    element.className = 'segment'

    const WIDTH_TO_TIME_RATIO = 9


    element.style.width = task
      ? (task.runningTime > MINIMUM_SEGMENT_MS)
        ? `${round2(task.runningTime) * (MINIMUM_SEGMENT_MS * WIDTH_TO_TIME_RATIO)}px`
        : `${WIDTH_TO_TIME_RATIO}px`
      : '100px'

    element.appendChild(zoneRow)
    element.appendChild(cycleRow)
    element.appendChild(cdRow)

    // ---

    return {
      cycleRow,
      zoneRow,
      element
    }

  }

}