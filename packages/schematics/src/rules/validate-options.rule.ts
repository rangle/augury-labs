import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';

import { NgAddSchema } from 'src/types/ng-add.schema';
import { getWorkspaceProject } from './rule-helpers';

export function validateOptions(options: NgAddSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!options.project || options.project === '') {
      throw new SchematicsException('You need to enter project name');
    }

    const project = getWorkspaceProject(tree, options.project).project;

    if (!project) {
      throw new SchematicsException(`Could not find project: '${options.project}'`);
    }

    return tree;
  };
}
