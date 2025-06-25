import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeliveryPointsComponent } from './modal-delivery-points.component';

describe('ModalDeliveryPointsComponent', () => {
  let component: ModalDeliveryPointsComponent;
  let fixture: ComponentFixture<ModalDeliveryPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeliveryPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeliveryPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
