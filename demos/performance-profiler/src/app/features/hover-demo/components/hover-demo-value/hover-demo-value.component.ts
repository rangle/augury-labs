import { Component, Input } from '@angular/core';

@Component({
  selector: 'al-hover-demo-value',
  templateUrl: './hover-demo-value.component.html'
})
export class HoverDemoValueComponent {
  @Input()
  public useOnPush: boolean;
}
