import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BaseAppModule } from './base-app.module';

@NgModule({
  imports: [BrowserModule, CommonModule, BaseAppModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
