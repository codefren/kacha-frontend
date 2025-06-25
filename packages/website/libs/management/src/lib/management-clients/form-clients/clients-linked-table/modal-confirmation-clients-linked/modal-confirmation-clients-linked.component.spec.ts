import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmationClientsLinkedComponent } from './modal-confirmation-clients-linked.component';

describe('ModalConfirmationClientsLinkedComponent', () => {
  let component: ModalConfirmationClientsLinkedComponent;
  let fixture: ComponentFixture<ModalConfirmationClientsLinkedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmationClientsLinkedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmationClientsLinkedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
