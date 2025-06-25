import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementZoneComponent } from './management-zone.component';

describe('ManagementZoneComponent', () => {
  let component: ManagementZoneComponent;
  let fixture: ComponentFixture<ManagementZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
