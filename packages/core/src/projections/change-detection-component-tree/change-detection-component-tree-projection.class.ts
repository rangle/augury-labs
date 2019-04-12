import { AuguryEvent } from '../../events';
import { mergeComponentTrees } from '../../probes/types/component-tree-node';
import { AuguryEventProjection } from '../augury-event-projection.class';
import { ChangeDetectionComponentTreeInfo } from './change-detection-component-tree-info.interface';
import { ChangeDetectionMergedComponentTree } from './change-detection-merged-component-tree.interface';
import { deriveCheckTimePerInstance, groupLifecycleHooksByInstance } from './utils';

export class ChangeDetectionComponentTreeProjection extends AuguryEventProjection<
  ChangeDetectionMergedComponentTree
> {
  private result: ChangeDetectionComponentTreeInfo = this.createInitialResultValue();

  constructor(private startEventId: number, private endEventId: number) {
    super();
  }

  public process(event: AuguryEvent): boolean {
    if (event.name === 'onStable') {
      if (event.id < this.startEventId) {
        this.result.previousComponentTree = event.payload.componentTree;
      } else if (event.id >= this.endEventId) {
        if (this.result.nextComponentTree.length === 0) {
          this.result.nextComponentTree = event.payload.componentTree;
        } else {
          return true;
        }
      }
    } else if (
      event.name === 'component_lifecycle_hook_invoked' &&
      event.isIdInRange(this.startEventId, this.endEventId)
    ) {
      this.result.lifecycleHooksTriggered.push(event);
    }

    return false;
  }

  protected getOutput(): ChangeDetectionMergedComponentTree | null {
    const mergedComponentTree = mergeComponentTrees(
      this.result.previousComponentTree,
      this.result.nextComponentTree,
    );

    return {
      mergedComponentTree,
      checkTimePerInstance: deriveCheckTimePerInstance(
        groupLifecycleHooksByInstance(this.result.lifecycleHooksTriggered),
        mergedComponentTree,
      ),
    };
  }

  protected cleanup() {
    this.result = this.createInitialResultValue();
  }

  private createInitialResultValue(): ChangeDetectionComponentTreeInfo {
    return {
      previousComponentTree: [],
      nextComponentTree: [],
      lifecycleHooksTriggered: [],
    };
  }
}
