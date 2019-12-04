import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'al-track-by-demo-form',
  templateUrl: './track-by-demo-form.component.html',
})
export class TrackByDemoFormComponent implements OnInit {
  @Output()
  public updated = new EventEmitter<boolean>();

  public formGroup: FormGroup;

  public ngOnInit(): void {
    this.formGroup = new FormBuilder().group({
      useTrackBy: [false],
      target: [''],
      replacement: [''],
    });
  }
}
