import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './demos/home';
import { InputOutputComponent } from './demos/input-output';
import { MyFormComponent, ControlFormComponent, Form2Component } from './demos/forms';
import { DITreeComponent } from './demos/di-tree';
import { AngularDirectivesComponent } from './demos/angular-directives';
import { ChangeDetectionComponent } from './demos/change-detection';
import { StressTesterComponent } from './demos/stress-tester';
import { MetadataTestComponent } from './demos/metadata-test';
import { LeakyFaucetComponent } from './demos/leaky-faucet';
import { AgDemoRunOutsideAngularComponent } from './demos/agdemo-run-outside-angular/agdemo-run-outsice-angular.component'
import { AgDemoTrackByComponent } from './demos/agdemo-trackby/agdemo-trackby.component'
import { AgDemoOnPushComponent } from './demos/agdemo-onpush/agdemo-onpush.component'
import { AgDemoSlowTemplateComponent } from './demos/agdemo-slow-template/agdemo-slow-template.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'input-output', component: InputOutputComponent },
  { path: 'lazy-load', loadChildren: 'app/demos/lazy-load/lazy-load.module#LazyLoadModule' },
  { path: 'my-form', component: MyFormComponent },
  { path: 'control-form', component: ControlFormComponent },
  { path: 'form2', component: Form2Component },
  { path: 'di-tree', component: DITreeComponent },
  { path: 'angular-directives', component: AngularDirectivesComponent },
  { path: 'change-detection', component: ChangeDetectionComponent },
  { path: 'stress-tester', component: StressTesterComponent },
  { path: 'metadata-test', component: MetadataTestComponent },
  { path: 'leaky-faucet', component: LeakyFaucetComponent },
  { path: 'ag-demo-run-outside-angular', component: AgDemoRunOutsideAngularComponent },
  { path: 'ag-demo-trackby', component: AgDemoTrackByComponent },
  { path: 'ag-demo-onpush', component: AgDemoOnPushComponent },
  { path: 'ag-demo-slow-template', component: AgDemoSlowTemplateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
