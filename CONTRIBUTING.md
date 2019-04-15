# Contributing

:sparkling_heart: First things first, thank you for contributing. :sparkling_heart: We know it
takes a lot of time and effort.

## Code of Conduct

In the interest of making the Augury project a safe and friendly place for people from diverse
backgrounds, we'll be adhering to a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). As a
contributor, you'll be expected to uphold this code as well as report unacceptable behaviour to
[augury@rangle.io](mailto:augury@rangle.io).

## Got a Question or Problem?

If you have a general question reach out to us using one of the following methods:

- Open a [question issue](https://github.com/rangle/augury-labs/issues/new?template=question.md)
  in GitHub issues.
- Join us on the Augury [Slack](https://augury-slack.herokuapp.com/).

## Found a Bug?

- Please check if the bug was not already reported by searching on GitHub
  under [Issues](https://github.com/rangle/augury-labs/issues/new?template=bug_report.md).
- If you're unable to find an open issue addressing the problem, open a new one. Be sure to
  include a title and clear description, as much relevant information as possible.

## Missing a Feature?

You can request a new feature by
[submitting a feature request](https://github.com/rangle/augury-labs/issues/new?template=feature_request.md).
If you would like to implement a new feature, please submit an issue with a
proposal for your work first.

## Submitting a Pull Request (PR)

Pull requests are welcome. Make sure you read the [development guide](docs/development-guide.md)
guide for details on how to setup the development environment. Before submitting a pull request
please discuss the change via [issue](https://github.com/rangle/augury-labs/issues) first and then
open a [pull request](https://github.com/rangle/augury-labs/pulls).

See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## Cutting a Release

Publishing to `npm` is handled with `lerna`, which will update version numbers, create tagged
releases in GitHub and also publish the packages to npm.

**In order to publish to `npm` you'll need to be part of the `@augury` organization.**

Here are some examples for releasing different versions updates:

```sh
# release a patch (e.g. from 0.5.2 -> 0.5.3)
yarn release patch

# release a minor update (e.g. from 0.5.3 -> 0.6.0)
yarn release minor

# release a minor beta update (e.g. from 0.5.0 -> 0.6.0-beta.0)
yarn release preminor --preid beta --dist-tag beta

# patch a beta a minor beta patch (e.g. from 0.6.0-beta.0 -> 0.6.0-beta.1)
yarn release patch --preid beta --dist-tag beta

# release a major update (e.g. from 1.6.2 -> 2.0.0)
yarn release major
```

_See [`lerna publish`](https://github.com/lerna/lerna/tree/master/commands/publish)
for more details._
