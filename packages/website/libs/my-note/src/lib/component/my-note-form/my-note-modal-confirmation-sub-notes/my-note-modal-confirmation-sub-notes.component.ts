import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'lib-my-note-modal-confirmation-sub-notes',
  templateUrl: './my-note-modal-confirmation-sub-notes.component.html',
  styleUrls: ['./my-note-modal-confirmation-sub-notes.component.scss']
})
export class MyNoteModalConfirmationSubNotesComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
