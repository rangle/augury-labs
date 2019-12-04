import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-tooltip-directive';
import {
  AppComponent,
  ChangeDetectionDetailsComponent,
  FlameGraphComponent,
  FooterComponent,
  HeaderComponent,
  HeaderControlsComponent,
  HeaderLogoComponent,
  HeaderMenuComponent,
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TooltipModule, UiLibraryModule],
  declarations: [
    AppComponent,
    ChangeDetectionDetailsComponent,
    FlameGraphComponent,
    FooterComponent,
    HeaderComponent,
    HeaderControlsComponent,
    HeaderLogoComponent,
    HeaderMenuComponent,
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
})
export class BaseAppModule {}
