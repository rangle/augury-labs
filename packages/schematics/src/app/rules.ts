import { JsonAstObject, JsonParseMode, normalize, parseJsonAst } from '@angular-devkit/core';
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
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { getWorkspace, updateWorkspace } from '@schematics/angular/utility/config';
import {
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import {
  appendPropertyInAstObject,
  findPropertyInAstObject,
  insertPropertyInAstObjectInOrder,
} from '@schematics/angular/utility/json-utils';
import { getProject } from '@schematics/angular/utility/project';
import { getProjectTargets } from '@schematics/angular/utility/project-targets';
import { of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { getLatestNodeVersion, NpmRegistryPackage } from './npmjs-utils';
import { Schema } from './schema';

export function validateOptions(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!options.project || options.project === '') {
      throw new SchematicsException('You need to enter project name');
    }

    const workspace = getWorkspace(tree);
    const project = getProject(workspace, options.project);

    if (!project) {
      throw new SchematicsException(`Could not find project: '${options.project}'`);
    }

    return tree;
  };
}

export function addPackageJsonDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return of('@augury/core', '@augury/performance-profiler-plugin').pipe(
      concatMap(name => getLatestNodeVersion(name)),
      map((npmRegistryPackage: NpmRegistryPackage) => {
        const nodeDependency: NodeDependency = {
          type: NodeDependencyType.Dev,
          name: npmRegistryPackage.name,
          version: npmRegistryPackage.version,
          overwrite: false,
        };
        addPackageJsonDependency(tree, nodeDependency);
        context.logger.info(`✅️ Added ${nodeDependency.name} v.${nodeDependency.version}`);
        return tree;
      }),
    );
  };
}

export function installDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.info('✅️ Dependencies installed');
    return tree;
  };
}

export function addAuguryMain(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = getProject(workspace, options.project);

    if (!project || !project.sourceRoot) {
      throw new SchematicsException(`Project root could not be found`);
    }

    const sourceDir = normalize(project.sourceRoot);
    const templSource = apply(url('./files'), [
      template({
        ...options,
      }),
      move(sourceDir),
    ]);

    context.logger.info(`✅️ Adding main.augury.ts...`);

    return branchAndMerge(mergeWith(templSource))(tree, context);
  };
}

export function addBuildConfiguration(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = getProject(workspace, options.project);
    const projectTargets = getProjectTargets(project);

    if (
      !projectTargets.build ||
      !projectTargets.build.configurations ||
      !projectTargets.serve ||
      !projectTargets.serve.configurations
    ) {
      throw new SchematicsException("Project build configuration couldn't be found.");
    }

    projectTargets.build.configurations = {
      ...projectTargets.build.configurations,
      augury: {
        fileReplacements: [
          {
            replace: 'src/main.ts',
            with: 'src/main.augury.ts',
          },
        ],
      },
    };

    projectTargets.serve.configurations = {
      ...projectTargets.serve.configurations,
      augury: {
        browserTarget: `${options.project}:build:augury`,
      },
    };

    context.logger.info(`✅️ Added augury build configuration to angular.json`);

    return updateWorkspace(workspace)(tree, context) as Tree;
  };
}

export function addAuguryScriptToPackage(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = getProject(workspace, options.project);

    if (!project || !project.sourceRoot) {
      throw new SchematicsException(`Project root could not be found`);
    }

    const packageJsonAst = _readPackageJson(tree);
    const scriptsNode = findPropertyInAstObject(packageJsonAst, 'scripts');

    const auguryScript = {
      name: 'start:augury',
      command: 'ng serve --configuration augury',
    };

    const recorder = tree.beginUpdate('/package.json');
    if (!scriptsNode) {
      // Haven't found the script key, add it to the root of the package.json.
      appendPropertyInAstObject(
        recorder,
        packageJsonAst,
        'scripts',
        {
          [auguryScript.name]: auguryScript.command,
        },
        2,
      );
    } else if (scriptsNode.kind === 'object') {
      // check if script already added
      const scriptNode = findPropertyInAstObject(scriptsNode, auguryScript.name);

      if (!scriptNode) {
        // Package not found, add it.
        insertPropertyInAstObjectInOrder(
          recorder,
          scriptsNode,
          auguryScript.name,
          auguryScript.command,
          4,
        );
      }
    }

    tree.commitUpdate(recorder);

    context.logger.info(`✅️ Added augury script to package.json`);

    return tree;
  };
}

function _readPackageJson(tree: Tree): JsonAstObject {
  const buffer = tree.read('/package.json');
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
