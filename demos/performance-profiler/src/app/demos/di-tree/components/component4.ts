import { Component, Inject } from '@angular/core';

import { Service1 } from '../services/service1';
import { Service4 } from '../services/service4';

@Component({
  selector: 'component4',
  template: `
    <p>component4 init: service4</p>
    {{ service1Value }} {{ service4Value }}
    <hr />
  `,
})
export class Component4 {
  public service1Value: string;
  public service4Value: string;

  constructor(private s1: Service1, @Inject(Service4) private s4) {
    this.service1Value = s1.value;
    this.service4Value = s4.value;
  }
}
