import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-activate',
  templateUrl: './modal-activate.component.html',
  styleUrls: ['./modal-activate.component.scss']
})
export class ModalActivateComponent implements OnInit {

  @Input() data: any;


  constructor( public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
