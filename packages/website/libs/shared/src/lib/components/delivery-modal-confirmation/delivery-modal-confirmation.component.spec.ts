import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryModalConfirmationComponent } from './delivery-modal-confirmation.component';

describe('DeliveryModalConfirmationComponent', () => {
  let component: DeliveryModalConfirmationComponent;
  let fixture: ComponentFixture<DeliveryModalConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryModalConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryModalConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
