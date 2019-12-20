import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { components } from './components';

@NgModule({
  declarations: [AppComponent, ...components],
  imports: [BrowserModule],
})
export class BaseAppModule {}
