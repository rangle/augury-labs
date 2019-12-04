import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  TrackByDemoComponent,
  TrackByDemoFormComponent,
  TrackByItemsComponent,
  TrackByItemComponent,
} from './components';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [
    TrackByDemoComponent,
    TrackByDemoFormComponent,
    TrackByItemComponent,
    TrackByItemsComponent,
  ],
})
export class TrackByDemoModule {}
