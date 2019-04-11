import { AuguryEvent } from '../../events';
import { AuguryEventProjection } from '../augury-event-projection.class';
import { ChangeDetectionComponentTree } from './change-detection-component-tree.interface';

export class ChangeDetectionComponentTreeProjection extends AuguryEventProjection<
  ChangeDetectionComponentTree
> {
  private result: ChangeDetectionComponentTree = this.createInitialResultValue();

  constructor(private startEventId: number, private endEventId: number) {
    super();
  }

  public process(event: AuguryEvent): boolean {
    if (event.name === 'onStable') {
      if (event.id < this.startEventId) {
        this.result.lastComponentTree = event.payload.componentTree;
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

  protected getOutput(): ChangeDetectionComponentTree | null {
    return this.result as ChangeDetectionComponentTree;
  }

  protected cleanup() {
    this.result = this.createInitialResultValue();
  }

  private createInitialResultValue(): ChangeDetectionComponentTree {
    return {
      lastComponentTree: [],
      nextComponentTree: [],
      lifecycleHooksTriggered: [],
    };
  }
}
