import { NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AuguryCore } from '@augury/core';
import { PerformanceProfilerPlugin } from '@augury/performance-profiler-plugin';

import { AppModule } from './app/app.module';

AuguryCore.create({
  platform: platformBrowserDynamic,
  ngModule: AppModule,
  NgZone,
  plugins: [new PerformanceProfilerPlugin()],
});
