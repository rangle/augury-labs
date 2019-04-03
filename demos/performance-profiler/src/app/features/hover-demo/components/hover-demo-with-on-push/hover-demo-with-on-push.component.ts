import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'al-hover-demo-with-on-push',
  templateUrl: './hover-demo-with-on-push.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoverDemoWithOnPushComponent {
  public compute() {
    return Array(10000)
      .fill(true)
      .reduce(() => 'done');
  }
}
