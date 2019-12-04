import { Component, Input } from '@angular/core';
import { Segment } from '../../types/segment/segment.interface';

@Component({
  selector: 'ag-segment-details',
  templateUrl: './segment-details.component.html',
  styleUrls: ['./segment-details.component.scss'],
})
export class SegmentDetailsComponent {
  @Input()
  public segment: Segment<any>;
}
