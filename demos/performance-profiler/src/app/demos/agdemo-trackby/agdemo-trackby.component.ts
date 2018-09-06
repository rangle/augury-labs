import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { } from '@angular/forms';

@Component({
  selector: 'agdemo-trackby',
  template: `
    <div>
      <div>
        use trackBy: <input type="checkbox" [(ngModel)]="use">
      </div>
      <agdemo-trackby-with *ngIf="use"></agdemo-trackby-with>
      <agdemo-trackby-without *ngIf="!use"></agdemo-trackby-without>
    </div>
  `
})
export class AgDemoTrackByComponent {
  use = false
}

@Component({
  selector: 'agdemo-trackby-without',
  template: `
  <div>
    <div>
      replace: <input [(ngModel)]="target"> <br>
      with: <input [(ngModel)]="replacement"> <br>
      <button (click)="runUpdate()">run update</button>
    </div>
    <div>
      <agdemo-trackby-item *ngFor="let datum of data" [datum]="datum"></agdemo-trackby-item>
    <div>
  </div>`
})
export class AgDemoWithoutTrackByComponent {

  target = ''
  replacement = ''
  data = Array(1000)
    .fill(true)
    .map((_, i) => ({
      id: i,
      recentlyUpdated: false,
      content: randString(),
    }))

  runUpdate() {
    this.updateData(this.target, this.replacement)
  }

  updateData(target, replacement) {
    this.data = this.data.map(item => {
      const newContent = item.content.replace(target, replacement)
      return {
        id: item.id,
        recentlyUpdated: newContent !== item.content,
        content: newContent
      }
    })
  }

}

@Component({
  selector: 'agdemo-trackby-with',
  template: `
  <div>
    <div>
      replace: <input [(ngModel)]="target"> <br>
      with: <input [(ngModel)]="replacement"> <br>
      <button (click)="runUpdate()">run update</button>
    </div>
    <div>
      <agdemo-trackby-item *ngFor="let datum of data; trackBy: trackByFn" [datum]="datum"></agdemo-trackby-item>
    <div>
  </div>`
})
export class AgDemoWithTrackByComponent {

  target = ''
  replacement = ''
  data = Array(1000)
    .fill(true)
    .map((_, i) => ({
      id: i,
      recentlyUpdated: false,
      content: randString(),
    }))

  runUpdate() {
    this.updateData(this.target, this.replacement)
  }

  updateData(target, replacement) {
    this.data = this.data.map(item => {
      const newContent = item.content.replace(target, replacement)
      return {
        id: item.id,
        recentlyUpdated: newContent !== item.content,
        content: newContent
      }
    })
  }

  trackByFn(i, datum) {
    return datum.id
  }

}

@Component({
  selector: 'agdemo-trackby-item',
  template: `
  <div [style.color]="datum.recentlyUpdated? 'red' : 'black'">
    {{ datum.content }}
  </div>`
})
export class AgDemoTrackByItemComponent {

  @Input() datum

  constructor() {
    console.log('constructing item')
    for (let i; i < 100; i++);
  }

}


function randString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}