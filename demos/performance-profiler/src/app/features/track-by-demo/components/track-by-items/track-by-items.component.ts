import { Component, Input } from '@angular/core';

import { TrackByDatum } from '../../types/track-by-datum.interface';

@Component({
  selector: 'al-track-by-items',
  templateUrl: './track-by-items.component.html'
})
export class TrackByItemsComponent {
  @Input()
  public useTrackBy: boolean;

  @Input()
  public data;

  public trackByDatum(index, datum: TrackByDatum) {
    return datum ? datum.id : null;
  }
}
