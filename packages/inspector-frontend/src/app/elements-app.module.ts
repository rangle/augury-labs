import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BaseAppModule } from './base-app.module';

@NgModule({
  imports: [BrowserModule, CommonModule, BaseAppModule],
  entryComponents: [AppComponent],
})
export class AppModule {
  constructor(private injector: Injector) {}

  public ngDoBootstrap() {
    const auguryUI = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('augury-inspector-ui', auguryUI);
  }
}
