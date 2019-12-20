import { Component, Input } from '@angular/core';

@Component({
  selector: 'ag-node-attributes',
  templateUrl: './node-attributes.component.html',
  styleUrls: ['./node-attributes.component.scss'],
})
export class NodeAttributesComponent {
  @Input() public attributes: any[];
}
