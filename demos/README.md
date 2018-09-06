# Augury Labs Demos

## Instructions

1) build Augury Labs workspace (from the repository root)
  * `yarn` (from repo root)
  * `yarn build` or `yarn build:watch` (from repo root)
2) serve specific demo project (from the specific demo directory)
  * `yarn` (from demo dir)
  * `yarn start:augury` or `yarn start` (from demo dir)

## Configuration patterns of Augury Labs demos

### These demos are not part of the Augury Labs yarn workspace. 
  
This is because, while all Augury Labs packages needs to interoperate and share dependencies, demos
have particular individual needs that may clash with each other and cause various complications. 
Some Examples: 
  * Demos might want to showcase Augury's compatibility with particular versions of Angular. 
  * Projects built using the standard `@angular/cli` do not play nice with lerna/yarn workspaces.
  
As such, they have their dependencies installed separately. Dependencies are kept in the demo's own `node_modules` folder.

### Demos do not declare `@augury/*` packages in their package.json

Since they are installed independently, in order for the demos to use the `@augury/*` modules directly from `packages/*`, they do not declare these dependencies, as doing so would result in the `@augury/*` packages being fetched from the npm registry.

To accomplish this, the demo projects rely on the workspace to have been built a priori. The undeclared packages are then found by the node module resolver in the `node_modules` folder at the repository root.

This allows us to run watchers on the workspace as well as individual demo projects, triggering reloads on changes to either workspace or demo code.
