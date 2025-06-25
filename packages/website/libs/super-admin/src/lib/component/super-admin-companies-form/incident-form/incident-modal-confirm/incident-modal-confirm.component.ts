import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-incident-modal-confirm',
  templateUrl: './incident-modal-confirm.component.html',
  styleUrls: ['./incident-modal-confirm.component.scss']
})
export class IncidentModalConfirmComponent implements OnInit {
  title: string;
  message: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
