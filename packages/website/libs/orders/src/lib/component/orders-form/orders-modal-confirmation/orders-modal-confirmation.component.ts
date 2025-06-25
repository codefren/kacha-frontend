import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-orders-modal-confirmation',
  templateUrl: './orders-modal-confirmation.component.html',
  styleUrls: ['./orders-modal-confirmation.component.scss']
})
export class OrdersModalConfirmationComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
