import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { TooltipModule } from 'ng2-tooltip-directive'

import { AppComponent } from './app.component'
import { BridgeService } from './bridge.service'
import { ChangeDetectionDetailsComponent } from './cd-details'
import { InstabilityDetailsComponent } from './instability-details'
import { TaskDetailsComponent } from './task-details'
import { ExecutionTimelineComponent } from './timeline'

@NgModule({
  declarations: [
    AppComponent,
    ExecutionTimelineComponent,
    TaskDetailsComponent,
    InstabilityDetailsComponent,
    ChangeDetectionDetailsComponent
  ],
  imports: [BrowserModule, TooltipModule],
  providers: [BridgeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
