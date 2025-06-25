import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesDialogFormComponent } from './companies-dialog-form.component';

describe('CompaniesDialogFormComponent', () => {
  let component: CompaniesDialogFormComponent;
  let fixture: ComponentFixture<CompaniesDialogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaniesDialogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
