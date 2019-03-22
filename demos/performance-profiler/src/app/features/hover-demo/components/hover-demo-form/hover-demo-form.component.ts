import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'al-hover-demo-form',
  templateUrl: './hover-demo-form.component.html'
})
export class HoverDemoFormComponent {
  @Input()
  public useOnPush: boolean;

  @Output()
  public useOnPushChange = new EventEmitter<boolean>();
}
