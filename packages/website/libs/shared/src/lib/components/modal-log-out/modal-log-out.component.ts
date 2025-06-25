import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-log-out',
  templateUrl: './modal-log-out.component.html',
  styleUrls: ['./modal-log-out.component.scss']
})
export class ModalLogOutComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
