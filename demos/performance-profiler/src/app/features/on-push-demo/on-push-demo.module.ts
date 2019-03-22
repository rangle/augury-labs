import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  ListItemWithOnPushComponent,
  ListItemWithOutOnPushComponent,
  ListWithOnPushComponent,
  ListWithOutOnPushComponent,
  OnPushDemoComponent,
  OnPushDemoFormComponent,
  OnPushDemoListsComponent
} from './components';
import { onPushDemoRoutes } from './on-push-demo.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(onPushDemoRoutes)
  ],
  declarations: [
    ListItemWithOnPushComponent,
    ListItemWithOutOnPushComponent,
    ListWithOnPushComponent,
    ListWithOutOnPushComponent,
    OnPushDemoComponent,
    OnPushDemoFormComponent,
    OnPushDemoListsComponent
  ]
})
export class OnPushDemoModule {}
