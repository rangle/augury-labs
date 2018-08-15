// @todo: use @augury/core when we switch to monorepo
import { Plugin } from '../../../core/dist'

function round2(num) {
  return Math.round(num * 100) / 100
}

const FADEOUT_TRANSITION_MS = 400
const FADEOUT_WAIT_MS = 1300

export class RecentCyclesOverlay extends Plugin {

  onInit() {

    // we should probably move this to the Plugin class?
    // @todo: we need onAppInit() hook. (hence the timeout)
    setTimeout(() => {
      gaInit()
      ga('send', {
        hitType: 'event',
        eventCategory: 'PerformanceProfilerPlugin',
        eventAction: 'onInit',
        eventLabel: getAppIdentifier()
      })
    }, 5000)


    const ui = document.createElement('div')

    ui.id = 'augury-performance-indicator'

    ui.style.zIndex = '9999'
    ui.style.position = 'fixed'
    ui.style.width = '20%'
    ui.style.paddingRight = '1%'
    ui.style.left = '80%'
    ui.style.top = '0'
    ui.style.fontSize = '2em'
    ui.style.color = 'red'

    function addStamp(ms) {

      const stamp = document.createElement('div')
      stamp.style.transition = `opacity ${FADEOUT_TRANSITION_MS}ms ease-in-out`
      stamp.style.textAlign = 'right'
      stamp.innerText = `${ms} ms`

      function attach() {
        const lastStamp = ui.children[0]
        if (lastStamp) {
          (lastStamp as any).shrink()
          ui.insertBefore(stamp, lastStamp)
        }
        else ui.appendChild(stamp)
      }

      function show() {
        stamp.style.display = 'block'
        stamp.style.opacity = '1'
      }

      function hide() {
        stamp.style.opacity = '0'
      }

      function detach() {
        ui.removeChild(stamp)
      }

      (stamp as any).shrink = function () {
        this.style.fontSize = '0.55em'
      }

      setTimeout(() => hide(), FADEOUT_WAIT_MS)
      setTimeout(() => detach(), FADEOUT_WAIT_MS + FADEOUT_TRANSITION_MS)

      hide()
      attach()
      show()

    }

    document.body.appendChild(ui)

    const { channel } = this.api!.subscribeToLastElapsedCycle()

    channel.events.subscribe(lastElapsedCycle => {

      const { startPerformanceStamp, finishPerformanceStamp } = lastElapsedCycle

      addStamp(round2(finishPerformanceStamp - startPerformanceStamp))

    })

  }

}

// @todo: get this out of here.
declare const ng
declare const getAllAngularRootElements
function getAppIdentifier() {
  return ng.probe(getAllAngularRootElements()[0])
    .children.reduce((string, child) => (string ? string + "," : "") + child.nativeNode.localName, '')
}

export var gaNewElem: any = {};
export var gaElems: any = {};

// @todo: get this out of here
declare const ga
function gaInit() {
  var currdate: any = new Date();

  /* tslint:disable:no-string-literal */
  /* tslint:disable:semicolon */
  /* tslint:disable:no-unused-expression */
  // This code is from Google, so let's not modify it too much, just add gaNewElem and gaElems:
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * currdate; a = s.createElement(o),
      m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga', gaNewElem, gaElems);
  /* tslint:enable:no-unused-expression */
  /* tslint:enable:semicolon */
  /* tslint:enable:no-string-literal */

  ga('create', 'UA-XXXXXXXX-X', 'auto');

}