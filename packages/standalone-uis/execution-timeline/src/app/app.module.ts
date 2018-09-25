import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { ExecutionTimelineComponent } from './timeline'
import { TaskDetailsComponent } from './task-details'
import { InstabilityDetailsComponent } from './instability-details'
import { ChangeDetectionDetailsComponent } from './cd-details'

@NgModule({
  declarations: [
    AppComponent,
    ExecutionTimelineComponent,
    TaskDetailsComponent,
    InstabilityDetailsComponent,
    ChangeDetectionDetailsComponent
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
