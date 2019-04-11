import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

import { getWorkspace } from '@schematics/angular/utility/config';
import { getProject } from '@schematics/angular/utility/project';
import { getProjectTargets } from '@schematics/angular/utility/project-targets';
import { Schema } from './schema';

const testProjectName = 'test-project';

describe('Rules', () => {
  const collectionPath = path.join(__dirname, '../collection.json');
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

  const workspaceOptions: any = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '7.3.7',
  };

  const appOptions: any = {
    name: testProjectName,
  };

  const schemaOptions: Schema = {
    project: testProjectName,
  };

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = schematicRunner.runExternalSchematic(
      '@schematics/angular',
      'workspace',
      workspaceOptions,
    );
    appTree = schematicRunner.runExternalSchematic(
      '@schematics/angular',
      'application',
      appOptions,
      appTree,
    );
  });

  test('package.json should get updated', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematicAsync('ng-add', schemaOptions, appTree).toPromise();

    const packageJson = tree.readContent(`/package.json`);
    const packageJsonParsed = JSON.parse(packageJson);
    expect(Object.keys(packageJsonParsed.devDependencies)).toContain('@augury/core');
    expect(Object.keys(packageJsonParsed.devDependencies)).toContain(
      '@augury/performance-profiler-plugin',
    );
  });

  test('main.augury.ts should get added', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematicAsync('ng-add', schemaOptions, appTree).toPromise();
    const mainAugury = tree.readContent(`/projects/${testProjectName}/src/main.augury.ts`);

    expect(mainAugury).toContain(`auguryBootstrap`);
    expect(mainAugury).toContain(`new PerformanceProfilerPlugin`);
  });

  test('build configuration for augury should get added', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematicAsync('ng-add', schemaOptions, appTree).toPromise();

    const workspace = getWorkspace(tree);
    const project = getProject(workspace, schemaOptions.project);
    const projectTargets = getProjectTargets(project);

    expect(projectTargets.build!.configurations!.augury).toBeDefined();
    expect(projectTargets.build!.configurations!.augury).toEqual({
      fileReplacements: [
        {
          replace: 'src/main.ts',
          with: 'src/main.augury.ts',
        },
      ],
    });

    expect(projectTargets.serve!.configurations!.augury).toBeDefined();
    expect(projectTargets.serve!.configurations!.augury).toEqual({
      browserTarget: `${schemaOptions.project}:build:augury`,
    });
  });

  test('augury script should get added', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematicAsync('ng-add', schemaOptions, appTree).toPromise();

    const packageJson = tree.readContent(`/package.json`);
    const packageJsonParsed = JSON.parse(packageJson);
    expect(Object.keys(packageJsonParsed.scripts)).toContain('start:augury');
    expect(packageJsonParsed.scripts['start:augury']).toEqual('ng serve --configuration augury');
  });
});
