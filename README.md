# Augury Labs

> Angular experimental debugging & diagnostic tools

[![CircleCI](https://circleci.com/gh/rangle/augury-labs.svg?style=svg&circle-token=3b4d4e15a644445f9bf5d449fa5746ba774bfcdf)](https://circleci.com/gh/rangle/augury-labs) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE) [![Slack Status](https://augury-slack.herokuapp.com/badge.svg)](https://augury-slack.herokuapp.com) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

## About

The `augury-labs` project is a set of developer tools to help aid with [Angular](https://angular.io) development.

## Getting Started

To run your app under Augury Labs you should call the `auguryBootstrap` function exported by `@augury/core`,
passing your app module, your platform factory, the `NgZone` service, and an array of Augury Labs plugin instances that
you want to use:

```ts
auguryBootstrap({
  platform: platformBrowserDynamic,
  ngModule: AppModule,
  NgZone,
  plugins: [new PerformanceProfilerPlugin()],
});
```

We recommend that you use a separate `main.augury.ts` file alongside your `main.ts` file so you can choose
to under Augury Labs or not (you can even have different files and configurations for different sets of
Augury Labs plugins). For a typical `main.ts` generated by the Angular CLI the `main.augury.ts` file will
look like this:

```ts
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { NgZone } from '@angular/core';
import { auguryBootstrap } from '@augury/core';
import { PerformanceProfilerPlugin } from '@augury/performance-profiler-plugin';

if (environment.production) {
  enableProdMode();
}

auguryBootstrap({
  platform: platformBrowserDynamic,
  ngModule: AppModule,
  NgZone,
  plugins: [new PerformanceProfilerPlugin()],
});
```

Notice how the call to `auguryBootstrap` completely replaces the instatiation of
`platformBrowserDynamic` and subsequent `bootstrapModule` method call.

Because the bootstrap code in this `main.augury.ts` file is different from Angular's
bootstrap code you need to tell the Angular CLI builder where is the main module of
your application, adding a `"entryModule": "./app/app.module#AppModule"` to
the `"angularCompilerOptions"` object of your application's `tsconfig.json` file.
Replace the path and name of the module if you changed it from the defaults.

Finally, in order to use this alternative main file instead of the usual one when
serving your app with the development server, you need to add
a new `augury` configuration to the `angular.json` file. Do it in two places, first as
a build configuration (look for your project under `"projects"`, then look under `"architect"`
for the `"build"` object, and look inside that for the `"configurations" object):

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

The second place is as a serve configuration, replacing `<your-project>` with the
name of your project under `angular.json` (this object is also under `"architect"`, but inside the `"serve"`
object, under `"configurations"`):

```json
            "augury": {
              "browserTarget": "<your-project>:build:augury"
            }
```

After that you should be able to run `ng serve -c augury` to run a development version of your
application under Augury Labs, add that as a command (`start:augury`, for example) to your `package.json`
so you can do it more easily.

## Concepts

Augury Labs has a new architecture different from the architecture
of the [Augury DevTools](https://github.com/rangle/augury), with
a modular, UI-agnostic design based on an event-driven core. We will
be publishing more in-depth documentation about this new architecture.

## Building Plugins

We will be providing more documentation and guidance on how to build plugins to
Augury Labs. For now, please check the plugins provided in the repository.

## Local Development

This project is a monorepo and uses [Lerna](https://github.com/lerna/lerna) & [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) to manage multiple packages. The [tools package](./packages/tools)
also provides common dev dependencies and configurations.

### Local Setup

```sh
# Install lerna globally
yarn global add lerna

# Install dependencies
yarn install

# Build all packages
yarn build
```

### Commands

In most cases yarn commands should only be run in the root directory as lerna will take care of
running the appropriate commands on sub packages.

The following commands will run across packages:

- `yarn build`
- `yarn build:watch`
- `yarn build`
- `yarn clean`
- `yarn test`
- `yarn test:watch`
- `yarn coverage`
- `yarn lint`

### Running Demo Apps

Demo apps (found in `demos`) must have their dependencies installed separately, as they are not part of the yarn workspace.

For more info see `demos/README.md` (TLDR: go to demo directory and do `yarn; yarn start:augury` )

### Referencing local packages from other local projects

If you want to use your local version of the Augury Labs projects in another
project that you have locally you can run the `lerna run link` command to run
`yarn link` on the public packages of the monorepo. After doing this you can
go to the project where you want to use them and run `yarn link` for each
package that you want to reference. For example, if you want to reference
both the `@augury/core` and `@augury/performance-profiler-plugin` packages:

```sh
# In the Augury Labs root:
lerna run link

# In the root of your local Angular app:
yarn link @augury/core
yarn link @augury/performance-profiler-plugin
```

After doing this you can `import ... from '@angular/core'` or
`import ... from '@angular/performance-profiler-plugin'` exactly like you
would do as if you had installed those packages, but the local versions will
be used.

### Publishing Packages

Lerna helps managing versions across packages along with publishing them. We will provide
documentation specific to the Augury Labs project to contributing developers soon.

## Contributing

We'd love to have your helping hand on augury-labs! We will have full documentation for contributors shortly,
but in the meantime talk to us if you would like to help.

## License

Augury Labs is open source software [licensed as MIT](./LICENSE).
