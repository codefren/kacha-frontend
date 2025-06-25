import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-active-client',
  templateUrl: './modal-active-client.component.html',
  styleUrls: ['./modal-active-client.component.scss']
})
export class ModalActiveClientComponent implements OnInit {

  @Input() data: any;

  constructor( public activeModal: NgbActiveModal ) { }

  ngOnInit() {
  }

}
