import { NgModule } from '@angular/core'
import { GridModule } from '@angular/flex-layout'
import { FlexModule } from '@angular/flex-layout/flex'
import { BrowserModule } from '@angular/platform-browser'
import { TooltipModule } from 'ng2-tooltip-directive'

import { AppComponent } from './app.component'
import { BridgeService } from './bridge.service'
import { CardComponent } from './card'
import { ChangeDetectionDetailsComponent } from './cd-details'
import { ExecutionTimelineComponent } from './execution-timeline'
import { InstabilityDetailsComponent } from './instability-details'
import { LegendComponent } from './legend';
import { TaskDetailsComponent } from './task-details'

@NgModule({
  declarations: [
    AppComponent,
    ExecutionTimelineComponent,
    TaskDetailsComponent,
    InstabilityDetailsComponent,
    ChangeDetectionDetailsComponent,
    CardComponent,
    LegendComponent,
  ],
  imports: [BrowserModule, TooltipModule, FlexModule, GridModule],
  providers: [BridgeService],
  bootstrap: [AppComponent],
})
export class AppModule { }
