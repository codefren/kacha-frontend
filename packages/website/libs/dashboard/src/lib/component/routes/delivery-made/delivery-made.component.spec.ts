import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryMadeComponent } from './delivery-made.component';

describe('DeliveryMadeComponent', () => {
  let component: DeliveryMadeComponent;
  let fixture: ComponentFixture<DeliveryMadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryMadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryMadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
