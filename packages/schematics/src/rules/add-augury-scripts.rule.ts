import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';

import { addScriptToPackageJson } from '../ast/add-script-to-package-json/add-script-to-package-json';
import { NgAddSchema } from '../types/ng-add.schema';
import { NpmScript } from '../types/npm-script';
import { getWorkspaceProject } from './rule-helpers';

export function addAuguryScriptToPackage(options: NgAddSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const project = getWorkspaceProject(tree, options.project).project;

    if (!project || !project.sourceRoot) {
      throw new SchematicsException(`Project root could not be found`);
    }

    const auguryScript: NpmScript = {
      key: 'start:augury',
      command: 'ng serve --configuration augury',
    };

    addScriptToPackageJson(tree, auguryScript);

    context.logger.info(`✅️ Added augury script to package.json`);

    return tree;
  };
}
