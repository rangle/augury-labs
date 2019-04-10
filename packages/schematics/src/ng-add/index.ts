import { chain, Rule } from '@angular-devkit/schematics';

import { Schema } from '../app/schema';
import {
  addAuguryMain,
  addAuguryScriptToPackage,
  addBuildConfiguration,
  addPackageJsonDependencies,
  installDependencies,
} from '../app/utils';

export default function(options: Schema): Rule {
  return chain([
    addPackageJsonDependencies(),
    installDependencies(),
    addAuguryMain(options),
    addBuildConfiguration(options),
    addAuguryScriptToPackage(options),
  ]);
}
