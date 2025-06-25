import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  title: boolean = false;
  message: string;
  card: boolean = false;
  noDelete: boolean = false;
  cssParrafo: boolean = false;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
