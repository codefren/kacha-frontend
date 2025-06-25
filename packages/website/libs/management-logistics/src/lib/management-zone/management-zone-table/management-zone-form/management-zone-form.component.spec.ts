import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementZoneFormComponent } from './management-zone-form.component';

describe('ManagementZoneFormComponent', () => {
  let component: ManagementZoneFormComponent;
  let fixture: ComponentFixture<ManagementZoneFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementZoneFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementZoneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
