import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementFormClientServiceTypeComponent } from './management-form-client-service-type.component';

describe('ManagementFormClientServiceTypeComponent', () => {
  let component: ManagementFormClientServiceTypeComponent;
  let fixture: ComponentFixture<ManagementFormClientServiceTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementFormClientServiceTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementFormClientServiceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
