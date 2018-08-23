
export type CircleColor = 'red' | 'green'

const FADE_TRANSITION_TIME = 400
const FADEOUT_WAIT_TIME = {
  RED: 1000,
  GREEN: 300
}

export class CircleUI {

  element = document.createElement('div')

  showing?: CircleColor
  fadeoutTimeout?: number = undefined

  constructor() {
    this.element.id = 'augury-health-indicator'

    this.element.style.zIndex = '9999'
    this.element.style.position = 'fixed'
    this.element.style.width = '60px'
    this.element.style.height = '60px'
    this.element.style.background = 'blue'
    this.element.style.borderRadius = '50%'
    this.element.style.paddingRight = '1%'
    this.element.style.left = '5%'
    this.element.style.top = '80%'
    this.element.style.fontSize = '2em'
    this.element.style.display = 'none'
    this.element.style.transition = `opacity ${FADE_TRANSITION_TIME}ms ease-in-out`

    document.body.appendChild(this.element)
  }

  flash(color: CircleColor) {

    if (!this.showing) {
      this.scheduleFadeout(color)
      this.show(color)
    }

    if (this.showing === 'green') {
      this.scheduleFadeout(color)
      this.show(color)
    }

    if (this.showing === 'red') {
      if (color === 'green') return
      if (color === 'red') {
        this.scheduleFadeout('red')
      }
    }

  }

  show(color: CircleColor) {
    // timeout so that it blinks
    setTimeout(() => {
      this.element.style.background = color
      this.element.style.display = 'block'
    }, 0)
    this.hide()
    this.showing = color
  }

  hide() {
    this.element.style.display = 'none'
    this.showing = undefined
  }

  scheduleFadeout(color: CircleColor) {
    if (this.fadeoutTimeout) this.unscheduleFadeout()
    this.fadeoutTimeout = setTimeout(
      () => this.hide(),
      FADEOUT_WAIT_TIME[color.toUpperCase()]
    )
  }

  unscheduleFadeout() {
    if (!this.fadeoutTimeout) return
    clearTimeout(this.fadeoutTimeout)
    this.fadeoutTimeout = undefined
  }

}