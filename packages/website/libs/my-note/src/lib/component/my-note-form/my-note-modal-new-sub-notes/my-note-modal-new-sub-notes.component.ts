import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubNotesInterface } from '@optimroute/backend';
import { NotesMessages } from '@optimroute/shared';

@Component({
  selector: 'lib-my-note-modal-new-sub-notes',
  templateUrl: './my-note-modal-new-sub-notes.component.html',
  styleUrls: ['./my-note-modal-new-sub-notes.component.scss']
})
export class MyNoteModalNewSubNotesComponent implements OnInit {
  @Input() SubnoteData: any;
  subNoteForm: FormGroup;
  Subnote: SubNotesInterface; 
  note_messages: any;


  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.load();
  }

  load(){
    if (this.SubnoteData == undefined) {
      this.Subnote = new SubNotesInterface();
      this.validaciones( this.Subnote);

    }else{
      this.validaciones(this.SubnoteData);
    }
    }
   

  validaciones(Subnote : SubNotesInterface) {
    this.subNoteForm = this.fb.group({
      title:[Subnote.title,[Validators.required ,Validators.minLength(2), Validators.maxLength(50)]],
      description:[Subnote.description, [Validators.required, Validators.minLength(10),Validators.maxLength(2000)]],
      companyNoteId:[Subnote.companyNoteId],
      id:[Subnote.id]
    });
    let note_messages = new NotesMessages();
    this.note_messages = note_messages.getNotesMessages();
  }

  createSubNote(){
    this.activeModal.close(this.subNoteForm.value)
  }


}
