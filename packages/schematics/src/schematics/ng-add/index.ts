import { chain, Rule } from '@angular-devkit/schematics';

import { addAuguryMain } from '../../rules/add-augury-main.rule';
import { addAuguryScriptToPackage } from '../../rules/add-augury-scripts.rule';
import { addBuildConfiguration } from '../../rules/add-build-configuration.rule';
import { addPackageJsonDependencies } from '../../rules/add-package-json-dependencies.rule';
import { installDependencies } from '../../rules/install-node-packages.rule';
import { validateOptions } from '../../rules/validate-options.rule';
import { NgAddSchema } from '../../types/ng-add.schema';

export default function(options: NgAddSchema): Rule {
  return chain([
    validateOptions(options),
    addPackageJsonDependencies(),
    installDependencies(),
    addAuguryMain(options),
    addBuildConfiguration(options),
    addAuguryScriptToPackage(options),
  ]);
}
