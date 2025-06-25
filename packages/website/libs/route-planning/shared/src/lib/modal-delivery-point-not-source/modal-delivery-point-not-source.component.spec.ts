import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeliveryPointNotSourceComponent } from './modal-delivery-point-not-source.component';

describe('ModalDeliveryPointNotSourceComponent', () => {
  let component: ModalDeliveryPointNotSourceComponent;
  let fixture: ComponentFixture<ModalDeliveryPointNotSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeliveryPointNotSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeliveryPointNotSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
