import { NgModule } from '@angular/core';
import { MyNoteComponent } from './my-note.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MyNoteListComponent } from './component/my-note-list/my-note-list.component';
import { MyNoteFormComponent } from './component/my-note-form/my-note-form.component';
import { SharedNoteComponent } from './component/my-note-form/shared-note/shared-note.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyNoteModalConfirmationSubNotesComponent } from './component/my-note-form/my-note-modal-confirmation-sub-notes/my-note-modal-confirmation-sub-notes.component';
import { MyNoteModalNewSubNotesComponent } from './component/my-note-form/my-note-modal-new-sub-notes/my-note-modal-new-sub-notes.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: MyNoteListComponent,
            },
            {
                path: ':my_note_id',
                component: MyNoteFormComponent,
            },
        ]),
        TranslateModule.forChild(),
        NgbModule,
    ],
    exports: [
        MyNoteComponent,
        MyNoteListComponent,
        MyNoteFormComponent,
        SharedNoteComponent,
        MyNoteModalConfirmationSubNotesComponent,
        MyNoteModalNewSubNotesComponent,
    ],
    declarations: [
        MyNoteComponent,
        MyNoteListComponent,
        MyNoteFormComponent,
        SharedNoteComponent,
        MyNoteModalConfirmationSubNotesComponent,
        MyNoteModalNewSubNotesComponent,
    ],
    entryComponents: [
        MyNoteComponent,
        MyNoteListComponent,
        MyNoteFormComponent,
        SharedNoteComponent,
        MyNoteModalConfirmationSubNotesComponent,
        MyNoteModalNewSubNotesComponent,
    ],
    providers: [DatePipe],
})
export class MyNoteModule {}
