import { NgModule } from '@angular/core';
import { NoteComponent } from './note.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NoteListComponent } from './component/note-list/note-list.component';
import { NoteFormComponent } from './component/note-form/note-form.component';
import { SharedNoteComponent } from './component/note-form/shared-note/shared-note.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NoteModalNewSubNotesComponent } from './component/note-form/note-modal-new-sub-notes/note-modal-new-sub-notes.component';
import { NoteModalConfirmationSubNotesComponent } from './component/note-form/note-modal-confirmation-sub-notes/note-modal-confirmation-sub-notes.component';

@NgModule({
  
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: NoteListComponent,
      },
      {
        path: ':note_id',
        component: NoteFormComponent
      }
    ]),
    TranslateModule.forChild(),
    NgbModule,
  ],
  declarations: [
    NoteComponent, 
    NoteListComponent, 
    NoteFormComponent, 
    SharedNoteComponent, 
    NoteModalNewSubNotesComponent, 
    NoteModalConfirmationSubNotesComponent
  ],
  exports: [
    NoteComponent, 
    NoteListComponent, 
    NoteFormComponent, 
    NoteModalNewSubNotesComponent, 
    NoteModalConfirmationSubNotesComponent 
  ],
  entryComponents:[
    NoteComponent, 
    NoteListComponent, 
    NoteFormComponent, 
    SharedNoteComponent, 
    NoteModalNewSubNotesComponent, 
    NoteModalConfirmationSubNotesComponent
  ],
  providers: [
    DatePipe
  ]
})
export class NoteModule { }
