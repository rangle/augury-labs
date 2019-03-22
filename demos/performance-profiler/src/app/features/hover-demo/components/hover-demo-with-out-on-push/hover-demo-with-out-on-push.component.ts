import { Component } from '@angular/core';

@Component({
  selector: 'al-hover-demo-with-out-on-push',
  templateUrl: './hover-demo-with-out-on-push.component.html'
})
export class HoverDemoWithOutOnPushComponent {
  public compute() {
    for (let i = 0; i < 100000000; i++) {
      // do nothing
    }

    return 'done';
  }
}
