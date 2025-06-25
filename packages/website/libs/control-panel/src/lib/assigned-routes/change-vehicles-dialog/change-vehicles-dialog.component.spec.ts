import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeVehiclesDialogComponent } from './change-vehicles-dialog.component';

describe('ChangeVehiclesDialogComponent', () => {
  let component: ChangeVehiclesDialogComponent;
  let fixture: ComponentFixture<ChangeVehiclesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeVehiclesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeVehiclesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
