import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

/// The number of levels of tree nodes that we expand by default
export const defaultExpansionDepth = 3;

@Component({
  selector: 'ag-node-item',
  templateUrl: './node-item.component.html',
  styleUrls: ['./node-item.component.scss'],
})
export class NodeItemComponent {
  @Input() public node;

  // The depth of this node in the tree
  @Input() public level: number;

  // Emitted when this node is selected
  @Output() public selectNode = new EventEmitter<Node>();

  // Emitted when this node is selected for element inspection
  @Output() public inspectElement = new EventEmitter<Node>();

  // Expand this node and all its children
  @Output() public expandChildren = new EventEmitter<Node>();

  // Collapse this node and all its children
  @Output() public collapseChildren = new EventEmitter<Node>();

  constructor(private changeDetector: ChangeDetectorRef) {}

  get selected(): boolean {
    // return this.viewState.selectionState(this.node);
    return false;
  }

  get expanded(): boolean {
    return this.defaultExpanded;
    //   const state = this.viewState.expandState(this.node);
    //   if (state == null) { // user has not expanded or collapsed explicitly
    //     return this.defaultExpanded;
    //   }
    //   return state === ExpandState.Expanded;
  }

  private get defaultExpanded(): boolean {
    return this.level < defaultExpansionDepth;
  }

  get hasChildren(): boolean {
    return this.node.children.length > 0;
  }

  /// Select the element in inspect window on double click
  public onDblClick(event: MouseEvent) {
    this.inspectElement.emit(this.node);
  }

  public onClick(event: MouseEvent) {
    if (event.ctrlKey || event.metaKey) {
      this.expandChildren.emit(this.node);
    } else if (event.altKey) {
      this.collapseChildren.emit(this.node);
    }

    this.selectNode.emit(this.node);
  }

  public onMouseOut(event: MouseEvent) {
    // this.userActions.clearHighlight();
  }

  public onMouseOver($event) {
    // this.userActions.highlight(this.node);
  }

  public onToggleExpand($event) {
    // const defaultState =
    //   this.defaultExpanded
    //     ? ExpandState.Expanded
    //     : ExpandState.Collapsed;
    // this.userActions.toggle(this.node, defaultState);
    // this.changeDetector.detectChanges();
  }

  public trackById = (index: number, node: { id: string | number }) => node.id;
}
