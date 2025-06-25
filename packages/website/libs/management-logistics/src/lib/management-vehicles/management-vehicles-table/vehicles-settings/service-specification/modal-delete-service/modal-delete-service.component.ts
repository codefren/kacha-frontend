import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-delete-service',
  templateUrl: './modal-delete-service.component.html',
  styleUrls: ['./modal-delete-service.component.scss']
})
export class ModalDeleteServiceComponent implements OnInit {

  title: string;
  message: string;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
