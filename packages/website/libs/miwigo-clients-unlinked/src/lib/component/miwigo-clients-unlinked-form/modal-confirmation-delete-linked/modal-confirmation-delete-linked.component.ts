import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-confirmation-delete-linked',
  templateUrl: './modal-confirmation-delete-linked.component.html',
  styleUrls: ['./modal-confirmation-delete-linked.component.scss']
})
export class ModalConfirmationDeleteLinkedComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
