import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalBillingComponent } from './total-billing.component';

describe('TotalBillingComponent', () => {
  let component: TotalBillingComponent;
  let fixture: ComponentFixture<TotalBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
