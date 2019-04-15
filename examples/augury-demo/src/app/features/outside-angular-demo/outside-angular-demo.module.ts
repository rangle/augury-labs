import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OutsideAngularDemoComponent, OutsideAngularDemoFormComponent } from './components';

@NgModule({
  imports: [CommonModule],
  declarations: [OutsideAngularDemoComponent, OutsideAngularDemoFormComponent],
})
export class OutsideAngularDemoModule {}
