import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

// demos
import { HomeComponent } from './demos/home';
import { CounterComponent, InputOutputComponent } from './demos/input-output';
import { MyFormComponent, ControlFormComponent, Form2Component } from './demos/forms';
import { DI_TREE_SERVICES, DI_TREE_COMPONENTS } from './demos/di-tree';
import { ANGULAR_DIRECTIVES_COMPONENTS } from './demos/angular-directives';
import { CHANGE_DETECTION_COMPONENTS } from './demos/change-detection';
import { STRESS_TESTER_COMPONENTS } from './demos/stress-tester';
import { METADATA_TEST_COMPONENTS } from './demos/metadata-test';
import { TODO_APP_SERVICES, TODO_APP_COMPONENTS } from './demos/todo-app';
import { LeakyFaucetComponent } from './demos/leaky-faucet/components/leaky-faucet.component';
import { RunOutsideAngularComponent } from './demos/leaky-faucet/run-outside-angular/run-outside-angular.component';

import {
  AgDemoRunOutsideAngularComponent
} from './demos/agdemo-run-outside-angular/agdemo-run-outsice-angular.component'

import {
  AgDemoTrackByComponent,
  AgDemoWithTrackByComponent,
  AgDemoWithoutTrackByComponent,
  AgDemoTrackByItemComponent,
} from './demos/agdemo-trackby/agdemo-trackby.component'

import {
  AgDemoOnPushComponent,
  AgDemoWithOnPushComponent,
  AgDemoWithoutOnPushComponent,
  AgDemoListWithOnPushComponent,
  AgDemoListWithoutOnPushComponent,
  AgDemoItemWithOnPushComponent,
  AgDemoItemWithoutOnPushComponent
} from './demos/agdemo-onpush/agdemo-onpush.component'

import {
  AgDemoSlowTemplateComponent,
  AgDemoWithSlowTemplateComponent,
  AgDemoWithSlowTemplateOnPushComponent
} from './demos/agdemo-slow-template/agdemo-slow-template.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InputOutputComponent,
    CounterComponent,
    MyFormComponent,
    ControlFormComponent,
    Form2Component,
    ...DI_TREE_COMPONENTS,
    ...ANGULAR_DIRECTIVES_COMPONENTS,
    ...CHANGE_DETECTION_COMPONENTS,
    ...STRESS_TESTER_COMPONENTS,
    ...METADATA_TEST_COMPONENTS,
    ...TODO_APP_COMPONENTS,
    LeakyFaucetComponent,
    RunOutsideAngularComponent,

    AgDemoRunOutsideAngularComponent,

    AgDemoTrackByComponent,
    AgDemoWithTrackByComponent,
    AgDemoWithoutTrackByComponent,
    AgDemoTrackByItemComponent,
    AgDemoOnPushComponent,
    AgDemoWithOnPushComponent,

    AgDemoWithoutOnPushComponent,
    AgDemoListWithOnPushComponent,
    AgDemoListWithoutOnPushComponent,
    AgDemoItemWithOnPushComponent,
    AgDemoItemWithoutOnPushComponent,

    AgDemoSlowTemplateComponent,
    AgDemoWithSlowTemplateComponent,
    AgDemoWithSlowTemplateOnPushComponent

  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    ...DI_TREE_SERVICES,
    ...TODO_APP_SERVICES,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
