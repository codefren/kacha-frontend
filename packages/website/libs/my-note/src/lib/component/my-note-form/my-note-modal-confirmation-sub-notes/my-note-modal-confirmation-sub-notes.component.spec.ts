import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNoteModalConfirmationSubNotesComponent } from './my-note-modal-confirmation-sub-notes.component';

describe('MyNoteModalConfirmationSubNotesComponent', () => {
  let component: MyNoteModalConfirmationSubNotesComponent;
  let fixture: ComponentFixture<MyNoteModalConfirmationSubNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNoteModalConfirmationSubNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNoteModalConfirmationSubNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
