export interface Offsets {
  left: number;
  top: number;
  width: number;
  marginWidth?: number;
  height: number;
  marginHeight?: number;
}

export interface PossibleOffsets {
  hasOffsets: boolean,
  offsets?: Offsets
}

export interface ExistingOffsets extends PossibleOffsets {
  hasOffsets: true,
  offsets: Offsets
}

export interface NonExistingOffsets extends PossibleOffsets {
  hasOffsets: false
}

export function addUpNodeAndChildrenOffsets(domNode: Node): PossibleOffsets {

  if (!(domNode instanceof HTMLElement))
    return { hasOffsets: false }

  const domElement = domNode as HTMLElement

  const offsets = getElementOffsets(domElement)

  const children = Array.from(domElement.children)

  if (!children.length)
    return {
      hasOffsets: true,
      offsets
    }

  function containOffsets(currentOffsetAndMargin: number, childOffset: number, childmargin?: number) {
    return Math.max(
      currentOffsetAndMargin,
      childOffset + (childmargin || 0)
    )
  }

  let child;
  while (child = children.pop()) {

    const possibleChildOffsets = addUpNodeAndChildrenOffsets(child)

    if (possibleChildOffsets.hasOffsets) {
      const co = (possibleChildOffsets as ExistingOffsets).offsets
      offsets.height = containOffsets(offsets.height, co.height, co.marginHeight)
      offsets.width = containOffsets(offsets.width, co.width, co.marginWidth)
    }

  }

  return { hasOffsets: true, offsets }

}

export function getElementOffsets(domElement: HTMLElement): Offsets {

  const computedStyle = getComputedStyle(domElement)

  function parse(stringNum) {
    return parseInt(stringNum || '0', 10)
  }

  const offsets: Offsets = {
    left: domElement.offsetLeft,
    top: domElement.offsetTop,
    width: domElement.offsetWidth,
    marginWidth: parse(computedStyle.marginLeft) + parse(computedStyle.marginRight),
    height: domElement.offsetHeight,
    marginHeight: parse(computedStyle.marginTop) + parse(computedStyle.marginBottom)
  }

  while (domElement = domElement.offsetParent as HTMLElement) {
    offsets.left += domElement.offsetLeft
    offsets.top += domElement.offsetTop
  }

  return offsets

}
