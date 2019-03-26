import { Component, Input } from '@angular/core';

@Component({
  selector: 'ag-segment-details',
  templateUrl: './segment-details.component.html',
  styleUrls: ['./segment-details.component.scss'],
})
export class SegmentDetailsComponent {
  @Input()
  public segment;
}
