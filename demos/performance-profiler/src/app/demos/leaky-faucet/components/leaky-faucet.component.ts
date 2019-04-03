import { Component } from '@angular/core';

@Component({
  selector: 'leaky-faucet',
  template: `
    <div>
      <p>{{ isDripping ? 'The faucet is dripping' : 'Faucet is not dripping' }}</p>
      <button type="button" class="btn btn-danger" (click)="toggleLeak()">
        {{ isDripping ? 'Stop dripping' : 'Start drip' }} (calls a recursive function using
        setTimeout)
      </button>
      <div class="drip">Faucet: {{ drip }}</div>
    </div>
    <app-run-outside-angular></app-run-outside-angular>
  `,
})
export class LeakyFaucetComponent {
  public isDripping = false;
  public drip = 'start the drip';
  public dripRate = 50;

  public toggleLeak() {
    if (!this.isDripping) {
      return this.startLeak();
    }
    return this.stopLeak();
  }

  private startLeak() {
    this.isDripping = true;
    const message = 'This is a very fast dripping faucet!';
    this.nextDrip(message);
  }

  private stopLeak() {
    this.isDripping = false;
  }

  private nextDrip(message: string) {
    setTimeout(() => {
      if (!this.isDripping) {
        return;
      }
      this.drip = message;
      if (message.length > 0) {
        this.nextDrip(message.slice(0, -1));
        return;
      }
      this.drip = ' fixed ';
      this.stopLeak();
    }, this.dripRate);
  }
}
