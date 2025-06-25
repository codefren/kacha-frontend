import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleHistoryListComponent } from './vehicle-history-list.component';

describe('VehicleHistoryListComponent', () => {
  let component: VehicleHistoryListComponent;
  let fixture: ComponentFixture<VehicleHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
