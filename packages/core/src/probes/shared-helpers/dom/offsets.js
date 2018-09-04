'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
function addUpNodeAndChildrenOffsets(domNode) {
  if (!(domNode instanceof HTMLElement)) return { hasOffsets: false }
  const domElement = domNode
  const offsets = getElementOffsets(domElement)
  const children = Array.from(domElement.children)
  if (!children.length)
    return {
      hasOffsets: true,
      offsets,
    }
  function containOffsets(currentOffsetAndMargin, childOffset, childmargin) {
    return Math.max(currentOffsetAndMargin, childOffset + (childmargin || 0))
  }
  let child
  while ((child = children.pop())) {
    const possibleChildOffsets = addUpNodeAndChildrenOffsets(child)
    if (possibleChildOffsets.hasOffsets) {
      const co = possibleChildOffsets.offsets
      offsets.height = containOffsets(offsets.height, co.height, co.marginHeight)
      offsets.width = containOffsets(offsets.width, co.width, co.marginWidth)
    }
  }
  return { hasOffsets: true, offsets }
}
exports.addUpNodeAndChildrenOffsets = addUpNodeAndChildrenOffsets
function getElementOffsets(domElement) {
  const computedStyle = getComputedStyle(domElement)
  function parse(stringNum) {
    return parseInt(stringNum || '0', 10)
  }
  const offsets = {
    left: domElement.offsetLeft,
    top: domElement.offsetTop,
    width: domElement.offsetWidth,
    marginWidth: parse(computedStyle.marginLeft) + parse(computedStyle.marginRight),
    height: domElement.offsetHeight,
    marginHeight: parse(computedStyle.marginTop) + parse(computedStyle.marginBottom),
  }
  while ((domElement = domElement.offsetParent)) {
    offsets.left += domElement.offsetLeft
    offsets.top += domElement.offsetTop
  }
  return offsets
}
exports.getElementOffsets = getElementOffsets
//# sourceMappingURL=offsets.js.map
