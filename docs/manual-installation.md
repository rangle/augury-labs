# Manual Installation

To setup `augury-labs` in your application you'll need to follow a few manual steps for now
(should only take a few minutes).

_NOTE: The following assumes your application is a standard [Angular CLI](https://cli.angular.io/) setup._

1. Install the [npm packages](https://www.npmjs.com/org/augury/) as development dependencies.

   ```shell
   npm install -D @augury/core @augury/performance-profiler-plugin
   ```

2. Create a `src/main.augury.ts` file in your application with the following content:

   ```ts
   import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
   import { NgZone } from '@angular/core';

   import { AppModule } from './app/app.module';

   import { auguryBootstrap } from '@augury/core';
   import { PerformanceProfilerPlugin } from '@augury/performance-profiler-plugin';

   auguryBootstrap({
     platform: platformBrowserDynamic,
     ngModule: AppModule,
     NgZone,
     plugins: [new PerformanceProfilerPlugin()],
   });
   ```

3. Create new project `build` & `serve` configurations in the `angular.json` file.

   Under `projects / [project-name] / architect / build / configurations` add:

   ```json
   "augury": {
     "fileReplacements": [
       {
         "replace": "src/main.ts",
         "with": "src/main.augury.ts"
       }
     ]
   }
   ```

   Under `projects / [project-name] / architect / serve / configurations` add:

   ```json
   "augury": {
     "browserTarget": "<your-project>:build:augury"
   }
   ```

4. Add a new npm script in your `package.json` to run the `Angular` application with the augury
   serve configuration you setup in the previous step.

   ```json
   "scripts": {
     "start:augury": "ng serve --configuration augury"
   }
   ```

5. Run your application with:

   ```shell
   npm run start:augury
   ```
