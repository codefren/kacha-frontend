import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-confirmation-clients-linked',
  templateUrl: './modal-confirmation-clients-linked.component.html',
  styleUrls: ['./modal-confirmation-clients-linked.component.scss']
})

export class ModalConfirmationClientsLinkedComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
