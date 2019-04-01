import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TimelineOptions } from '../../types/timeline-options/timeline-options.interface';

@Component({
  selector: 'ag-timeline-options',
  templateUrl: './timeline-options.component.html',
  styleUrls: ['./timeline-options.component.scss'],
})
export class TimelineOptionsComponent implements OnInit {
  @Input()
  public form: TimelineOptions;

  @Output()
  public changed = new EventEmitter<TimelineOptions>();

  public formGroup: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      showAuguryDrag: [''],
    });
  }

  public ngOnInit(): void {
    this.formGroup.controls.showAuguryDrag.setValue(this.form.showAuguryDrag);
  }
}
