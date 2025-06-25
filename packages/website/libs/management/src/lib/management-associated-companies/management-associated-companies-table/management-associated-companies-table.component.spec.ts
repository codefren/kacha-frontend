import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementAssociatedCompaniesTableComponent } from './management-associated-companies-table.component';

describe('MaganementAffiliatedCompaniesTableComponent', () => {
  let component: ManagementAssociatedCompaniesTableComponent;
  let fixture: ComponentFixture<ManagementAssociatedCompaniesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementAssociatedCompaniesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementAssociatedCompaniesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
