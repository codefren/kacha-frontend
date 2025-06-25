import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-confirmation-create-delivery-point',
  templateUrl: './modal-confirmation-create-delivery-point.component.html',
  styleUrls: ['./modal-confirmation-create-delivery-point.component.scss']
})
export class ModalConfirmationCreateDeliveryPointComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
