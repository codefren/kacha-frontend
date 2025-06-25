import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementClientsFormComponent } from './management-clients-form.component';

describe('ManagementClientsFormComponent', () => {
  let component: ManagementClientsFormComponent;
  let fixture: ComponentFixture<ManagementClientsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementClientsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementClientsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
