# Augury Labs

> Angular experimental debugging & diagnostic tools

[![CircleCI](https://circleci.com/gh/rangle/augury-labs.svg?style=svg&circle-token=3b4d4e15a644445f9bf5d449fa5746ba774bfcdf)](https://circleci.com/gh/rangle/augury-labs) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE) [![Slack Status](https://augury-slack.herokuapp.com/badge.svg)](https://augury-slack.herokuapp.com) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

## About

The `augury-labs` project is a set of developer tools to help aid with [Angular](https://angular.io) development.

## Getting Started

TODO - Document augury bootstrapping & plugin setup

## Concepts

TODO - Describe the high level concepts of the infrastructure

## Building Plugins

TODO

## Local Development

This project is a monorepo and uses [Lerna][https://github.com/lerna/lerna] & [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) to manage multiple packages. The [tools package](./pacakges/tools)
also provides common dev dependencies and configurations.

### Local Setup

```sh
# Install lerna globally
npm install -g lerna

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

### Publishing Packages

Lerna helps managing versions across packages along with publishing them. Changelogs can be generated using `yarn changelog` (using `lerna-changelog`).

TODO - Document version bump, changelong, & publishing procedure

## Contributing

We'd love to have your helping hand on augury-labs! See [CONTRIBUTING.md](./github/contributing.md) for more information on what we're looking for and how to get started.

## License

Augury Labs is open source software [licensed as MIT](./LICENSE).
