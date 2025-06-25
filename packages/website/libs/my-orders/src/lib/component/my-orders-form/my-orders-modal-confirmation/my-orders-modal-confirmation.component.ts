import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-my-orders-modal-confirmation',
  templateUrl: './my-orders-modal-confirmation.component.html',
  styleUrls: ['./my-orders-modal-confirmation.component.scss']
})
export class MyOrdersModalConfirmationComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
