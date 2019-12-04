import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ag-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Output()
  public pressed = new EventEmitter<MouseEvent>();
}
