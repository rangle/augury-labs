import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { updateWorkspace } from '@schematics/angular/utility/config';
import { getProjectTargets } from '@schematics/angular/utility/project-targets';

import { NgAddSchema } from '../types/ng-add.schema';
import { getWorkspaceProject, projectTargetsConfigurationFound } from './rule-helpers';

export function addBuildConfiguration(options: NgAddSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const { workspace, project } = getWorkspaceProject(tree, options.project);
    const projectTargets = getProjectTargets(project);

    if (!projectTargetsConfigurationFound(projectTargets)) {
      throw new SchematicsException("Project build configuration couldn't be found.");
    }

    projectTargets.build!.configurations!.augury = {
      fileReplacements: [
        {
          replace: 'src/main.ts',
          with: 'src/main.augury.ts',
        },
      ],
    };

    projectTargets.serve!.configurations!.augury = {
      browserTarget: `${options.project}:build:augury`,
    };

    context.logger.info(`✅️ Added augury build configuration to angular.json`);

    return updateWorkspace(workspace)(tree, context) as Tree;
  };
}
