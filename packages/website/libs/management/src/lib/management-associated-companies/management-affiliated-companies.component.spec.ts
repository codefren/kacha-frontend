import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementAssociatedCompaniesComponent } from './management-associated-companies.component';

describe('MaganementAffiliatedCompaniesComponent', () => {
  let component: ManagementAssociatedCompaniesComponent;
  let fixture: ComponentFixture<ManaganementAssociatedCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementAssociatedCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementAssociatedCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
