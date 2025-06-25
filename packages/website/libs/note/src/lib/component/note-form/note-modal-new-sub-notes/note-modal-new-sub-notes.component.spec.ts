import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteModalNewSubNotesComponent } from './note-modal-new-sub-notes.component';

describe('NoteModalNewSubNotesComponent', () => {
  let component: NoteModalNewSubNotesComponent;
  let fixture: ComponentFixture<NoteModalNewSubNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteModalNewSubNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteModalNewSubNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
