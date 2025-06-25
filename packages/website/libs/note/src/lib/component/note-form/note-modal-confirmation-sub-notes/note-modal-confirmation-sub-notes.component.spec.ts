import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteModalConfirmationSubNotesComponent } from './note-modal-confirmation-sub-notes.component';

describe('NoteModalConfirmationSubNotesComponent', () => {
  let component: NoteModalConfirmationSubNotesComponent;
  let fixture: ComponentFixture<NoteModalConfirmationSubNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteModalConfirmationSubNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteModalConfirmationSubNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
