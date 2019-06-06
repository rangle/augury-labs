import { AuguryEvent, ComponentLifecycleMethodInvokedEvent } from '../../events';
import { isEqual } from '../../utils';
import { EventProjection } from '../event-projection.class';
import { InsightsInfo } from './insights-info.interface';

export class InsightsInfoProjection extends EventProjection<InsightsInfo> {
  private insightsInfo: InsightsInfo = {
    missingOnPushStrategy: [],
  };

  public process(event: AuguryEvent): boolean {
    if (event.isInstanceOf(ComponentLifecycleMethodInvokedEvent)) {
      const componentLifecycleMethodInvokedEvent = event as ComponentLifecycleMethodInvokedEvent;
      if (componentLifecycleMethodInvokedEvent.hookMethod === 'ngOnChanges') {
        const params = componentLifecycleMethodInvokedEvent.parameters;
        if (params.length > 0) {
          const hasNoChanges = params.filter(changes => {
            for (const key in changes) {
              if (!isEqual(changes[key].previousValue, changes[key].currentValue)) {
                return false;
              }
            }
            return true;
          });

          if (hasNoChanges.length === params.length) {
            this.insightsInfo.missingOnPushStrategy.push({
              componentInstance: componentLifecycleMethodInvokedEvent.componentInstance,
              changes: params,
            });
            return true;
          }
        }
      }
    }

    return false;
  }

  protected getResult(): InsightsInfo {
    return this.insightsInfo;
  }

  protected cleanup() {
    this.insightsInfo = {
      missingOnPushStrategy: [],
    };
  }
}
