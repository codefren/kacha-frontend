import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehiclesDialogComponent } from './add-vehicles-dialog.component';

describe('AddVehiclesDialogComponent', () => {
  let component: AddVehiclesDialogComponent;
  let fixture: ComponentFixture<AddVehiclesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVehiclesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVehiclesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
