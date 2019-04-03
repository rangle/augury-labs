import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { User } from '../models/user';

@Component({
  selector: 'user-info-push',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .bg {
        background-color: red;
      }
    `,
  ],
  template: `
    <div [ngClass]="{ bg: user.isOnline }">
      <h4>User Info OnPush</h4>
      <p>
        <label>User Id: {{ user.id }} {{ user.isOnline }}</label>
      </p>
    </div>
  `,
})
export class UserInfoPush {
  @Input() public user: User;
}
