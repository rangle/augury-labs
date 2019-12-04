import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import {
  appendPropertyInAstObject,
  findPropertyInAstObject,
  insertPropertyInAstObjectInOrder,
} from '@schematics/angular/utility/json-utils';

import { NpmScript } from '../../types/npm-script';
import { readPackageJson } from '../ast-helpers';

export function addScriptToPackageJson(
  tree: Tree,
  script: NpmScript,
  packagePath: string = '/package.json',
) {
  const packageJsonAst = readPackageJson(tree);
  const scriptsNode = findPropertyInAstObject(packageJsonAst, 'scripts');
  const recorder = tree.beginUpdate(packagePath);

  if (!scriptsNode) {
    // Haven't found the script key, add it to the root of the package.json.
    appendPropertyInAstObject(
      recorder,
      packageJsonAst,
      'scripts',
      {
        [script.key]: script.command,
      },
      2,
    );
  } else if (scriptsNode.kind === 'object') {
    // check if script already added
    const scriptNode = findPropertyInAstObject(scriptsNode, script.key);

    if (!scriptNode) {
      // Package not found, add it.
      insertPropertyInAstObjectInOrder(recorder, scriptsNode, script.key, script.command, 4);
    }
  }

  tree.commitUpdate(recorder);
}
