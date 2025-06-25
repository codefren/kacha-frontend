import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-user-modal-confirm-document',
  templateUrl: './user-modal-confirm-document.component.html',
  styleUrls: ['./user-modal-confirm-document.component.scss']
})
export class UserModalConfirmDocumentComponent implements OnInit {

  message: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
