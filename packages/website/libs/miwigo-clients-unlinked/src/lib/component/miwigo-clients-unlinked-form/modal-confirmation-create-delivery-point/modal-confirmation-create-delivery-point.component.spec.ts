import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmationCreateDeliveryPointComponent } from './modal-confirmation-create-delivery-point.component';

describe('ModalConfirmationCreateDeliveryPointComponent', () => {
  let component: ModalConfirmationCreateDeliveryPointComponent;
  let fixture: ComponentFixture<ModalConfirmationCreateDeliveryPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmationCreateDeliveryPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmationCreateDeliveryPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
