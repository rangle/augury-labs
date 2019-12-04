# Augury Labs

> Augury Labs is a project that provides developers with experimental tools and an instrumentation
> framework used to profile, inspect and troubleshoot [Angular](https://angular.io) applications.

[![CircleCI](https://circleci.com/gh/rangle/augury-labs.svg?style=svg&circle-token=3b4d4e15a644445f9bf5d449fa5746ba774bfcdf)](https://circleci.com/gh/rangle/augury-labs) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE) [![Slack Status](https://augury-slack.herokuapp.com/badge.svg)](https://augury-slack.herokuapp.com) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

![Angular Performance Profiler](docs/screenshot.png 'Angular Performance Profiler')

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
  procedure that injects the instrumentation code into your application.
- [@augury/performance-profiler-plugin](https://www.npmjs.com/package/@augury/performance-profiler-plugin) -
  Opens a popup window dashboard, displaying the execution of your app as a timeline graph,
  showing the interaction between `Zone.js` tasks, Angular's stability cycles & change detection.

## Installation

To setup `augury-labs` in your application you have two alternatives.

_NOTE: The following assumes your application is a standard [Angular CLI](https://cli.angular.io/) setup._

Using the Angular CLI `ng add` command will install the correct dependencies, perform the necessary configuration and execute initialization code.

```
ng add @augury/schematics
```

_DISCLAIMER: This assumes your application are using the Angular Devkit 6+_

To setup and install Augury manually, follow the [manual installation](docs/manual-installation.md).

## Guides

- [How to Use](docs/how-to-use.md)
- [Architecture](docs/architecture.md)
- [Development Guide](docs/development-guide.md)
- [Manual Installation](docs/manual-installation.md)

## Examples

- [Augury Examples](examples/README.md)
- [RealWorld example app with Augury](https://github.com/rangle/angular-realworld-example-app-with-augury/)

## Other Experiments

Here are some other unpublished experimental plugins:

- [Unit Tester](packages/plugins/unit-tester) - Proof of concept which allows programmatic access
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

We'd love to have your helping hand on `augury-labs`! See [CONTRIBUTING.md](CONTRIBUTING.md) for
more information on what we're looking for and how to get started.

## License

Augury Labs is open source software [licensed as MIT](LICENSE).
