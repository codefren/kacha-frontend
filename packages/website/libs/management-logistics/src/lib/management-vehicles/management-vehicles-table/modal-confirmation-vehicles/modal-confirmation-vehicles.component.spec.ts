import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmationVehiclesComponent } from './modal-confirmation-vehicles.component';

describe('ModalConfirmationVehiclesComponent', () => {
  let component: ModalConfirmationVehiclesComponent;
  let fixture: ComponentFixture<ModalConfirmationVehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmationVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmationVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
