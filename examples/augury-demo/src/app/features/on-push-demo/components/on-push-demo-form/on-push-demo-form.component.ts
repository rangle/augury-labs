import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'al-on-push-demo-form',
  templateUrl: './on-push-demo-form.component.html',
})
export class OnPushDemoFormComponent {
  @Input()
  public counter: number;

  @Input()
  public useOnPush: boolean;

  @Output()
  public useOnPushChange = new EventEmitter<boolean>();

  @Output()
  public counterIncremented = new EventEmitter<void>();

  @Output()
  public listAdded = new EventEmitter<void>();
}
