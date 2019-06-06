export interface SimpleChanges {
  currentValue?: any;
  firstChange?: boolean;
  previousValue?: any;
}

export interface MissingOnPushStrategy {
  componentInstance: any;
  changes: any;
}

export interface InsightsInfo {
  missingOnPushStrategy: MissingOnPushStrategy[];
}
