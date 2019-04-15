import { MergedComponentTreeNode } from '../../probes/types/component-tree-node';
import { ComponentTypeChangeDetectionFrequency } from './component-type-change-detection-frequency.interface';

export interface ComponentTreeChangesInfo {
  mergedComponentTree: MergedComponentTreeNode[];
  lifeCycleChecksPerComponentInstance: Map<any, number>;
  componentTypeChangeDetectionFrequencies: ComponentTypeChangeDetectionFrequency[];
}
