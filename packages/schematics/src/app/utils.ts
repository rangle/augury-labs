import { normalize } from '@angular-devkit/core';
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

    const packageJsonFilePath = normalize(`${project.root}/package.json`);
    const packageJson = tree.read(packageJsonFilePath);

    if (!packageJson) {
      throw new SchematicsException(`package.json file was not found`);
    }

    const parsedPackageJson = JSON.parse(packageJson.toString());
    try {
      parsedPackageJson.scripts['start:augury'] = 'ng serve --configuration augury';

      // Save package.json file after configuration changes
      tree.overwrite(packageJsonFilePath, JSON.stringify(parsedPackageJson, null, '\t'));

      context.logger.info(`✅️ Added augury script to package.json`);
    } catch (error) {
      throw new SchematicsException(`Error while adding script: ${error}`);
    }

    return tree;
  };
}
