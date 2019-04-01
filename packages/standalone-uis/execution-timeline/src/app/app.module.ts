import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridModule } from '@angular/flex-layout';
import { FlexModule } from '@angular/flex-layout/flex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TooltipModule } from 'ng2-tooltip-directive';
import {
  AppComponent,
  ChangeDetectionDetailsComponent,
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
  TimelineComponent,
  TimelineOptionsComponent,
} from './components';
import { UiLibraryModule } from './modules/ui-library/ui-library.module';
import { BridgeService } from './services/bridge.service';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    FlexModule,
    GridModule,
    UiLibraryModule,
  ],
  declarations: [
    AppComponent,
    ChangeDetectionDetailsComponent,
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
    TimelineComponent,
    TimelineOptionsComponent,
  ],
  providers: [BridgeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
