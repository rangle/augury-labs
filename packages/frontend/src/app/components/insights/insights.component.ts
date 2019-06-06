import { Component, Input } from '@angular/core';
import { InsightsInfo } from '@augury/core';

@Component({
  selector: 'ag-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss'],
})
export class InsightsComponent {
  @Input() public insights: InsightsInfo[];
}
