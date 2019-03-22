import { Component } from '@angular/core';

import { createDefaultPoint } from '../../types/point.functions';

@Component({
  selector: 'al-hover-demo',
  templateUrl: './hover-demo.component.html'
})
export class HoverDemoComponent {
  public useOnPush = false;
  public point = createDefaultPoint();
}
