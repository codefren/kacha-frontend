import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-activate-zone',
  templateUrl: './modal-activate-zone.component.html',
  styleUrls: ['./modal-activate-zone.component.scss']
})
export class ModalActivateZoneComponent implements OnInit {
  @Input() data: any;

  constructor( public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
