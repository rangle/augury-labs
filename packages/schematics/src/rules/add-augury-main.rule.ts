import {
  apply,
  branchAndMerge,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { normalize } from 'path';
import { NgAddSchema } from 'src/types/ng-add.schema';

import { getWorkspaceProject } from './rule-helpers';

export function addAuguryMain(options: NgAddSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const project = getWorkspaceProject(tree, options.project).project;

    if (!project || !project.sourceRoot) {
      throw new SchematicsException(`Project root could not be found`);
    }

    const sourceDir = normalize(project.sourceRoot);
    const templateSource = apply(url('./files'), [
      template({
        options,
      }),
      move(sourceDir),
    ]);

    context.logger.info(`✅️ Adding main.augury.ts...`);

    return branchAndMerge(mergeWith(templateSource))(tree, context);
  };
}
