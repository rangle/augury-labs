import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BaseAppModule } from './base-app.module';
import { AppComponent } from './components';

@NgModule({
  imports: [BrowserModule, CommonModule, BaseAppModule],
  entryComponents: [AppComponent],
})
export class AppModule {
  constructor(private injector: Injector) {}

  public ngDoBootstrap() {
    const auguryUI = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('augury-ui', auguryUI);
  }
}
