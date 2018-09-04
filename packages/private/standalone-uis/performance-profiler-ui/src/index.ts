import * as d3 from 'd3'
import { flamegraph } from 'd3-flame-graph'
import 'd3-flame-graph/dist/d3-flamegraph.css'

import { createStylesheet } from './create-stylesheet'
import { paintTimeline } from './raw-timeline'

// @todo: put in shared utils
function round2(num) {
  return Math.round(num * 100) / 100
}

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

// @todo: hack
style.insertRule(`
  foreignObject {
    overflow:hidden;
    cursor:pointer;
  }
`)

const clearButton = document.createElement('button')
clearButton.innerHTML = 'clear'
document.body.appendChild(clearButton)

const topContainer = document.createElement('div')
topContainer.style.whiteSpace = 'nowrap'
topContainer.style.overflowX = 'scroll'
document.body.appendChild(topContainer)

const hoverDisplay = document.createElement('div')
hoverDisplay.style.position = 'absolute'
hoverDisplay.style.background = 'gray'
hoverDisplay.style.padding = '10px'
hoverDisplay.style.borderRadius = '10px'
hoverDisplay.style.transition = `opacity 200ms ease-in-out`
hoverDisplay.style.opacity = '0'
document.body.appendChild(hoverDisplay)

document.onmousemove = event => {
  hoverDisplay.style.left = event.clientX + 10 + 'px'
  hoverDisplay.style.top = event.clientY + 10 + 'px'
}

let hoverTimeout
function showHover() {
  hoverDisplay.style.opacity = '0.8'
  clearTimeout(hoverTimeout)
  hoverTimeout = setTimeout(() => {
    hoverDisplay.style.opacity = '0'
  }, 5000)
  document.onclick = () => {
    hoverDisplay.style.opacity = '0'
  }
}

const detailsDisplay = document.createElement('div')
document.body.appendChild(detailsDisplay)

const flame = document.createElement('div')
flame.style.margin = '5%'
document.body.appendChild(flame)

// @todo: useless, remove
function createChunkContainer() {
  const newContainer = document.createElement('div')
  newContainer.style.display = 'block'
  topContainer.appendChild(newContainer)
  return newContainer
}

let taskTimeline: any[] = []
let cycleTimeline: any[] = []
let cdTimeline: any[] = []
let container = createChunkContainer()
let isFirst = true
let lastNum = 0
;(window as any).cycles = cycleTimeline
;(window as any).tasks = taskTimeline
;(window as any).cdTimeline = cdTimeline
;(window as any).c = () => {
  taskTimeline.splice(0, taskTimeline.length)
  cycleTimeline.splice(0, cycleTimeline.length)
  cdTimeline.splice(0, cdTimeline.length)
  paint()
}
;(window as any).c = () => {
  taskTimeline.splice(0, taskTimeline.length)
  cycleTimeline.splice(0, cycleTimeline.length)
  cdTimeline.splice(0, cdTimeline.length)
  paint()
}

// @todo: get rid of this stuff
const DISTANCE_LIMIT = Infinity
function newChunk() {
  isFirst = false
  cycleTimeline = []
  cdTimeline = []
  taskTimeline = []
  container = createChunkContainer()
}

