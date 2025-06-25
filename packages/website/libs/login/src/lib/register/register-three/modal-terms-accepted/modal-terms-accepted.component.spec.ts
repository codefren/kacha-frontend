import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTermsAcceptedComponent } from './modal-terms-accepted.component';

describe('ModalTermsAcceptedComponent', () => {
  let component: ModalTermsAcceptedComponent;
  let fixture: ComponentFixture<ModalTermsAcceptedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTermsAcceptedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTermsAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
