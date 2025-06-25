import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChangeCompanyComponent } from './modal-change-company.component';

describe('ModalChangeCompanyComponent', () => {
  let component: ModalChangeCompanyComponent;
  let fixture: ComponentFixture<ModalChangeCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalChangeCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalChangeCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
