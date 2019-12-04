import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BaseAppModule } from './base-app.module';
import { AppComponent } from './components';

@NgModule({
  imports: [BrowserModule, CommonModule, BaseAppModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
