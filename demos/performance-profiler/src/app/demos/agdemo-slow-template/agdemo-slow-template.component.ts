import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { } from '@angular/forms';

@Component({
  selector: 'agdemo-slow-template',
  template: `
    <div>
      <div>
        use onpush: <input type="checkbox" [(ngModel)]="use">
      </div>
      <agdemo-component-with-slow-template *ngIf="!use"></agdemo-component-with-slow-template>
      <agdemo-component-with-slow-template-onpush *ngIf="use"></agdemo-component-with-slow-template-onpush>
      <div (mousemove)="over($event)" style="height:100px; width:100px; background:#e2e2e2">
        mouse coordinates: x={{ coors.x }} y={{ coors.y }}
      </div>
    </div>
  `
})
export class AgDemoSlowTemplateComponent {

  use = false
  coors = {
    x: 0,
    y: 0
  }

  over({ x, y }) {
    this.coors.x = x
    this.coors.y = y
  }

}

@Component({
  selector: 'agdemo-component-with-slow-template',
  template: `
    <div>
      <h5>This is a slow-checking component</h5>
      slow computed value: {{ compute() }}
    </div>
  `
})
export class AgDemoWithSlowTemplateComponent {

  compute() {
    for (let i = 0; i < 100000000; i++);
    return 'done'
  }

}

@Component({
  selector: 'agdemo-component-with-slow-template-onpush',
  template: `
    <div>
      <h5>This is a slow-checking component</h5>
      slow computed value: {{ compute() }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgDemoWithSlowTemplateOnPushComponent {

  compute() {
    return Array(10000).fill(true).reduce(x => 'done')
  }

}
