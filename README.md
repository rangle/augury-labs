# Augury Labs

> Experimental developer tools & instrumentation framework used to profile, inspect and
> troubleshoot [Angular](https://angular.io) web applications.

[![CircleCI](https://circleci.com/gh/rangle/augury-labs.svg?style=svg&circle-token=3b4d4e15a644445f9bf5d449fa5746ba774bfcdf)](https://circleci.com/gh/rangle/augury-labs) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE) [![Slack Status](https://augury-slack.herokuapp.com/badge.svg)](https://augury-slack.herokuapp.com) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

Augury Labs Performance Profiler Design Concept

![Angular Performance Profiler](screenshot.png 'Angular Performance Profiler')

## About

`Augury Labs` is a new instrumentation & inspection framework for [Angular](https://angular.io/)
applications that allows for easy installation of specialized developer tools. We have recently
released the `Performance Profiler Plugin`, which can help you tune the performance of your
applications by providing insights into the following:

- Details of Angular change detection & instability periods
- When [zone.js](https://github.com/angular/zone.js) tasks occur and what triggered them
- Component tree details for each instability period (structure, added, removed, etc.)
- When and how long change detection took with a breakdown for individual components
- A detailed timeline to illustrate and explore correlations

After installing and configuring the [npm packages](https://www.npmjs.com/org/augury/), you can run
your app while `augury-labs` collects raw data about the runtime characteristics of your application.
This raw data is then processed into more meaningful information that you can explore to gain
valuable insights into your applications runtime behaviour.

In the spirit of the [Augury DevTool Extension](https://github.com/rangle/augury/) we set out to
help Angular developers better understand how their applications are running and provide insights
into how they can make them better. Augury labs is a culmination of these idea and distrubted as a
set of npm packages & plugin system. We hope you find it useful!

For more information about how this works, please read the [architecture](docs/architecture.md)
guide.

_NOTE: This tool is still experimental. Feedback is greatly appreciated :smile:_

## Packages

- [@augury/core](https://www.npmjs.com/package/@augury/core) - The main package responsible for
  collecting raw data and communicating with registered plugins. Also contains the core bootstrap
  precedure that injects the instrumentation code into your application.
- [@augury/performance-profiler-plugin](https://www.npmjs.com/package/@augury/performance-profiler-plugin) -
  Opens a popup window dashboard, displaying the execution of your app as a timeline graph,
  showing the interaction between `Zone.js` tasks, Angular's stability cycles & change detection.

## Installation

To setup `augury-labs` in your application you'll need to follow a few manual steps for now
(should only take a few minutes).

_NOTE: The following assumes your application is a standard [Angular CLI](https://cli.angular.io/) setup._

1. Install the [npm packages](https://www.npmjs.com/org/augury/) as development dependencies.

   ```shell
   npm install -D @augury/core @augury/performance-profiler-plugin
   ```

1. Create a `src/main.augury.ts` file in your application with the following content:

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

1. Create new project `build` & `serve` configurations in the `angular.json` file.

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

1. Add a new npm script in your `package.json`to run the `Angular` application with the augury
   serve configuration you setup in the previous step.

   ```json
   "scripts": {
     "start:augury": "ng serve --configuration augury"
   }
   ```

1. Run your application with:

   ```shell
   npm run start:augury
   ```

## Guides

- [How to Use](docs/how-to-use.md)
- [Architecture](docs/architecture.md)
- [Development Guide](docs/development-guide.md)

## Demos

- [RealWorld example app with Augury Demo](https://github.com/rangle/angular-realworld-example-app-with-augury/)
- [Performance Profiler Demo](demos/README.md)

## Other Experiments

Here are some other unpublished experimental plugins:

- [Unit Tester](packages/plugins/unit-tester) - Proof of concept which allows programatic access
  to `@augury/core` to be used in `e2e` tests. This could be used to check for acceptable
  thresholds of runtime behaviour in specific areas of your application.

Have other ideas? See our [CONTRIBUTING](CONTRIBUTING.md) guide.

## Troubleshooting

If your having trouble running `augury-labs`, please submit a [GitHub Issue](https://github.com/rangle/augury-labs/issues).

### Known Issues

- Lazy loaded modules cannot currently be instrumented due to how `augury-labs` wraps the Angular
  boostrap process. [See GitHub Issue](https://github.com/rangle/augury-labs/issues/28).

- Large component trees can cause some performance issues. We are looking into ways to mitigate
  this. You can use the start & pause recording buttons on the specific areas you would like to
  profile. This will help reduce the performance impact to shorter profiling periods.

- Because the bootstrap code in this `main.augury.ts` file is different from Angular's bootstrap
  code you may need to tell the Angular CLI builder where is the main module of your application,
  adding a `"entryModule": "./app/app.module#AppModule"` to the `"angularCompilerOptions"` object
  of your application's `tsconfig.json` file. Replace the path and name of the module if you
  changed it from the defaults.

## Contributing

We'd love to have your helping hand on `augury-labs`! See [CONTRIBUTING.md](CONTRIBUTING.md) for more information on what we're looking for and how to get started.

## License

Augury Labs is open source software [licensed as MIT](LICENSE).
