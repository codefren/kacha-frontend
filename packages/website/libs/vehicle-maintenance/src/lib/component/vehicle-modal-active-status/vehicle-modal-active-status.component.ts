import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-vehicle-modal-active-status',
  templateUrl: './vehicle-modal-active-status.component.html',
  styleUrls: ['./vehicle-modal-active-status.component.scss']
})
export class VehicleModalActiveStatusComponent implements OnInit {

  @Input() data: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
