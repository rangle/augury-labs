import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  ListItemWithOnPushComponent,
  ListItemWithOutOnPushComponent,
  ListWithOnPushComponent,
  ListWithOutOnPushComponent,
  OnPushDemoComponent,
  OnPushDemoFormComponent,
  OnPushDemoListsComponent,
} from './components';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [
    ListItemWithOnPushComponent,
    ListItemWithOutOnPushComponent,
    ListWithOnPushComponent,
    ListWithOutOnPushComponent,
    OnPushDemoComponent,
    OnPushDemoFormComponent,
    OnPushDemoListsComponent,
  ],
})
export class OnPushDemoModule {}
