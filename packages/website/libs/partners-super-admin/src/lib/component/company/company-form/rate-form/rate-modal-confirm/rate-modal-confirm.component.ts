import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-rate-modal-confirm',
  templateUrl: './rate-modal-confirm.component.html',
  styleUrls: ['./rate-modal-confirm.component.scss']
})
export class RateModalConfirmComponent implements OnInit {

  message: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
