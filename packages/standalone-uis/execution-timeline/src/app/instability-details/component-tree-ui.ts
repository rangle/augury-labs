import * as d3 from 'd3'

export class ComponentTreeUI {

  private containerEl: SVGElement
  private data: any

  constructor(svgEl: SVGElement) {
    this.containerEl = svgEl
  }

  hasData() {
    return !!this.data
  }

  updateData(data: any) {
    this.data = data
    console.log(data)
    this.repaint()
  }

  repaint() {
    this.containerEl.innerHTML = ''
    this.paint()
  }

  private paint() {
    if (!this.data) throw new Error('no data provided')
    const _this = this

    const margin = { top: 20, right: 20, bottom: 30, left: 20 },
      width = this.containerEl.clientWidth - margin.left - margin.right,
      height = this.containerEl.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(this.containerEl)
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    let i = 0, duration = 750, root

    const treemap = d3.tree().size([width, height])

    root = d3.hierarchy(this.data, (d: any) => d.children)
    root.x0 = 0
    root.y0 = width / 3

    // root.children.forEach(collapse)

    draw(root)

    function draw(source) {

      const treeData = treemap(root);

      const nodes = treeData.descendants(),
        links = treeData.descendants().slice(1)

      nodes.forEach((d: any) => d.y = d.depth * 30)

      const node = g.selectAll('g.node')
        .data(nodes, (d: any) => d.id || (d.id = ++i))

      const nodeEnter = node
        .enter()
        .append('g')
        .style('cursor', 'pointer')
        .attr('class', 'node')
        .attr('transform', (d: any) => 'translate(' + source.x0 + ',' + source.y0 + ')')
        .on('click', click)

      function componentWasAdded(nodeData) {
        return nodeData.data.change === 'added'
      }

      function componentWasRemoved(nodeData) {
        return nodeData.data.change === 'removed'
      }

      function someChildWasAdded(componentData) {
        const componentChildren = componentData._children || componentData.children || []
        if (componentChildren.some(child => componentWasAdded(child))) return true
        if (componentChildren.some(child => someChildWasAdded(child))) return true
      }


      function circleColor(componentData) {
        if (componentWasAdded(componentData)) return 'green'
        if (componentWasRemoved(componentData)) return 'red'

        const childrenAreCollapsed = componentData._children
        if (childrenAreCollapsed) {
          if (someChildWasAdded(componentData)) return 'lightgreen'
          else return 'lightsteelblue'
        } else return '#fff'
      }

      nodeEnter.append('circle')
        .style('stroke', 'steelblue')
        .style('stroke-width', '1.5px')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .on('mouseover', d => svg.select(`.text-for-${d.id}`).style('opacity', '1'))
        .on('mouseout', d => svg.select(`.text-for-${d.id}`).style('opacity', '0'))

      nodeEnter.append('text')
        .style('font', '10px sans-serif')
        .style('opacity', '0')
        .style('pointer-events', 'none')
        .attr('class', d => `text-for-${d.id}`)
        .attr('dy', '.35em')
        .attr('x', (d: any) => d.children || d._children ? -13 : 13)
        .attr('text-anchor', (d: any) => d.children || d._children ? 'end' : 'start')
        .text((d: any) => d.data.name) // @todo: name on hover, always or if squeezeds?

      const nodeUpdate = nodeEnter.merge(node);

      nodeUpdate
        //.transition()
        //.duration(duration)
        .attr('transform', (d: any) => 'translate(' + d.x + ',' + d.y + ')')

      nodeUpdate.select('circle.node')
        .attr('r', 10)
        // .style('fill', (d: any) => d._children ? 'lightsteelblue' : '#fff')
        .style('fill', (d: any) => circleColor(d))
        .attr('cursor', 'pointer')

      const nodeExit = node.exit()
        //.transition()
        //.duration(duration)
        .attr('transform', (d: any) => 'translate(' + source.x + ',' + source.y + ')')
        .remove();

      nodeExit.select('circle')
        .attr('r', 1e-6);

      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      const link = g.selectAll('path.link')
        .data(links, (d: any) => d.id)

      const linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .style('fill', 'none')
        .style('stroke', '#ccc')
        .style('stroke-width', '1.5px')
        .attr('d', (d: any) => {
          const o = { x: source.x0, y: source.y0 }
          return diagonal(o, o)
        })

      const linkUpdate = linkEnter.merge(link);

      linkUpdate
        //.transition()
        //.duration(duration)
        .attr('d', (d: any) => diagonal(d, d.parent))

      const linkExit = link.exit()
        //.transition()
        //.duration(duration)
        .attr('d', (d: any) => {
          const o = { x: source.x, y: source.y }
          return diagonal(o, o)
        })
        .remove()

      nodes.forEach((d: any) => {
        d.x0 = d.x
        d.y0 = d.y
      })

    }

    function diagonal(s, d) {
      return `M ${s.x} ${s.y} L ${d.x} ${d.y}`
    }

    function collapse(d) {
      if (d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
      }
    }

    function click(d) {
      if (d.children) {
        d._children = d.children
        d.children = null
      } else {
        d.children = d._children
        d._children = null
      }
      draw(d)
    }
  }
}
