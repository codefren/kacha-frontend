import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-delivery-modal-confirmation',
  templateUrl: './delivery-modal-confirmation.component.html',
  styleUrls: ['./delivery-modal-confirmation.component.scss']
})
export class DeliveryModalConfirmationComponent implements OnInit {

  title: string;
  message: string;
  constructor(public activeModal: NgbActiveModal) { }
  ngOnInit(){

  }

}
