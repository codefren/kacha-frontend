import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormVehiclesComponent } from './modal-form-vehicles.component';

describe('ModalFormVehiclesComponent', () => {
  let component: ModalFormVehiclesComponent;
  let fixture: ComponentFixture<ModalFormVehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFormVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFormVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
