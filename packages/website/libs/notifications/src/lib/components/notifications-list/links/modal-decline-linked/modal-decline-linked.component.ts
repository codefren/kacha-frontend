import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-decline-linked',
  templateUrl: './modal-decline-linked.component.html',
  styleUrls: ['./modal-decline-linked.component.scss']
})
export class ModalDeclineLinkedComponent implements OnInit {

  cssStyle: string = 'btn btn-primary mr-2'

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
