export interface Offsets {
  left: number
  top: number
  width: number
  marginWidth?: number
  height: number
  marginHeight?: number
}
export interface PossibleOffsets {
  hasOffsets: boolean
  offsets?: Offsets
}
export interface ExistingOffsets extends PossibleOffsets {
  hasOffsets: true
  offsets: Offsets
}
export interface NonExistingOffsets extends PossibleOffsets {
  hasOffsets: false
}
export declare function addUpNodeAndChildrenOffsets(domNode: Node): PossibleOffsets
export declare function getElementOffsets(domElement: HTMLElement): Offsets
