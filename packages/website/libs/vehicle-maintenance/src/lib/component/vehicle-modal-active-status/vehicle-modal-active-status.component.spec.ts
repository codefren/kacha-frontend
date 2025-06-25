import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleModalActiveStatusComponent } from './vehicle-modal-active-status.component';

describe('VehicleModalActiveStatusComponent', () => {
  let component: VehicleModalActiveStatusComponent;
  let fixture: ComponentFixture<VehicleModalActiveStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleModalActiveStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleModalActiveStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
