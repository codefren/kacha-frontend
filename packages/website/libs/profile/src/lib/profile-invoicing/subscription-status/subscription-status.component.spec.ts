import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionStatusComponent } from './subscription-status.component';

describe('SubscriptionStatusComponent', () => {
  let component: SubscriptionStatusComponent;
  let fixture: ComponentFixture<SubscriptionStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
