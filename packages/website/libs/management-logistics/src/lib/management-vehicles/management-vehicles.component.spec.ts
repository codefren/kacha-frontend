import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementVehiclesComponent } from './management-vehicles.component';

describe('ManagementVehiclesComponent', () => {
  let component: ManagementVehiclesComponent;
  let fixture: ComponentFixture<ManagementVehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
