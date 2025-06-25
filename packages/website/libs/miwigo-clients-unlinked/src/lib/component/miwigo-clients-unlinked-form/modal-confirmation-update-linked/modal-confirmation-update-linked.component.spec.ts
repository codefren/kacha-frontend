import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmationUpdateLinkedComponent } from './modal-confirmation-update-linked.component';

describe('ModalConfirmationUpdateLinkedComponent', () => {
  let component: ModalConfirmationUpdateLinkedComponent;
  let fixture: ComponentFixture<ModalConfirmationUpdateLinkedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmationUpdateLinkedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmationUpdateLinkedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
