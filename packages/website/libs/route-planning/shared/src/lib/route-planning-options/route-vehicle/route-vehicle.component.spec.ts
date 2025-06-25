import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteVehicleComponent } from './route-vehicle.component';

describe('RouteVehicleComponent', () => {
  let component: RouteVehicleComponent;
  let fixture: ComponentFixture<RouteVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
