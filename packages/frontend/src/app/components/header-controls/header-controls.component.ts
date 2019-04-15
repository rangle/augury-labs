import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ag-header-controls',
  templateUrl: './header-controls.component.html',
  styleUrls: ['./header-controls.component.scss'],
})
export class HeaderControlsComponent {
  @Input()
  public recording: boolean;

  @Output()
  public cleared = new EventEmitter<void>();

  @Output()
  public stopped = new EventEmitter<void>();

  @Output()
  public started = new EventEmitter<void>();
}
