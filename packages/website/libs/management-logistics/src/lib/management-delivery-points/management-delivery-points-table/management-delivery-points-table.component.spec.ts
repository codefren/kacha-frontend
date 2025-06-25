import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementDeliveryPointsTableComponent } from './management-delivery-points-table.component';

describe('ManagementDeliveryPointsTableComponent', () => {
  let component: ManagementDeliveryPointsTableComponent;
  let fixture: ComponentFixture<ManagementDeliveryPointsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementDeliveryPointsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementDeliveryPointsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
