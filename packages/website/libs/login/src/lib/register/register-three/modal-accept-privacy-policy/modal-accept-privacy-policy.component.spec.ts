import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAcceptPrivacyPolicyComponent } from './modal-accept-privacy-policy.component';

describe('ModalAcceptPrivacyPolicyComponent', () => {
  let component: ModalAcceptPrivacyPolicyComponent;
  let fixture: ComponentFixture<ModalAcceptPrivacyPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAcceptPrivacyPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAcceptPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
