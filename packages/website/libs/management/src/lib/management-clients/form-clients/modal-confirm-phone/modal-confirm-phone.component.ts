import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-confirm-phone',
  templateUrl: './modal-confirm-phone.component.html',
  styleUrls: ['./modal-confirm-phone.component.scss']
})
export class ModalConfirmPhoneComponent implements OnInit {

  title: string;
  message: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