bridge.in.subscribe(msg => {
  if (msg.type === 'cycle') {
    const startNum = msg.lastElapsedCycle.startPerformanceStamp
    if (startNum - lastNum > DISTANCE_LIMIT) {
      newChunk()
    }
    lastNum = msg.lastElapsedCycle.finishPerformanceStamp
    cycleTimeline.push({
      original: msg,
      color: 'purple',
      starting_time: Math.floor(msg.lastElapsedCycle.startPerformanceStamp),
      ending_time: Math.ceil(msg.lastElapsedCycle.finishPerformanceStamp),
    })
  }

  if (msg.type === 'task') {
    const startNum = msg.lastElapsedTask.startPerformanceStamp
    if (startNum - lastNum > DISTANCE_LIMIT) {
      newChunk()
    }
    lastNum = msg.lastElapsedTask.finishPerformanceStamp
    taskTimeline.push({
      original: msg,
      color:
        msg.lastElapsedTask.zone === 'root'
          ? 'blue'
          : msg.lastElapsedTask.zone === 'ng'
            ? 'green'
            : 'red',
      starting_time: Math.floor(msg.lastElapsedTask.startPerformanceStamp),
      ending_time: Math.ceil(msg.lastElapsedTask.finishPerformanceStamp),
    })
  }

  if (msg.type === 'cd') {
    const startNum = msg.lastElapsedCD.startPerformanceStamp
    if (startNum - lastNum > DISTANCE_LIMIT) {
      newChunk()
    }
    lastNum = msg.lastElapsedCD.finishPerformanceStamp
    cdTimeline.push({
      original: msg,
      color: 'orange',
      starting_time: Math.floor(msg.lastElapsedCD.startPerformanceStamp),
      ending_time: Math.ceil(msg.lastElapsedCD.finishPerformanceStamp),
    })
  }

  paint()
})

function clear() {
  hoverDisplay.innerHTML = ''
  detailsDisplay.innerHTML = ''
  taskTimeline = []
  cycleTimeline = []
  cdTimeline = []
  paint()
}

clearButton.onclick = clear

function paint() {
  paintTimeline({
    data: [
      { label: 'tasks', times: taskTimeline },
      { label: 'instability', times: cycleTimeline },
      { label: 'cd', times: cdTimeline },
    ].map(row => (isFirst ? row : { times: row.times })),
    container,
    onHover(segment, row) {
      const msg = segment.original

      if (msg.type === 'task') {
        const {
          zone,
          startEID,
          task,
          startPerformanceStamp,
          finishPerformanceStamp,
        } = msg.lastElapsedTask
        hoverDisplay.innerHTML = `
          <span style='font-size:20px;font-weight:bold;margin-bottom:5px'>
            zone task
          </span>
          <div>
            auguryID: ${startEID}
          </div>
          <div>
            zone: ${zone}
          </div>
          <div>
            taskType: ${task.type}
          </div>
          <div>
            source: ${task.source}
          </div>
          <div>
            running time: ${round2(finishPerformanceStamp - startPerformanceStamp)}ms
          </div>
        `
      }

      if (msg.type === 'cycle') {
        const { startEID, startPerformanceStamp, finishPerformanceStamp } = msg.lastElapsedCycle
        hoverDisplay.innerHTML = `
          <span style='font-size:20px;font-weight:bold;margin-bottom:5px'>
            angular instability period
          </span>
          <div>
            auguryID: ${startEID}
          </div>
          <div>
            running time: ${round2(finishPerformanceStamp - startPerformanceStamp)}ms
          </div>
        `
      }

      if (msg.type === 'cd') {
        const {
          startEID,
          startPerformanceStamp,
          finishPerformanceStamp,
          componentsChecked,
        } = msg.lastElapsedCD
        hoverDisplay.innerHTML = `
          <span style='font-size:20px;font-weight:bold;margin-bottom:5px'>
            change detection cycle
          </span>
          <div>
            auguryID: ${startEID}
          </div>
          <div>
            # of components checked: ${componentsChecked.length}
          </div>
          <div>
            running time: ${round2(finishPerformanceStamp - startPerformanceStamp)}ms
          </div>
        `
      }

      showHover()
      return null
    },
    onClick(segment, row) {
      const msg = segment.original

      if (msg.type === 'task') {
        const {
          zone,
          startEID,
          task,
          startPerformanceStamp,
          finishPerformanceStamp,
        } = msg.lastElapsedTask
        const flameGraph = document.createElement('h4')
        detailsDisplay.innerHTML = `
          <span style='font-size:20px;font-weight:bold;margin-bottom:5px'>
            zone task
          </span>
          <div>
            auguryID: ${startEID}
          </div>
          <div>
            zone: ${zone}
          </div>
          <div>
            taskType: ${task.type}
          </div>
          <div>
            source: ${task.source}
          </div>
          <div>
            running time: ${round2(finishPerformanceStamp - startPerformanceStamp)}ms
          </div>
        `
        detailsDisplay.appendChild(flameGraph)
        showFlame(msg.lastElapsedTask.flamegraph)
      }

      if (msg.type === 'cycle') {
        const { startEID, startPerformanceStamp, finishPerformanceStamp } = msg.lastElapsedCycle
        detailsDisplay.innerHTML = `
          <span style='font-size:20px;font-weight:bold;margin-bottom:5px'>
            angular instability period
          </span>
          <div>
            auguryID: ${startEID}
          </div>
          <div>
            running time: ${round2(finishPerformanceStamp - startPerformanceStamp)}ms
          </div>
        `
        killFlame()
      }

      if (msg.type === 'cd') {
        const {
          startEID,
          startPerformanceStamp,
          finishPerformanceStamp,
          componentsChecked,
        } = msg.lastElapsedCD
        detailsDisplay.innerHTML = `
          <span style='font-size:20px;font-weight:bold;margin-bottom:5px'>
            change detection cycle
          </span>
          <div>
            auguryID: ${startEID}
          </div>
          <div>
            # of components checked: ${componentsChecked.length}
          </div>
          <div>
            running time: ${round2(finishPerformanceStamp - startPerformanceStamp)}ms
          </div>
        `
        killFlame()
      }

      return null
    },
  })
}

