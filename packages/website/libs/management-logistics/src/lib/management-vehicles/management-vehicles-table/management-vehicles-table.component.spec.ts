import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementVehiclesTableComponent } from './management-vehicles-table.component';

describe('ManagementVehiclesTableComponent', () => {
  let component: ManagementVehiclesTableComponent;
  let fixture: ComponentFixture<ManagementVehiclesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementVehiclesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementVehiclesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
