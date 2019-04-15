import { NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { auguryBootstrap } from '@augury/core';
import { PerformanceProfilerPlugin } from '@augury/performance-profiler-plugin';

import { AppModule } from './app/app.module';

auguryBootstrap({
  platform: platformBrowserDynamic,
  ngModule: AppModule,
  NgZone,
  plugins: [new PerformanceProfilerPlugin()],
});
