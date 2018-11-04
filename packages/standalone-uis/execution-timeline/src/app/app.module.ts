import { NgModule, Injectable } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { TooltipModule } from 'ng2-tooltip-directive'

import { AppComponent } from './app.component'
import { BridgeService } from './bridge.service'
import { ChangeDetectionDetailsComponent } from './cd-details'
import { InstabilityDetailsComponent } from './instability-details'
import { TaskDetailsComponent } from './task-details'
import { ExecutionTimelineComponent } from './timeline'
import { FlexModule } from '@angular/flex-layout/flex'
import { GridModule } from '@angular/flex-layout'
import { CardComponent } from './card'
import { LegendComponent } from './legend';

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
