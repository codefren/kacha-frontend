import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeliveryPointPendingComponent } from './modal-delivery-point-pending.component';

describe('ModalDeliveryPointPendingComponent', () => {
  let component: ModalDeliveryPointPendingComponent;
  let fixture: ComponentFixture<ModalDeliveryPointPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeliveryPointPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeliveryPointPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
