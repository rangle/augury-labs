import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'input-output',
  templateUrl: './input-output.component.html',
  styleUrls: ['./input-output.component.css']
})
export class InputOutputComponent {
  message: string;
  name: string;
  num: number;
  parentCount: number;
  isOn = false;
  isDisabled = false;

  constructor() {
    this.num = 0;
    this.parentCount = 0;
  }

  onChange(val: any) {
    this.parentCount = val;
  }

  toggle(newState) {
    if (!this.isDisabled) {
      this.isOn = newState;
    }
  }

  displayMessage(data: any) {
    this.message = data.message;
    this.name = data.name;
  }
}
