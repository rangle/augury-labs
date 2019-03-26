import { NgModule } from '@angular/core';
import { GridModule } from '@angular/flex-layout';
import { FlexModule } from '@angular/flex-layout/flex';
import { BrowserModule } from '@angular/platform-browser';
import { TooltipModule } from 'ng2-tooltip-directive';

import {
  AppComponent,
  ChangeDetectionDetailsComponent,
  ExecutionTimelineComponent,
  FlameGraphComponent,
  FooterComponent,
  HeaderComponent,
  HeaderControlsComponent,
  HeaderLogoComponent,
  InstabilityDetailsComponent,
  LegendComponent,
  LogoComponent,
  MainComponent,
  SegmentDetailsComponent,
  TaskDetailsComponent,
} from './components';
import { UiLibraryModule } from './modules/ui-library/ui-library.module';
import { BridgeService } from './services/bridge.service';

@NgModule({
  imports: [BrowserModule, TooltipModule, FlexModule, GridModule, UiLibraryModule],
  declarations: [
    AppComponent,
    ChangeDetectionDetailsComponent,
    ExecutionTimelineComponent,
    FlameGraphComponent,
    FooterComponent,
    HeaderComponent,
    HeaderControlsComponent,
    HeaderLogoComponent,
    InstabilityDetailsComponent,
    LegendComponent,
    LogoComponent,
    MainComponent,
    SegmentDetailsComponent,
    TaskDetailsComponent,
  ],
  providers: [BridgeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
