import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileInvoicingComponent } from './profile-invoicing.component';

describe('ProfileInvoicingComponent', () => {
  let component: ProfileInvoicingComponent;
  let fixture: ComponentFixture<ProfileInvoicingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileInvoicingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileInvoicingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
