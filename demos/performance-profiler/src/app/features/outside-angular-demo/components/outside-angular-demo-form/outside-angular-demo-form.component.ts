import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'al-outside-angular-demo-form',
  templateUrl: './outside-angular-demo-form.component.html',
})
export class OutsideAngularDemoFormComponent {
  @Input()
  public isRunning = false;

  @Input()
  public runOutsideAngular = false;

  @Output()
  public runOutsideAngularChange = new EventEmitter<boolean>();

  @Output()
  public submitted = new EventEmitter();
}
