import { Component } from '@angular/core';

import { createDefaultTrackByData, updateTrackByData } from '../../types/track-by-datum.functions';
import { TrackByDemoForm } from '../../types/track-by-demo-form.interface';

@Component({
  selector: 'al-track-by-demo',
  templateUrl: './track-by-demo.component.html'
})
export class TrackByDemoComponent {
  public useTrackBy: boolean;
  public data = createDefaultTrackByData();

  public update(form: TrackByDemoForm) {
    this.useTrackBy = form.useTrackBy;
    this.data = updateTrackByData(this.data, form.target, form.replacement);
  }
}
