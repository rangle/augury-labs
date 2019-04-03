import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'al-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
})
export class MainContentComponent {
  constructor(public router: Router) {}
}
