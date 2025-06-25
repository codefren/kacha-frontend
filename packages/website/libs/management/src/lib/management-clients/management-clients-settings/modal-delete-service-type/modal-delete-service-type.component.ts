import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-delete-service-type',
  templateUrl: './modal-delete-service-type.component.html',
  styleUrls: ['./modal-delete-service-type.component.scss']
})
export class ModalDeleteServiceTypeComponent implements OnInit {

  title: string;
  message: string;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
