import { chain, Rule } from '@angular-devkit/schematics';

import { Schema } from '../app/schema';
import {
  addAuguryMain,
  addAuguryScriptToPackage,
  addBuildConfiguration,
  addPackageJsonDependencies,
  installDependencies,
  validateOptions,
} from '../app/utils';

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
