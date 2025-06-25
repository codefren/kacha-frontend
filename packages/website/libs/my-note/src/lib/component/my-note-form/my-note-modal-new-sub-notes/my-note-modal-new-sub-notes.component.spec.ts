import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNoteModalNewSubNotesComponent } from './my-note-modal-new-sub-notes.component';

describe('MyNoteModalNewSubNotesComponent', () => {
  let component: MyNoteModalNewSubNotesComponent;
  let fixture: ComponentFixture<MyNoteModalNewSubNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNoteModalNewSubNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNoteModalNewSubNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
