import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { appRoutes } from './app.routes';
import { AppComponent, MainContentComponent, NavigationComponent } from './components';
import { HomeModule } from './features/home/home.module';
import { HoverDemoModule } from './features/hover-demo/hover-demo.module';
import { OnPushDemoModule } from './features/on-push-demo/on-push-demo.module';
import { OutsideAngularDemoModule } from './features/outside-angular-demo/outside-angular-demo.module';
import { TrackByDemoModule } from './features/track-by-demo/track-by-demo.module';

@NgModule({
  declarations: [AppComponent, MainContentComponent, NavigationComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),

    HomeModule,
    HoverDemoModule,
    OnPushDemoModule,
    OutsideAngularDemoModule,
    TrackByDemoModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
