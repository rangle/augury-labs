import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LeakyFaucetComponent } from './leaky-faucet.component';

describe('LeakyFaucetComponent', () => {
  let component: LeakyFaucetComponent;
  let fixture: ComponentFixture<LeakyFaucetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeakyFaucetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeakyFaucetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
