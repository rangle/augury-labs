import { Reaction, ReactionResult } from '../framework/reactions';
import { ReactionContext } from '../framework/reactions/reaction-context.interface';
import { Scanner } from '../framework/scanner';

export class ScanHistoryReaction extends Reaction {
  constructor() {
    super('scan-history');
  }

  public doReact(context: ReactionContext): ReactionResult | undefined {
    if (context.event.name === 'request-history-scan') {
      const { startEventId, endEventId } = context.event.payload;

      return {
        success: true,
        result: context.historyManager.elapsedEvents.reduce(
          (result: any, event) => {
            if (event.name === 'onStable') {
              if (event.id < startEventId) {
                result.lastComponentTree = event.payload.componentTree;
              } else if (event.id >= endEventId && result.nextComponentTree.length === 0) {
                result.nextComponentTree = event.payload.componentTree;
              }
            } else if (
              event.name === 'component_lifecycle_hook_invoked' &&
              event.id >= startEventId &&
              event.id <= endEventId
            ) {
              result.lifecycleHooksTriggered.push(event);
            }

            return result;
          },
          {
            lastComponentTree: [],
            nextComponentTree: [],
            lifecycleHooksTriggered: [],
          },
        ),
      };
    }
  }
}
