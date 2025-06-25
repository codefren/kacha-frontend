import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIntegrationConfirmDeleteDeliveryPointsComponent } from './modal-integration-confirm-delete-delivery-points.component';

describe('ModalIntegrationConfirmDeleteDeliveryPointsComponent', () => {
  let component: ModalIntegrationConfirmDeleteDeliveryPointsComponent;
  let fixture: ComponentFixture<ModalIntegrationConfirmDeleteDeliveryPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalIntegrationConfirmDeleteDeliveryPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIntegrationConfirmDeleteDeliveryPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
