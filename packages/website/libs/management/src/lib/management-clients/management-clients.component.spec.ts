import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementClientsComponent } from './management-clients.component';

describe('ManagementClientsComponent', () => {
  let component: ManagementClientsComponent;
  let fixture: ComponentFixture<ManagementClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
