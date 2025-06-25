import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypeVehicleComponent } from './service-type-vehicle.component';

describe('ServiceTypeVehicleComponent', () => {
  let component: ServiceTypeVehicleComponent;
  let fixture: ComponentFixture<ServiceTypeVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceTypeVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTypeVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
