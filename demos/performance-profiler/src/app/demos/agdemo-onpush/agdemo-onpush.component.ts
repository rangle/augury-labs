import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import {} from '@angular/forms';

const numOfItems = 10;

@Component({
  selector: 'agdemo-without-onpush',
  template: `
    <div>
      <div>
        use onpush: <input type="checkbox" [(ngModel)]="use">
      </div>
      <agdemo-onpush-with *ngIf="use"></agdemo-onpush-with>
      <agdemo-onpush-without *ngIf="!use"></agdemo-onpush-without>
    </div>
  `,
})
export class AgDemoOnPushComponent {
  use = false;
}

@Component({
  selector: 'agdemo-onpush-with',
  template: `
  <div>
    <div>
      <button (click)="count()">increment unrelated counter</button> {{ num }}
    </div>
    <br/>
    <h4>
      <button (click)="addList()">add list</button>
    </h4>
    <ul>
      <li *ngFor="let list of lists">
        <agdemo-list-onpush [list]="list">
          <button (click)="removeList(list)">remove list</button>
        </agdemo-list-onpush>
      </li>
    </ul>
  </div>`,
})
export class AgDemoWithOnPushComponent {
  num = 0;
  lists: Array<any> = [];

  constructor() {
    for (let i = 0; i < numOfItems; i++) { this.addList(); }
  }

  count() {
    this.num++;
  }

  addList() {
    this.lists.unshift(makeList());
  }

  removeList(list) {
    this.lists = this.lists.filter(l => l !== list);
  }
}

@Component({
  selector: 'agdemo-onpush-without',
  template: `
  <div>
    <div>
      <button (click)="count()">increment unrelated counter</button> {{ num }}
    </div>
    <br/>
    <h4>
      <button (click)="addList()">add list</button>
    </h4>
    <ul>
      <li *ngFor="let list of lists">
        <agdemo-list [list]="list">
          <button (click)="removeList(list)">remove list</button>
        </agdemo-list>
      </li>
    </ul>
  </div>`,
})
export class AgDemoWithoutOnPushComponent {
  num = 0;
  lists: Array<any> = [];

  constructor() {
    for (let i = 0; i < numOfItems; i++) { this.addList(); }
  }

  count() {
    this.num++;
  }

  addList() {
    this.lists.unshift(makeList());
  }

  removeList(list) {
    this.lists = this.lists.filter(l => l !== list);
  }
}

@Component({
  selector: 'agdemo-list-onpush',
  template: `
    <h5>list {{ list.id }} <button (click)="addItem()"> add item </button> <ng-content></ng-content></h5>
    <ul>
      <li *ngFor="let item of list.items; trackBy: trackByFn">
        <agdemo-item-onpush [item]="item"></agdemo-item-onpush>
        <button (click)="removeItem(item)"> remove item </button>
      </li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgDemoListWithOnPushComponent {
  @Input()
  list: any;

  addItem() {
    this.list.items.unshift(makeItem());
  }

  removeItem(item) {
    this.list.items = this.list.items.filter(i => i !== item);
  }
}

@Component({
  selector: 'agdemo-item-onpush',
  template: `
    item {{ item.id }}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgDemoItemWithOnPushComponent {
  @Input()
  item;
}

@Component({
  selector: 'agdemo-list',
  template: `
    <h5>list {{ list.id }} <button (click)="addItem()"> add item </button> <ng-content></ng-content></h5>
    <ul>
      <li *ngFor="let item of list.items; trackBy: trackByFn">
        <agdemo-item [item]="item"></agdemo-item>
        <button (click)="removeItem(item)"> remove item </button>
      </li>
    </ul>
  `,
})
export class AgDemoListWithoutOnPushComponent {
  @Input()
  list: any;

  addItem() {
    this.list.items.unshift(makeItem());
  }

  removeItem(item) {
    this.list.items = this.list.items.filter(i => i !== item);
  }
}

@Component({
  selector: 'agdemo-item',
  template: `
    item {{ item.id }}
  `,
})
export class AgDemoItemWithoutOnPushComponent {
  @Input()
  item;
}

let nextListId = 0;
function makeList() {
  const list = {
    id: nextListId++,
    items: [],
  };
  for (let i = 0; i < numOfItems; i++) { list.items.push(makeItem()); }
  return list;
}

let nextItemId = 0;
function makeItem() {
  const item = {
    id: nextItemId++,
  };
  return item;
}
