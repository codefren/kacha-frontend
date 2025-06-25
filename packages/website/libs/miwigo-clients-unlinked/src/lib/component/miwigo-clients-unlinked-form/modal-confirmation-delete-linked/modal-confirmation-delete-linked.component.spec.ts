import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmationDeleteLinkedComponent } from './modal-confirmation-delete-linked.component';

describe('ModalConfirmationDeleteLinkedComponent', () => {
  let component: ModalConfirmationDeleteLinkedComponent;
  let fixture: ComponentFixture<ModalConfirmationDeleteLinkedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmationDeleteLinkedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmationDeleteLinkedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
