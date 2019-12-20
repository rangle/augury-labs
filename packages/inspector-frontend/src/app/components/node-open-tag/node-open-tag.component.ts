import { Component, Input } from '@angular/core';

@Component({
  selector: 'ag-node-open-tag',
  templateUrl: './node-open-tag.component.html',
  styleUrls: ['./node-open-tag.component.scss'],
})
export class NodeOpenTagComponent {
  @Input() public node;
}
