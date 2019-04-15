import { JsonAstObject, JsonParseMode, parseJsonAst } from '@angular-devkit/core';
import { SchematicsException, Tree } from '@angular-devkit/schematics';

export function readPackageJson(tree: Tree, packagePath: string = '/package.json'): JsonAstObject {
  const buffer = tree.read(packagePath);
  if (buffer === null) {
    throw new SchematicsException('Could not read package.json.');
  }
  const content = buffer.toString();

  const packageJson = parseJsonAst(content, JsonParseMode.Strict);
  if (packageJson.kind !== 'object') {
    throw new SchematicsException('Invalid package.json. Was expecting an object');
  }

  return packageJson;
}
