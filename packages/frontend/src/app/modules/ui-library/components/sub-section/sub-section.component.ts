import { Component, Input } from '@angular/core';

@Component({
  selector: 'ag-sub-section',
  templateUrl: './sub-section.component.html',
  styleUrls: ['./sub-section.component.scss'],
})
export class SubSectionComponent {
  @Input()
  public label: string;
}
