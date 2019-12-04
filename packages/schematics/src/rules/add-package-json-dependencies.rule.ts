import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { getLatestNodeVersion } from '../rules/rule-helpers';
import { NpmRegistryPackage } from '../types/npm-registry-package';

export function addPackageJsonDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return of('@augury/core', '@augury/performance-profiler-plugin').pipe(
      concatMap(name => getLatestNodeVersion(name)),
      map((npmRegistryPackage: NpmRegistryPackage) => {
        const nodeDependency: NodeDependency = {
          type: NodeDependencyType.Dev,
          name: npmRegistryPackage.name,
          version: npmRegistryPackage.version,
          overwrite: false,
        };

        addPackageJsonDependency(tree, nodeDependency);
        context.logger.info(`✅️ Added ${nodeDependency.name} v.${nodeDependency.version}`);
        return tree;
      }),
    );
  };
}
