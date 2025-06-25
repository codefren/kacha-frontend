import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'lib-note-modal-confirmation-sub-notes',
  templateUrl: './note-modal-confirmation-sub-notes.component.html',
  styleUrls: ['./note-modal-confirmation-sub-notes.component.scss']
})
export class NoteModalConfirmationSubNotesComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
