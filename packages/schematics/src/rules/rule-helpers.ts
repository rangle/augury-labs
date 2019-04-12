import { Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import { getProject } from '@schematics/angular/utility/project';
import { WorkspaceTargets } from '@schematics/angular/utility/workspace-models';
import { get } from 'http';

import { NpmRegistryPackage } from '../types/npm-registry-package';

export function getWorkspaceProject(tree: Tree, projectName: string = '') {
  const workspace = getWorkspace(tree);
  const project = getProject(workspace, projectName || workspace.defaultProject!);
  return { workspace, project };
}

export function projectTargetsConfigurationFound(projectTargets: WorkspaceTargets): boolean {
  return !!(
    projectTargets.build! &&
    projectTargets.build!.configurations! &&
    projectTargets.serve! &&
    projectTargets.serve!.configurations!
  );
}

export function getLatestNodeVersion(packageName: string): Promise<NpmRegistryPackage> {
  const DEFAULT_VERSION = 'latest';

  return new Promise(resolve => {
    return get(`http://registry.npmjs.org/${packageName}`, res => {
      let rawData = '';
      res.on('data', chunk => (rawData += chunk));
      res.on('end', () => {
        try {
          const response = JSON.parse(rawData);
          const version = (response && response['dist-tags']) || {};

          resolve(buildPackage(response.name || packageName, version.latest));
        } catch (e) {
          resolve(buildPackage(packageName));
        }
      });
    }).on('error', () => resolve(buildPackage(packageName)));
  });

  function buildPackage(name: string, version: string = DEFAULT_VERSION): NpmRegistryPackage {
    return { name, version };
  }
}
