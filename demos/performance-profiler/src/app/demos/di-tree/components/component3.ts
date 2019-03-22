import { forwardRef, Component, Inject } from '@angular/core';

import { Service1 } from '../services/service1';
import { Service3 } from '../services/service3';

@Component({
  selector: 'component3',
  template: `
    <p>component3</p>
    {{ service1Value }} {{ service3Value }}
    <hr />
  `,
})
export class Component3 {
  public service1Value: string;
  public service3Value: string;

  constructor(private s1: Service1, @Inject(forwardRef(() => Service3)) private s3: Service3) {
    this.service1Value = s1.value;
    this.service3Value = s3.value;
  }
}
