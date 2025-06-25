import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubNotesInterface } from '../../../../../../backend/src/lib/types/sub-notes.type';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotesMessages } from '../../../../../../shared/src/lib/messages/notes/notes.messages';

@Component({
  selector: 'easyroute-modal-observations',
  templateUrl: './modal-observations.component.html',
  styleUrls: ['./modal-observations.component.scss']
})
export class ModalObservationsComponent implements OnInit {

  observation: any = {
    id: '',
    deliveryPointId: '',
    observation: ''
  };
  observationForm: FormGroup;
  note_messages: any;

  title: any;


  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
    ) { }


  ngOnInit() {
    this.validaciones();
  }

  validaciones() {
    this.observationForm = this.fb.group({
      id: [this.observation.id],
      deliveryPointId: [this.observation.deliveryPointId],
      observation:[this.observation.observation, [Validators.required, Validators.minLength(10),Validators.maxLength(200)]],
    });
    let note_messages = new NotesMessages();
    this.note_messages = note_messages.getNotesMessages();
  }

  createSubNote(){
    this.activeModal.close(this.observationForm.value)
  }

}
