import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  HoverDemoComponent,
  HoverDemoFormComponent,
  HoverDemoMouseListenerComponent,
  HoverDemoValueComponent,
  HoverDemoWithOnPushComponent,
  HoverDemoWithOutOnPushComponent,
} from './components';

@NgModule({
  imports: [CommonModule],
  declarations: [
    HoverDemoComponent,
    HoverDemoFormComponent,
    HoverDemoMouseListenerComponent,
    HoverDemoValueComponent,
    HoverDemoWithOnPushComponent,
    HoverDemoWithOutOnPushComponent,
  ],
})
export class HoverDemoModule {}
