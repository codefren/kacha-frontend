import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteDeliveryScheduleComponent } from './route-delivery-schedule.component';

describe('RouteDeliveryScheduleComponent', () => {
  let component: RouteDeliveryScheduleComponent;
  let fixture: ComponentFixture<RouteDeliveryScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteDeliveryScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteDeliveryScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
