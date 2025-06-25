import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementDeliveryPointsComponent } from './management-delivery-points.component';

describe('ManagementDeliveryPointsComponent', () => {
  let component: ManagementDeliveryPointsComponent;
  let fixture: ComponentFixture<ManagementDeliveryPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementDeliveryPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementDeliveryPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
