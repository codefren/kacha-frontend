import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-provider-active',
  templateUrl: './modal-provider-active.component.html',
  styleUrls: ['./modal-provider-active.component.scss']
})
export class ModalProviderActiveComponent implements OnInit {
  @Input() data: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
