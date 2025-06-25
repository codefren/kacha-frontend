import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmVehicleComponent } from './confirm-vehicle.component';

describe('ConfirmVehicleComponent', () => {
  let component: ConfirmVehicleComponent;
  let fixture: ComponentFixture<ConfirmVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
