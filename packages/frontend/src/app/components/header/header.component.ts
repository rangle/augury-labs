import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ag-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input()
  public recording: boolean;

  @Output()
  public cleared = new EventEmitter<void>();

  @Output()
  public stopped = new EventEmitter<void>();

  @Output()
  public started = new EventEmitter<void>();
}
