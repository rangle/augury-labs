import { createStylesheet } from './create-stylesheet'

// @todo: put in shared utils
function round2(num) {
  return Math.round(num * 100) / 100
}

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
      }
    `)
    this.style.insertRule(`
      #${this.id} .root-zone {
        background: red;
      }
    `)
    this.style.insertRule(`
      #${this.id} .ng-zone {
        background: green;
      }
    `)
    this.style.insertRule(`
      #${this.id} .segment {
        margin-left: 5px;
        margin-right: 5px;
        width: 100px;
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
    let autoScroll = this.element.scrollWidth <= this.element.scrollLeft + this.element.offsetWidth + 20
    const s = this.createSegment(segmentData)
    this.segments.push(s)
    this.element.appendChild(s.element)
    if (autoScroll)
      this.element.scrollLeft = 9999999999
  }

  createSegment(segmentData) {

    const runningTimeTotalRow = document.createElement('div')
    runningTimeTotalRow.className = 'running-time-total-row'
    runningTimeTotalRow.innerHTML = round2(segmentData.runningTime) + ''

    const zoneRow = document.createElement('div')
    zoneRow.className = 'zone-row'

    if (segmentData.zone === 'root')
      zoneRow.className += ' root-zone'

    if (segmentData.zone === 'ng')
      zoneRow.className += ' ng-zone'

    const element = document.createElement('div')
    element.className = 'segment'
    element.style.width = (segmentData.runningTime > 3) ?
      `${round2(segmentData.runningTime) * 10}px`
      : '30px'

    element.appendChild(runningTimeTotalRow)
    element.appendChild(zoneRow)

    return {
      runningTimeTotalRow,
      zoneRow,
      element
    }

  }

}