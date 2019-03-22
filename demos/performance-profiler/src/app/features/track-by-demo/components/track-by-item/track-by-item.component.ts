import { Component, Input } from '@angular/core';

import { TrackByDatum } from '../../types/track-by-datum.interface';

@Component({
  selector: 'al-track-by-item',
  templateUrl: './track-by-item.component.html',
  styleUrls: ['./track-by-item.component.scss']
})
export class TrackByItemComponent {
  @Input()
  public datum: TrackByDatum;

}
