import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-confirm-document',
  templateUrl: './modal-confirm-document.component.html',
  styleUrls: ['./modal-confirm-document.component.scss']
})
export class ModalConfirmDocumentComponent implements OnInit {

  message: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
