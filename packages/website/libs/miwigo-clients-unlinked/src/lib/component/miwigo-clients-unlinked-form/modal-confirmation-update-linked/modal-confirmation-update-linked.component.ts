import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-confirmation-update-linked',
  templateUrl: './modal-confirmation-update-linked.component.html',
  styleUrls: ['./modal-confirmation-update-linked.component.scss']
})
export class ModalConfirmationUpdateLinkedComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
