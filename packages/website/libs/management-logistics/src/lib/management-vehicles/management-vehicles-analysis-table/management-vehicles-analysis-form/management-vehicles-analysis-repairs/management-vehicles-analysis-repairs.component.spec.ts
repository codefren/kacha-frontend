import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementVehiclesAnalysisRepairsComponent } from './management-vehicles-analysis-repairs.component';

describe('ManagementVehiclesAnalysisRepairsComponent', () => {
  let component: ManagementVehiclesAnalysisRepairsComponent;
  let fixture: ComponentFixture<ManagementVehiclesAnalysisRepairsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementVehiclesAnalysisRepairsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementVehiclesAnalysisRepairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
