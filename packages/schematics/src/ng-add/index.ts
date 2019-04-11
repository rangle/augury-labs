import { chain, Rule } from '@angular-devkit/schematics';

import {
  addAuguryMain,
  addAuguryScriptToPackage,
  addBuildConfiguration,
  addPackageJsonDependencies,
  installDependencies,
  validateOptions,
} from '../app/rules';
import { Schema } from '../app/schema';

export default function(options: Schema): Rule {
  return chain([
    validateOptions(options),
    addPackageJsonDependencies(),
    installDependencies(),
    addAuguryMain(options),
    addBuildConfiguration(options),
    addAuguryScriptToPackage(options),
  ]);
}
