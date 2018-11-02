# Development Guide

This project is a monorepo and uses [Lerna](https://github.com/lerna/lerna) &
[Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) to manage multiple packages.
The [tools package](./packages/tools) also provides common dev dependencies and configurations.

## Local Setup

```shell
# Install lerna globally
yarn global add lerna

# Install dependencies
yarn install

# Build all packages
yarn build
```

## Commands

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

## Running Demo Apps

Demo apps (found in `demos`) must have their dependencies installed separately, as they are not part of the yarn workspace.

For more info see `demos/README.md` (TLDR: go to demo directory and do `yarn; yarn start:augury` )

## Referencing local packages from other local projects

If you want to use your local version of the Augury Labs projects in another project that you have locally you can run the `lerna run link` command to run `yarn link` on the public packages of the monorepo. After doing this you can go to the project where you want to use them and run `yarn link` for each package that you want to reference. For example, if you want to reference both the `@augury/core` and `@augury/performance-profiler-plugin` packages:

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

## Building Plugins

We will be providing more documentation and guidance on how to build plugins to Augury Labs.
For now, please check the plugins provided in the repository.

## Publishing (Maintainers)

Lerna helps managing versions across packages along with publishing them.

```shell
yarn publish
```
