import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementZoneTableComponent } from './management-zone-table.component';

describe('ManagementZoneTableComponent', () => {
  let component: ManagementZoneTableComponent;
  let fixture: ComponentFixture<ManagementZoneTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementZoneTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementZoneTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