// flamegraph stuff ----
// @todo: move to new file

// Set the dimensions and margins of the diagram
const margin = { top: 20, right: 90, bottom: 30, left: 90 }
const width = window.innerWidth * 0.6
const height = 500 - margin.top - margin.bottom

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
const svg = d3
  .select('body')
  .append('svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let i = 0
const duration = 750
let root

// declares a tree layout and assigns the size
const treemap = d3.tree().size([height, width])

function u(d) {
  // Assigns parent, children, height, depth
  root = d3.hierarchy(d, node => {
    return node.childNodes
  })
  root.x0 = height / 2
  root.y0 = 0

  // Collapse after the second level
  // root.children.forEach(collapse);
  update(root)
}
// Collapse the node and all it's children
function collapse(d) {
  if (d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

function update(source) {
  // Assigns the x and y position for the nodes
  const treeData = treemap(root)

  // Compute the new tree layout.
  const nodes = treeData.descendants()
  const links = treeData.descendants().slice(1)

  // Normalize for fixed-depth.
  nodes.forEach(d => {
    d.y = d.depth * 180
  })

  // ****************** Nodes section ***************************
  // Update the nodes...
  const node = svg.selectAll('g.node').data(nodes, d => {
    return d.id || (d.id = ++i)
  })

  // Enter any new modes at the parent's previous position.
  const nodeEnter = node
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => {
      return 'translate(' + source.y0 + ',' + source.x0 + ')'
    })
    .on('click', click)

  // Add Circle for the nodes
  nodeEnter
    .append('circle')
    .attr('class', 'node')
    .attr('r', 1e-6)
    .style('fill', d => {
      return d._children ? 'lightsteelblue' : '#fff'
    })

  // Add labels for the nodes
  nodeEnter
    .append('text')
    .attr('dy', '.35em')
    .attr('x', d => {
      return d.children || d._children ? -13 : 13
    })
    .attr('text-anchor', d => {
      return d.children || d._children ? 'end' : 'start'
    })
    .text(d => {
      return `${d.data.nativeNode.localName} (${d.data.componentType})`
    })
    .attr('style', 'overflow:hidden;')

  // UPDATE
  const nodeUpdate = nodeEnter.merge(node)

  // Transition to the proper position for the node
  nodeUpdate
    .transition()
    .duration(duration)
    .attr('transform', d => {
      return 'translate(' + d.y + ',' + d.x + ')'
    })

  // Update the node attributes and style
  nodeUpdate
    .select('circle.node')
    .attr('r', 10)
    .style('fill', d => {
      return d._children ? 'lightsteelblue' : '#fff'
    })
    .attr('cursor', 'pointer')

  // Remove any exiting nodes
  const nodeExit = node
    .exit()
    .transition()
    .duration(duration)
    .attr('transform', d => {
      return 'translate(' + source.y + ',' + source.x + ')'
    })
    .remove()

  // On exit reduce the node circles size to 0
  nodeExit.select('circle').attr('r', 1e-6)

  // On exit reduce the opacity of text labels
  nodeExit.select('text').style('fill-opacity', 1e-6)

  // ****************** links section ***************************
  // Update the links...
  const link = svg.selectAll('path.link').data(links, d => {
    return d.id
  })

  // Enter any new links at the parent's previous position.
  const linkEnter = link
    .enter()
    .insert('path', 'g')
    .attr('class', 'link')
    .attr('d', d => {
      const o = { x: source.x0, y: source.y0 }
      return diagonal(o, o)
    })

  // UPDATE
  const linkUpdate = linkEnter.merge(link)

  // Transition back to the parent element position
  linkUpdate
    .transition()
    .duration(duration)
    .attr('d', d => {
      return diagonal(d, d.parent)
    })

  // Remove any exiting links
  const linkExit = link
    .exit()
    .transition()
    .duration(duration)
    .attr('d', d => {
      const o = { x: source.x, y: source.y }
      return diagonal(o, o)
    })
    .remove()

  // Store the old positions for transition.
  nodes.forEach(d => {
    d.x0 = d.x
    d.y0 = d.y
  })

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {
    const path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children
      d.children = null
    } else {
      d.children = d._children
      d._children = null
    }
    update(d)
  }
}

let lastInnerFlame

function showFlame(flameGraph) {
  const innerFlame = document.createElement('div')
  flame.appendChild(innerFlame)

  d3.select(lastInnerFlame).remove()

  const moduleColors = {}

  function getRealRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let k = 0; k < 6; k++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  let j = 0
  function getFakeRandomColor() {
    const rc = randomColors[j]
    j = (j + 1) % 50
    return rc
  }

  const getModuleColor = moduleName => {
    if (!moduleColors[moduleName]) {
      moduleColors[moduleName] = getFakeRandomColor()
    }
    return moduleColors[moduleName]
  }

  const totalruntime = flameGraph.reduce((totalTime, spike) => totalTime + spike.value, 0)

  d3.select(innerFlame)
    .datum({
      name: '--task--',
      value: totalruntime,
      children: flameGraph,
    })
    .call(
      flamegraph()
        .width(window.innerWidth * 0.9)
        .cellHeight(18)
        .transitionDuration(750)
        .transitionEase(d3.easeCubic)
        .color(node => getModuleColor(node.data.moduleName)),
    )

  lastInnerFlame = innerFlame
}

function killFlame() {
  flame.innerHTML = ''
}

const randomColors = [
  '#0CEA89',
  '#D95AD0',
  '#605EAD',
  '#A7BA67',
  '#C71E43',
  '#3A9F54',
  '#A77C55',
  '#0E0881',
  '#6D2B0A',
  '#A9201C',
  '#64D4D0',
  '#E3A6DD',
  '#E752A5',
  '#D6C260',
  '#1E9471',
  '#D456DC',
  '#B040D9',
  '#489860',
  '#7DA83E',
  '#FCB41A',
  '#CF9976',
  '#FC0589',
  '#67F749',
  '#D8FD88',
  '#8AB510',
  '#A32436',
  '#02B80E',
  '#EA8627',
  '#399DF1',
  '#819552',
  '#C524B1',
  '#6D6C2C',
  '#264C11',
  '#285A2F',
  '#E7275B',
  '#09DAC4',
  '#498759',
  '#79CD25',
  '#FF1094',
  '#6D8895',
  '#C2EAC1',
  '#ED20FF',
  '#565206',
  '#0AFA90',
  '#9851F7',
  '#D9967C',
  '#8BAAA1',
  '#459126',
  '#35ACD0',
  '#705D6E',
]
